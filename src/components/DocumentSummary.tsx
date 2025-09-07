import { useMemo, useState } from 'react';
import { DocumentAnalysis, Language } from '@/types';
import { CheckCircle, AlertTriangle, XCircle, Volume2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
interface DocumentSummaryProps {
  analysis: DocumentAnalysis;
  language: Language;
  voiceEnabled?: boolean;
  onSpeakParagraph?: (text: string, lang: Language) => void;
}

export const DocumentSummary = ({ analysis, language, voiceEnabled, onSpeakParagraph }: DocumentSummaryProps) => {
  const getStatusIcon = (label: string) => {
    switch (label) {
      case 'Safe':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'Caution':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'Risk':
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusColor = (label: string) => {
    switch (label) {
      case 'Safe':
        return 'text-success';
      case 'Caution':
        return 'text-warning';
      case 'Risk':
        return 'text-destructive';
      default:
        return 'text-foreground';
    }
  };

  const [view, setView] = useState<'summary' | 'full'>('full');

  const explanationByIndex = useMemo(() => {
    const map = new Map<number, { meaning: string; example: string }>();
    analysis.explanations.forEach((e) => {
      const m = e.clause.match(/(Line|लाइन|अनुच्छेद|Paragraph|पैराग्राफ)\s*(\d{1,5})/i);
      if (m) {
        const n = parseInt(m[2], 10);
        if (!isNaN(n)) map.set(n, { meaning: e.meaning, example: e.example });
      }
    });
    return map;
  }, [analysis.explanations]);

  return (
    <div className="space-y-6" id="document-summary">
      {/* Overview Section */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-primary">
          📄 Document Overview
        </h2>
        <div className="text-lg leading-relaxed space-y-4">
          {analysis.overview.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Document Paragraphs */}
      {analysis.lines && analysis.lines.length > 0 && (
        <div className="glass-card rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center space-x-2">
              <span>📄</span>
              <span>{language === 'HI' ? 'दस्तावेज़ के अनुच्छेद' : 'Document Paragraphs'}</span>
              <span className="text-sm text-muted-foreground">({analysis.lines.length})</span>
            </h3>
            <Tabs value={view} onValueChange={(v) => setView(v as 'summary' | 'full')}>
              <TabsList>
                <TabsTrigger value="summary">{language === 'HI' ? 'सारांश' : 'Summary'}</TabsTrigger>
                <TabsTrigger value="full">{language === 'HI' ? 'पूरा पाठ' : 'Full text'}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {(view === 'summary'
            ? analysis.lines.map((line, idx) => ({ line, idx })).filter(({ idx }) => (analysis.highlights.find(h => h.lineNumber === idx + 1)?.label || 'Safe') !== 'Safe')
            : analysis.lines.map((line, idx) => ({ line, idx }))
          ).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>{language === 'HI' ? 'कोई सामग्री उपलब्ध नहीं है।' : 'No document content available.'}</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {(view === 'summary'
                ? analysis.lines.map((line, idx) => ({ line, idx })).filter(({ idx }) => (analysis.highlights.find(h => h.lineNumber === idx + 1)?.label || 'Safe') !== 'Safe')
                : analysis.lines.map((line, idx) => ({ line, idx }))
              ).map(({ line, idx }) => {
                if (!line || !line.trim()) return null;
                const highlight = analysis.highlights.find(h => h.lineNumber === idx + 1);
                const statusLabel = highlight?.label || 'Safe';
                const emoji = (highlight as any)?.emoji || (statusLabel === 'Risk' ? '❌' : statusLabel === 'Caution' ? '⚠️' : '✅');

                const getBgColor = (label: string) => {
                  switch (label) {
                    case 'Risk': return 'bg-red-50 border-l-4 border-red-500 dark:bg-red-950/20 dark:border-red-600';
                    case 'Caution': return 'bg-yellow-50 border-l-4 border-yellow-500 dark:bg-yellow-950/20 dark:border-yellow-600';
                    default: return 'bg-green-50 border-l-4 border-green-500 dark:bg-green-950/20 dark:border-green-600';
                  }
                };
                
                const getTextStyle = (line: string) => {
                  if (line.startsWith('📋') || line.startsWith('📊')) {
                    return 'text-base font-semibold text-primary';
                  }
                  if (line.includes(':') && line.length < 80) {
                    return 'text-sm font-medium text-foreground';
                  }
                  return 'text-sm leading-relaxed text-foreground';
                };

                const explanation = explanationByIndex.get(idx + 1);

                const speakText = `${emoji} ${statusLabel}: ${line}`;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg transition-all hover:shadow-sm ${getBgColor(statusLabel)} cursor-pointer`}
                    role="button"
                    onClick={() => {
                      if (typeof window !== 'undefined' && (window as any).speechSynthesis && speakText) {
                        // Delegate to parent if provided, else speak directly
                        if (typeof (onSpeakParagraph) === 'function') {
                          onSpeakParagraph(speakText, language);
                        } else if ('speechSynthesis' in window) {
                          const u = new SpeechSynthesisUtterance(speakText);
                          u.lang = language === 'HI' ? 'hi-IN' : 'en-US';
                          speechSynthesis.cancel();
                          speechSynthesis.speak(u);
                        }
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2 min-w-fit">
                        <span className="text-xs font-mono bg-background/60 px-2 py-1 rounded text-muted-foreground border">
                          {idx + 1}
                        </span>
                        <div className="flex-shrink-0">{getStatusIcon(statusLabel)}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`whitespace-pre-wrap break-words ${getTextStyle(line)}`}>
                          {line}
                        </p>
                        {explanation && (
                          <div className="text-xs mt-2 text-muted-foreground">
                            <p><strong>{language === 'HI' ? 'मतलब' : 'Meaning'}:</strong> {explanation.meaning}</p>
                            {explanation.example && (
                              <p className="mt-1"><strong>{language === 'HI' ? 'उदाहरण' : 'Example'}:</strong> {explanation.example}</p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="opacity-70 ml-2">
                        <Volume2 className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Explanations Section */}
      {analysis.explanations.length > 0 && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <span>💡</span>
            <span>What This Means</span>
          </h3>
          
          <div className="space-y-4">
            {analysis.explanations.map((explanation, index) => (
              <div key={index} className="border-l-4 border-primary pl-4">
                <div className="font-medium text-primary mb-2">
                  "{explanation.clause}"
                </div>
                <p className="mb-2 text-foreground/90">
                  <strong>Meaning:</strong> {explanation.meaning}
                </p>
                <p className="text-muted-foreground">
                  <strong>Example:</strong> {explanation.example}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Items */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <span>✅</span>
          <span>What This Means For You</span>
        </h3>
        
        <ul className="space-y-3">
          {analysis.actions.map((action, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary-foreground">
                  {index + 1}
                </span>
              </div>
              <p className="text-foreground/90 leading-relaxed">
                {action}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};