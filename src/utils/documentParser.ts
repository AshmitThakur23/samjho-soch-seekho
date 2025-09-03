import { DocumentAnalysis } from '@/types';

// Document parsing utilities
export const parseDocument = async (file: File): Promise<string> => {
  // Prefer MIME type; fall back to file extension when missing
  const type = (file.type || '').toLowerCase();
  const name = file.name.toLowerCase();
  
  try {
    if (type.includes('pdf') || name.endsWith('.pdf')) {
      return await parsePDF(file);
    } else if (type.includes('word') || name.endsWith('.docx')) {
      return await parseDOCX(file);
    } else if (type.includes('text') || name.endsWith('.txt')) {
      return await parseTXT(file);
    } else if (type.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(name)) {
      return await parseImage(file);
    } else {
      throw new Error('Unsupported file type. Please upload PDF, DOCX, TXT, or image files.');
    }
  } catch (error) {
    console.error('Document parsing error:', error);
    throw new Error('Failed to parse document. Please try again with a different file.');
  }
};

const parsePDF = async (file: File): Promise<string> => {
  // Parse PDF in the browser using pdfjs-dist legacy ESM + Web Worker (Vite-friendly)
  const arrayBuffer = await file.arrayBuffer();
  const [{ getDocument, GlobalWorkerOptions }, workerModule] = await Promise.all([
    import('pdfjs-dist/legacy/build/pdf.mjs'),
    import('pdfjs-dist/legacy/build/pdf.worker.mjs?worker')
  ]);

  // Bind worker to pdf.js
  const w = new workerModule.default();
  (GlobalWorkerOptions as any).workerPort = w;

  const loadingTask = getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let fullText = '';
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = (content.items as any[]).map((it: any) => it.str || '').filter(Boolean);
    fullText += strings.join(' ') + '\n';
  }

  return fullText.trim();
};

const parseDOCX = async (file: File): Promise<string> => {
  let mammoth: any;
  try {
    mammoth = await import('mammoth/mammoth.browser');
  } catch {
    mammoth = await import('mammoth');
  }
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

// Basic OCR for image files using Tesseract.js
const parseImage = async (file: File): Promise<string> => {
  const { recognize } = await import('tesseract.js');
  const blobUrl = URL.createObjectURL(file);
  try {
    const { data } = await recognize(blobUrl, 'eng');
    return (data?.text || '').trim();
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
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