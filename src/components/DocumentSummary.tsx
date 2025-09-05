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
            <span className="text-sm text-muted-foreground">({analysis.lines.length} lines)</span>
          </h3>
          
          {analysis.lines.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No document content available. Please upload a document again.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {analysis.lines.map((line, idx) => {
                // Skip empty lines
                if (!line || !line.trim()) return null;
                
                const highlight = analysis.highlights.find(h => h.lineNumber === idx + 1);
                const statusLabel = highlight?.label || 'Safe';
                
                const getBgColor = (label: string) => {
                  switch (label) {
                    case 'Risk': return 'bg-red-50 border-l-4 border-red-500 dark:bg-red-950/20 dark:border-red-600';
                    case 'Caution': return 'bg-yellow-50 border-l-4 border-yellow-500 dark:bg-yellow-950/20 dark:border-yellow-600';
                    default: return 'bg-green-50 border-l-4 border-green-500 dark:bg-green-950/20 dark:border-green-600';
                  }
                };
                
                const getTextStyle = (line: string) => {
                  // Check if this looks like a header/title
                  if (line.startsWith('📋') || line.startsWith('📊')) {
                    return 'text-base font-semibold text-primary';
                  }
                  // Check if this looks like structured content
                  if (line.includes(':') && line.length < 80) {
                    return 'text-sm font-medium text-foreground';
                  }
                  return 'text-sm leading-relaxed text-foreground';
                };
                
                return (
                  <div key={idx} className={`p-4 rounded-lg transition-all hover:shadow-sm ${getBgColor(statusLabel)}`}>
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2 min-w-fit">
                        <span className="text-xs font-mono bg-background/60 px-2 py-1 rounded text-muted-foreground border">
                          {idx + 1}
                        </span>
                        <div className="flex-shrink-0">{getStatusIcon(statusLabel)}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`break-words ${getTextStyle(line)}`}>
                          {line}
                        </p>
                        {statusLabel !== 'Safe' && (
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
          )}
        </div>
      )}

      {/* Debug info - temporarily visible */}
      <div className="glass-card rounded-xl p-4 mb-6 text-xs bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
        <p><strong>Debug Info:</strong></p>
        <p>Total lines in analysis: {analysis.lines?.length || 0}</p>
        <p>Lines type: {typeof analysis.lines}</p>
        <p>Sample lines: {analysis.lines?.slice(0, 3).map((line, i) => `${i+1}: "${line?.substring(0, 50)}..."`).join(' | ') || 'No lines found'}</p>
        <p>Highlights count: {analysis.highlights?.length || 0}</p>
      </div>


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