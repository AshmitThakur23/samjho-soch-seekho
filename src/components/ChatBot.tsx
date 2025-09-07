import { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import { ChatMessage, Language, DocumentAnalysis } from '@/types';
import { cn } from '@/lib/utils';
import { translateTextToHindi } from '@/utils/documentTranslator';

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
  const idCounterRef = useRef(0);

  // Clear chat history when document changes
  useEffect(() => {
    setMessages([]);
    idCounterRef.current = 0;
  }, [currentDocument, documentContent]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, isUser: boolean, messageLanguage?: Language) => {
    idCounterRef.current += 1;
    const newMessage: ChatMessage = {
      id: `${Date.now()}-${idCounterRef.current}`,
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

// Extract requested paragraph/line number from queries like:
// "paragraph 4", "line 9", "explain para 5", "पैराग्राफ 7", "अनुच्छेद 3"
function extractLineNumber(text: string): number | null {
  const t = text.toLowerCase();
  // Pattern A: (paragraph|para|line|पैराग्राफ|अनुच्छेद|लाइन|पंक्ति) ... number
  let m = t.match(/(?:paragraph|para|line|पैराग्राफ|अनुच्छेद|लाइन|पंक्ति)\s*(?:no\.?|number)?\s*[:#-]?\s*(\d{1,5})/i);
  if (m) return parseInt(m[1], 10);
  // Pattern B: number ... (paragraph|para|line|...)
  m = t.match(/(\d{1,5})\s*(?:paragraph|para|line|पैराग्राफ|अनुच्छेद|लाइन|पंक्ति)/i);
  if (m) return parseInt(m[1], 10);
  // Pattern C: single small number mentioned in a short query
  const nums = t.match(/\d{1,5}/g);
  if (nums && nums.length === 1 && t.length < 40) return parseInt(nums[0], 10);
  return null;
}

  // Create a simple, varied explanation with examples
  function makeExplanation(text: string, label: string, lang: Language): string {
    const simplified = text
      .replace(/\bnotwithstanding\b/gi, lang === 'HI' ? 'इसके बावजूद' : 'despite')
      .replace(/\bshall\b/gi, lang === 'HI' ? 'अवश्य करेगा/करनी होगी' : 'must')
      .replace(/\bhereby\b/gi, '')
      .replace(/\bthereof\b/gi, lang === 'HI' ? 'उसका/उसकी' : 'of it');

    // Detect numbers, % and time windows for a tiny example
    const perc = text.match(/(\d{1,3})(?:\.\d+)?\s*%/);
    const time = text.match(/(\d{1,4})\s*(day|days|month|months|year|years|दिन|महीना|महीने|साल)/i);

    const introEN = ['In simple words:', 'Put simply:', 'Plainly:', 'Easy version:'];
    const introHI = ['सरल भाषा में:', 'आसान शब्दों में:', 'सीधे शब्दों में:', 'समझने लायक तरीके से:'];
    const intro = lang === 'HI' ? introHI : introEN;
    const introLine = intro[Math.floor((Date.now()/1000) % intro.length)];

    const statusEN = label === 'Risk' ? 'This could be risky.' : label === 'Caution' ? 'Be careful here.' : 'Looks safe.';
    const statusHI = label === 'Risk' ? 'यह जोखिम भरा हो सकता है।' : label === 'Caution' ? 'यहाँ सावधानी रखें।' : 'यह सुरक्षित दिखता है।';

    let example = '';
    if (perc) {
      const p = parseFloat(perc[1]);
      const calc = Math.round(10000 * (p/100));
      example = lang === 'HI'
        ? `उदाहरण: यदि आधार राशि ₹10,000 है तो ${p}% का मतलब ₹${calc} होगा।`
        : `Example: If the base amount is ₹10,000, ${p}% means ₹${calc}.`;
    } else if (time) {
      example = lang === 'HI'
        ? `उदाहरण: यदि आज से ${time[1]} ${time[2]} का समय दिया है, तो समय सीमा उसके बाद पूरी होगी।`
        : `Example: If the clause gives ${time[1]} ${time[2]}, the deadline is after that period.`;
    }

    const lines = [
      `${lang === 'HI' ? 'साधारण मतलब' : 'Simple meaning'}: ${simplified}`,
      `${lang === 'HI' ? 'स्थिति' : 'Status'}: ${lang === 'HI' ? statusHI : statusEN}`,
    ];
    if (example) lines.push(example);

    let result = `${introLine}\n- ${lines.join('\n- ')}`;
    if (lang === 'HI') {
      try {
        // Attempt to translate more words for consistency
        result = translateTextToHindi(result);
      } catch {}
    }
    return result;
  }

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

  // Handle explicit line-number queries (EN/HIN, flexible word order)
  const requested = extractLineNumber(userMessage);
  if (requested !== null) {
    const n = Math.max(1, Math.min(lines.length, requested));
    const raw = lines[n - 1];
    if (!raw) {
      addMessage(questionLanguage === 'HI' ? `लाइन ${requested} नहीं मिली।` : `Line ${requested} not found.`, false, questionLanguage);
      setIsLoading(false);
      return;
    }
    const label = labelsByLine[n] || 'Safe';
    const shown = questionLanguage === 'HI' ? translateTextToHindi(raw) : raw;

const header = questionLanguage === 'HI' ? `अनुच्छेद ${n}: ${shown}` : `Paragraph ${n}: ${shown}`;
addMessage(header, false, questionLanguage);

const expl = makeExplanation(raw, label, questionLanguage);
addMessage(expl, false, questionLanguage);
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
  response = `आपके प्रश्न का उत्तर:\n\n${contextLines.join('\n\n')}\n\n(अनुच्छेद ${topResult.index + 1} और आसपास के अनुच्छेदों से)`;
} else {
  response = `Answer to your question:\n\n${contextLines.join('\n\n')}\n\n(From paragraph ${topResult.index + 1} and surrounding context)`;
}
  }

  addMessage(response, false, questionLanguage);

  if (voiceEnabled && 'speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(response);
    utterance.lang = questionLanguage === 'HI' ? 'hi-IN' : 'en-US';
    const voices = speechSynthesis.getVoices();
    const prefer = questionLanguage === 'HI' ? 'hi' : 'en';
    const candidates = voices.filter(v => v.lang?.toLowerCase().startsWith(prefer));
    const chosen = candidates.find(v => /hi-?in/i.test(v.lang) || /hindi|india/i.test(v.name)) || candidates[0];
    if (chosen) utterance.voice = chosen;
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
  const tokens = q.match(/[\p{L}a-zA-Z0-9%₹$-]+/gu) || [];
  const stop = new Set(['what','is','the','a','an','and','or','in','on','to','for','of','hi','line','explain','tell','me','about','मुझे','लाइन','समझाओ','बताओ']);
  const keys = tokens.filter(t => !stop.has(t) && t.length > 2);
  
  const scored = lines.map((text, index) => {
    const lower = text.toLowerCase();
    let score = 0;
    
    if (lower.includes(q)) score += 10; // exact phrase match
    
    for (const k of keys) {
      if (lower.includes(k)) score += k.length > 4 ? 3 : 2; // keyword match
      if (/^\d+(\.\d+)?$/.test(k) && new RegExp(`\\b${k}\\b`).test(lower)) score += 2; // numbers
    }
    
    // Basic domain cues
    if (/(loan|interest|rate|amount|payment|emi|tenure|ltv|clause|term|condition)/.test(lower)) score += 1;
    if (/(penalty|fine|default|termination|fee|charge|liability|indemn)/.test(lower)) score += 1;
    if (/(insurance|requirement|document|notice|period)/.test(lower)) score += 1;
    
    return { index, text, score };
  });
  
  // Prefer unique, diverse top lines to avoid repetitive answers
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
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
        
        {messages.map((message, index) => (
          <div
            key={`${message.id}-${index}`}
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