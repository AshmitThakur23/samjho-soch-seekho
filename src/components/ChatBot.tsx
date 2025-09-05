import { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import { ChatMessage, Language, DocumentAnalysis } from '@/types';
import { cn } from '@/lib/utils';

interface ChatBotProps {
  language: Language;
  documentAnalysis?: DocumentAnalysis | null;
  voiceEnabled?: boolean;
  onSpeechInput?: (text: string) => void;
  currentDocument?: File | null;
  documentContent?: string;
}

export const ChatBot = ({ language, documentAnalysis, voiceEnabled, onSpeechInput, currentDocument, documentContent = '' }: ChatBotProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Clear chat history when document changes
  useEffect(() => {
    setMessages([]);
  }, [currentDocument, documentContent]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, isUser: boolean, messageLanguage?: Language) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      language: messageLanguage || language,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Detect language of text
  const detectLanguage = (text: string): Language => {
    // Simple detection based on character patterns
    const hindiPattern = /[\u0900-\u097F]/;
    if (hindiPattern.test(text)) {
      return 'HI';
    }
    return 'EN';
  };

const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = input.trim();
  const questionLanguage = detectLanguage(userMessage);
  setInput('');
  addMessage(userMessage, true, questionLanguage);
  setIsLoading(true);

  if (!currentDocument || (!documentAnalysis && !documentContent)) {
    const noDoc = questionLanguage === 'HI' ? 'कृपया पहले एक दस्तावेज़ अपलोड करें।' : 'Please upload a document first.';
    addMessage(noDoc, false, questionLanguage);
    setIsLoading(false);
    return;
  }

  // Build searchable lines and optional line-level labels
  const lines: string[] = (documentAnalysis?.lines && documentAnalysis.lines.length > 0)
    ? documentAnalysis.lines
    : toLogicalLines(documentContent || '');
  const labelsByLine: Record<number, string> = {};
  documentAnalysis?.highlights?.forEach(h => {
    if (h.lineNumber) labelsByLine[h.lineNumber] = h.label;
  });

  // Handle "line N" questions
  const lineMatch = userMessage.match(/(?:line|लाइन)\s*(\d+)/i);
  if (lineMatch) {
    const n = parseInt(lineMatch[1], 10);
    const text = lines[n - 1];
    const label = labelsByLine[n] || 'Safe';
    const resp = questionLanguage === 'HI'
      ? (text ? `लाइन ${n}: ${text}\nस्थिति: ${label}` : `लाइन ${n} नहीं मिली।`)
      : (text ? `Line ${n}: ${text}\nStatus: ${label}` : `Line ${n} not found.`);
    addMessage(resp, false, questionLanguage);
    setIsLoading(false);
    return;
  }

  // Enhanced keyword search with context
  const results = searchRelevantLines(userMessage, lines, 5);
  let response = '';
  
  if (results.length === 0) {
    response = questionLanguage === 'HI'
      ? 'दस्तावेज़ में उपयुक्त जानकारी नहीं मिली। कृपया अलग तरह से पूछें।'
      : 'Could not find relevant information in the document. Please try rephrasing.';
  } else {
    // Get detailed answer based on the question context
    const topResult = results[0];
    const contextLines = getContextLines(lines, topResult.index, 2);
    
    if (questionLanguage === 'HI') {
      response = `आपके प्रश्न का उत्तर:\n\n${contextLines.join('\n\n')}\n\n(लाइन ${topResult.index + 1} और आसपास की लाइनों से)`;
    } else {
      response = `Answer to your question:\n\n${contextLines.join('\n\n')}\n\n(From line ${topResult.index + 1} and surrounding context)`;
    }
  }

  addMessage(response, false, questionLanguage);

  if (voiceEnabled && 'speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(response);
    utterance.lang = questionLanguage === 'HI' ? 'hi-IN' : 'en-US';
    speechSynthesis.speak(utterance);
  }

  setIsLoading(false);
};

// Helpers for ChatBot (local, no network)
const toLogicalLines = (text: string): string[] => {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\t/g, ' ').replace(/ +/g, ' ').trim();
  const chunks = normalized.split(/\n+/).flatMap(block =>
    block.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean)
  );
  const out: string[] = [];
  for (const c of chunks) {
    const t = c.replace(/\s{2,}/g, ' ');
    if (t && t !== out[out.length - 1]) out.push(t);
  }
  return out;
};

