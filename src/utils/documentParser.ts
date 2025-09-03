import { DocumentAnalysis } from '@/types';

// Document parsing utilities
export const parseDocument = async (file: File): Promise<string> => {
  const fileType = file.type;
  
  try {
    if (fileType === 'application/pdf') {
      return await parsePDF(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return await parseDOCX(file);
    } else if (fileType === 'text/plain') {
      return await parseTXT(file);
    } else {
      throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT files.');
    }
  } catch (error) {
    console.error('Document parsing error:', error);
    throw new Error('Failed to parse document. Please try again with a different file.');
  }
};

const parsePDF = async (file: File): Promise<string> => {
  // Use dynamic import for client-side parsing
  const pdfParse = await import('pdf-parse/lib/pdf-parse');
  const arrayBuffer = await file.arrayBuffer();
  const data = await pdfParse.default(arrayBuffer);
  return data.text;
};

const parseDOCX = async (file: File): Promise<string> => {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

const parseTXT = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read text file'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};

// AI-powered document analysis
export const analyzeDocument = async (content: string, fileName: string): Promise<DocumentAnalysis> => {
  // Basic content validation
  if (!content || content.trim().length < 50) {
    throw new Error('Document content is too short or empty. Please upload a valid document.');
  }

  // Simulate AI analysis - in production, this would call an AI service
  const wordCount = content.split(/\s+/).length;
  const isContract = /\b(agreement|contract|lease|rental|tenant|landlord)\b/i.test(content);
  const isLegal = /\b(clause|section|terms|conditions|liability|penalty)\b/i.test(content);
  
  // Generate dynamic analysis based on content
  const overview = generateOverview(content, fileName, wordCount);
  const highlights = generateHighlights(content, isContract, isLegal);
  const explanations = generateExplanations(content, isContract);
  const actions = generateActions(content, isContract, isLegal);

  return {
    overview,
    highlights,
    explanations,
    actions
  };
};

const generateOverview = (content: string, fileName: string, wordCount: number): string => {
  const contentPreview = content.substring(0, 200).trim();
  
  return `Document: ${fileName} (${wordCount} words). This document contains ${contentPreview}... 

The analysis shows this document requires careful review. Key terms and conditions have been identified that may impact your rights and obligations. Please review the highlights and recommendations below to understand the important aspects of this document.`;
};

const generateHighlights = (content: string, isContract: boolean, isLegal: boolean) => {
  const highlights = [];
  
  // Safe highlights
  if (isLegal) {
    highlights.push({
      label: 'Safe',
      emoji: '✅',
      color: 'success' as const,
      text: 'Document follows standard legal formatting and structure'
    });
  }
  
  // Warning highlights
  if (content.includes('penalty') || content.includes('fine')) {
    highlights.push({
      label: 'Caution',
      emoji: '⚠️',
      color: 'warning' as const,
      text: 'Document contains penalty or fine clauses - review carefully'
    });
  }
  
  if (isContract && content.includes('deposit')) {
    highlights.push({
      label: 'Caution',
      emoji: '⚠️',
      color: 'warning' as const,
      text: 'Security deposit requirements mentioned - verify amounts'
    });
  }
  
  // Risk highlights
  if (content.includes('termination') || content.includes('breach')) {
    highlights.push({
      label: 'Risk',
      emoji: '❌',
      color: 'destructive' as const,
      text: 'Termination or breach clauses present - understand consequences'
    });
  }
  
  // Default highlights if none found
  if (highlights.length === 0) {
    highlights.push({
      label: 'Safe',
      emoji: '✅',
      color: 'success' as const,
      text: 'Document structure appears standard - review all sections carefully'
    });
  }
  
  return highlights;
};

const generateExplanations = (content: string, isContract: boolean) => {
  const explanations = [];
  
  // Extract potential clauses (sentences with legal keywords)
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const legalSentences = sentences.filter(s => 
    /\b(shall|must|agree|consent|responsible|liable|penalty)\b/i.test(s)
  );
  
  // Generate explanations for first few legal sentences
  legalSentences.slice(0, 3).forEach((sentence, index) => {
    const clause = sentence.trim().substring(0, 100) + (sentence.length > 100 ? '...' : '');
    explanations.push({
      clause,
      meaning: `This clause establishes specific ${isContract ? 'contractual' : 'legal'} obligations or restrictions that you need to be aware of.`,
      example: `For example, this could affect your ability to make certain decisions or could result in penalties if not followed properly.`
    });
  });
  
  return explanations;
};

const generateActions = (content: string, isContract: boolean, isLegal: boolean) => {
  const actions = [];
  
  if (isContract) {
    actions.push("Review all financial obligations and payment schedules");
    actions.push("Understand termination conditions and notice requirements");
    actions.push("Verify all dates, amounts, and key terms are correct");
  }
  
  if (isLegal) {
    actions.push("Consider seeking legal advice if any terms are unclear");
    actions.push("Keep copies of all documents and communications");
  }
  
  if (content.includes('signature') || content.includes('sign')) {
    actions.push("Do not sign until you fully understand all terms");
  }
  
  actions.push("Take time to read the complete document carefully");
  actions.push("Ask questions about any unclear provisions");
  
  return actions;
};