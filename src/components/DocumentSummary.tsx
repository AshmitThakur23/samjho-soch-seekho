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
      {/* Summary Section */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-primary">
          📄 Document Summary
        </h2>
        <p className="text-lg leading-relaxed">
          {analysis.summary}
        </p>
      </div>

      {/* Highlights Section */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <span>🎯</span>
          <span>Key Highlights</span>
        </h3>
        
        <div className="space-y-4">
          {analysis.highlights.map((highlight, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-4 rounded-lg bg-card-glass/50 border border-border/50"
            >
              <div className="flex-shrink-0 mt-0.5">
                {getStatusIcon(highlight.label)}
              </div>
              <div className="flex-1">
                <div className={`font-medium ${getStatusColor(highlight.label)}`}>
                  {highlight.emoji} {highlight.label}
                </div>
                <p className="mt-1 text-foreground/90">
                  {highlight.text}
                </p>
              </div>
            </div>
          ))}
        </div>
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