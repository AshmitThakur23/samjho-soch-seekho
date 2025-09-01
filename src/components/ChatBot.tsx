import { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import { ChatMessage, Language, DocumentAnalysis } from '@/types';
import { cn } from '@/lib/utils';

interface ChatBotProps {
  language: Language;
  documentAnalysis?: DocumentAnalysis | null;
  voiceEnabled?: boolean;
  onSpeechInput?: (text: string) => void;
}

export const ChatBot = ({ language, documentAnalysis, voiceEnabled, onSpeechInput }: ChatBotProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    // Simulate AI response with document context
    setTimeout(() => {
      let response = '';
      
      if (documentAnalysis) {
        // Generate contextual response based on document content in the same language as question
        const contextualResponses = {
          EN: [
            `Based on the document analysis, ${userMessage.toLowerCase().includes('risk') ? 'the main risks include: ' + documentAnalysis.highlights.filter(h => h.label === 'Risk').map(h => h.text).join(', ') : documentAnalysis.overview.split('.')[0]}.`,
            `From the rental agreement, ${userMessage.toLowerCase().includes('deposit') ? 'the security deposit is ₹75,000 (3 months rent)' : 'this is a standard 11-month lease with specific conditions'}.`,
            `Regarding your question about the document: ${documentAnalysis.explanations[0]?.meaning || 'The key points are covered in the highlights section.'}`
          ],
          HI: [
            `दस्तावेज़ विश्लेषण के आधार पर, ${userMessage.includes('जोखिम') || userMessage.includes('खतरा') ? 'मुख्य जोखिम हैं: ' + documentAnalysis.highlights.filter(h => h.label === 'Risk').map(h => h.text).join(', ') : documentAnalysis.overview.split('.')[0]}।`,
            `किराया समझौते से, ${userMessage.includes('जमा') || userMessage.includes('डिपॉजिट') ? 'सिक्यूरिटी डिपॉजिट ₹75,000 है (3 महीने का किराया)' : 'यह एक मानक 11-महीने का लीज़ है'}।`,
            `आपके प्रश्न के बारे में: ${documentAnalysis.explanations[0]?.meaning || 'मुख्य बिंदु हाइलाइट्स में शामिल हैं।'}`
          ]
        };
        
        const responseList = contextualResponses[questionLanguage];
        response = responseList[Math.floor(Math.random() * responseList.length)];
      } else {
        const fallbackResponses = {
          EN: ["Please upload a document first for me to provide specific analysis."],
          HI: ["कृपया पहले एक दस्तावेज़ अपलोड करें जिससे मैं विशिष्ट विश्लेषण प्रदान कर सकूं।"]
        };
        response = fallbackResponses[questionLanguage][0];
      }
      
      addMessage(response, false, questionLanguage);
      
      // Auto-speak response if voice is enabled
      if (voiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.lang = questionLanguage === 'HI' ? 'hi-IN' : 'en-US';
        speechSynthesis.speak(utterance);
      }
      
      setIsLoading(false);
    }, 1500);
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