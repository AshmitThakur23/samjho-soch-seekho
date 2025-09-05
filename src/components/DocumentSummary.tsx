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

      {/* Document Content Analysis */}
      {analysis.lines && analysis.lines.length > 0 && (
        <div className="glass-card rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <span>📄</span>
            <span>{language === 'HI' ? 'दस्तावेज़ की सामग्री' : 'Document Content'}</span>
          </h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {analysis.lines.map((line, idx) => {
              // Skip empty lines
              if (!line.trim()) return null;
              
              const highlight = analysis.highlights.find(h => h.lineNumber === idx + 1);
              const statusLabel = highlight?.label || 'Safe';
              const getBgColor = (label: string) => {
                switch (label) {
                  case 'Risk': return 'bg-red-50 border-l-4 border-red-500 dark:bg-red-950/20 dark:border-red-600';
                  case 'Caution': return 'bg-yellow-50 border-l-4 border-yellow-500 dark:bg-yellow-950/20 dark:border-yellow-600';
                  default: return 'bg-green-50 border-l-4 border-green-500 dark:bg-green-950/20 dark:border-green-600';
                }
              };
              
              const getTextSize = (line: string) => {
                // Headers and titles are usually shorter and in caps or have special formatting
                if (line.length < 50 && (line.includes(':') || line.toUpperCase() === line)) {
                  return 'text-lg font-semibold text-primary';
                }
                return 'text-sm leading-relaxed text-foreground';
              };
              
              return (
                <div key={idx} className={`p-4 rounded-lg transition-all hover:shadow-sm ${getBgColor(statusLabel)}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2 min-w-fit">
                      <span className="text-xs font-mono bg-background/60 px-2 py-1 rounded text-muted-foreground">
                        {idx + 1}
                      </span>
                      <div className="flex-shrink-0">{getStatusIcon(statusLabel)}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`break-words ${getTextSize(line)}`}>
                        {line}
                      </p>
                      {statusLabel !== 'Safe' && highlight && (
                        <p className="text-xs mt-2 text-muted-foreground italic">
                          💡 This line contains {statusLabel.toLowerCase()} content - review carefully
                        </p>
                      )}
                    </div>
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