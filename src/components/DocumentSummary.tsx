import { DocumentAnalysis, Language } from '@/types';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface DocumentSummaryProps {
  analysis: DocumentAnalysis;
  language: Language;
}

export const DocumentSummary = ({ analysis, language }: DocumentSummaryProps) => {
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

      {/* Document Line-by-Line Analysis */}
      {analysis.lines && analysis.lines.length > 0 && (
        <div className="glass-card rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <span>📋</span>
            <span>{language === 'HI' ? 'दस्तावेज़ लाइन विश्लेषण' : 'Document Line Analysis'}</span>
          </h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {analysis.lines.map((line, idx) => {
              const highlight = analysis.highlights.find(h => h.lineNumber === idx + 1);
              const statusLabel = highlight?.label || 'Safe';
              const getBgColor = (label: string) => {
                switch (label) {
                  case 'Risk': return 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800';
                  case 'Caution': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800';
                  default: return 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800';
                }
              };
              
              return (
                <div key={idx} className={`flex items-start gap-4 p-4 rounded-lg border transition-all hover:shadow-md ${getBgColor(statusLabel)}`}>
                  <div className="flex flex-col items-center gap-2 min-w-fit">
                    <div className="bg-background/80 px-3 py-1 rounded-full text-sm font-mono text-muted-foreground border">
                      {language === 'HI' ? `लाइन ${idx + 1}` : `Line ${idx + 1}`}
                    </div>
                    <div className="flex-shrink-0">{getStatusIcon(statusLabel)}</div>
                    <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      statusLabel === 'Risk' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      statusLabel === 'Caution' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {statusLabel}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed break-words text-foreground">{line}</p>
                  </div>
                </div>
              );
            })}
          </div>
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