const searchRelevantLines = (query: string, lines: string[], topK = 3) => {
  const q = query.toLowerCase();
  const tokens = q.match(/[a-zA-Z0-9%₹$-]+/g) || [];
  const stop = new Set(['what','is','the','a','an','and','or','in','on','to','for','of','hi','line','explain','tell','me','about']);
  const keys = tokens.filter(t => !stop.has(t) && t.length > 2);
  
  const scored = lines.map((text, index) => {
    const lower = text.toLowerCase();
    let score = 0;
    
    // Exact phrase matching gets highest score
    if (lower.includes(q)) score += 10;
    
    // Individual keyword matching
    for (const k of keys) {
      if (lower.includes(k)) {
        // Longer keywords get higher scores
        score += k.length > 4 ? 3 : 2;
      }
      // Numeric search: interest 9.5%, 5000 etc.
      if (/^\d+(\.\d+)?$/.test(k) && new RegExp(`\\b${k}\\b`).test(lower)) score += 2;
    }
    
    // Context-based scoring
    if (/(loan|interest|rate|amount|payment|emi|tenure|ltv)/.test(lower)) score += 1;
    if (/(penalty|fine|default|termination|fee|charge)/.test(lower)) score += 1;
    if (/(insurance|requirement|document|condition)/.test(lower)) score += 1;
    
    return { index, text, score };
  });
  
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
};

const getContextLines = (lines: string[], centerIndex: number, contextSize: number = 2) => {
  const start = Math.max(0, centerIndex - contextSize);
  const end = Math.min(lines.length, centerIndex + contextSize + 1);
  return lines.slice(start, end);
};

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = language === 'HI' ? 'hi-IN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const detectedLang = detectLanguage(transcript);
        
        // Check if detected language is supported
        if (detectedLang !== 'EN' && detectedLang !== 'HI') {
          addMessage("Currently supported: English and Hindi. Please choose one.", false);
          return;
        }
        
        setInput(transcript);
        onSpeechInput?.(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
        addMessage(
          language === 'HI' 
            ? "माफ करें, मैं आपकी आवाज़ नहीं सुन सका। कृपया फिर से कोशिश करें।"
            : "Sorry, I couldn't hear you clearly. Please try again.",
          false
        );
      };

      recognition.start();
    }
  };

  return (
    <div className="glass-card rounded-xl p-6 mt-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
        <span>💬</span>
        <span>{language === 'HI' ? 'सवाल पूछें' : 'Ask Questions'}</span>
      </h3>

      {/* Messages */}
      <div className="h-64 overflow-y-auto mb-4 space-y-3 p-3 bg-background/20 rounded-lg">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            {language === 'HI' 
              ? 'दस्तावेज़ के बारे में कोई भी सवाल पूछें...'
              : 'Ask any question about the document...'
            }
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.isUser ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] p-3 rounded-lg",
                message.isUser
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-muted-foreground p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={language === 'HI' ? 'अपना सवाल टाइप करें...' : 'Type your question...'}
          className="flex-1 px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        
        <button
          onClick={startListening}
          disabled={isListening}
          className={cn(
            "p-2 rounded-lg border border-border hover:bg-muted transition-colors",
            isListening && "bg-destructive text-destructive-foreground animate-pulse"
          )}
          title={language === 'HI' ? 'आवाज़ से बोलें' : 'Speak'}
        >
          <Mic className="w-5 h-5" />
        </button>
        
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-glow transition-colors disabled:opacity-50"
          title={language === 'HI' ? 'भेजें' : 'Send'}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};