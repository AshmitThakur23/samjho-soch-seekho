import { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import { ChatMessage, Language } from '@/types';
import { cn } from '@/lib/utils';

interface ChatBotProps {
  language: Language;
  onSpeechInput?: (text: string) => void;
}

export const ChatBot = ({ language, onSpeechInput }: ChatBotProps) => {
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

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      language,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    addMessage(userMessage, true);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = {
        EN: [
          "I understand you're asking about this document. Based on the analysis, here's what I can tell you...",
          "That's a great question about the document. Let me explain...",
          "From the document analysis, this means...",
        ],
        HI: [
          "मैं समझ गया हूं कि आप इस दस्तावेज के बारे में पूछ रहे हैं। विश्लेषण के आधार पर, यह है जो मैं आपको बता सकता हूं...",
          "दस्तावेज के बारे में यह एक बहुत अच्छा प्रश्न है। मुझे समझाने दें...",
          "दस्तावेज विश्लेषण से, इसका मतलब है...",
        ]
      };
      
      const responseList = responses[language];
      const randomResponse = responseList[Math.floor(Math.random() * responseList.length)];
      
      addMessage(randomResponse, false);
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