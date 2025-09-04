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

// Content-based document analysis: split into logical lines and classify each line
export const analyzeDocument = async (content: string, fileName: string): Promise<DocumentAnalysis> => {
  if (!content || content.trim().length < 20) {
    throw new Error('Document content is too short or empty. Please upload a valid document.');
  }

  const normalized = content.replace(/\r\n/g, '\n').replace(/\t/g, ' ').replace(/ +/g, ' ').trim();
  const lines = toLogicalLines(normalized);

  const highlights = buildHighlightsFromLines(lines);
  const overview = buildOverview(fileName, normalized, lines.length, highlights);
  const explanations = buildExplanations(lines, highlights);
  const actions = buildActions(lines);

  return { overview, highlights, explanations, actions, lines };
};

// Split into logical lines (newline or sentence boundary)
const toLogicalLines = (text: string): string[] => {
  const chunks = text.split(/\n+/).flatMap(block =>
    block
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(Boolean)
  );
  // Deduplicate consecutive duplicates and trim long whitespace
  const cleaned: string[] = [];
  for (const s of chunks) {
    const t = s.replace(/\s{2,}/g, ' ').trim();
    if (t && t !== cleaned[cleaned.length - 1]) cleaned.push(t);
  }
  return cleaned;
};

const RISK_WORDS = [
  'breach', 'termination', 'forfeit', 'penalty', 'fine', 'default', 'late fee', 'chargeback',
  'indemnify', 'indemnity', 'liability', 'loss', 'damage', 'waive', 'waiver', 'non-refundable',
  'foreclose', 'foreclosure', 'lien', 'repossession', 'arbitration', 'litigation'
];
const CAUTION_WORDS = [
  'may', 'should', 'variable', 'floating', 'increase', 'change', 'revise', 'amend', 'fee', 'charges',
  'interest', 'rate', 'processing', 'prepayment', 'pre-closure', 'notice', 'require', 'deposit',
  'documentation', 'eligibility', 'insurance'
];

const classifyLine = (line: string) => {
  const lower = line.toLowerCase();
  const riskHits = RISK_WORDS.filter(w => lower.includes(w)).length;
  const cautionHits = CAUTION_WORDS.filter(w => lower.includes(w)).length;

  if (riskHits > 0 && riskHits >= cautionHits) return { label: 'Risk' as const, emoji: '❌' as const, color: 'destructive' as const };
  if (cautionHits > 0) return { label: 'Caution' as const, emoji: '⚠️' as const, color: 'warning' as const };
  return { label: 'Safe' as const, emoji: '✅' as const, color: 'success' as const };
};

const buildHighlightsFromLines = (lines: string[]) => {
  return lines.map((text, idx) => ({
    ...classifyLine(text),
    text,
    lineNumber: idx + 1,
  }));
};

const buildOverview = (
  fileName: string,
  content: string,
  lineCount: number,
  highlights: ReturnType<typeof buildHighlightsFromLines>
): string => {
  const wordCount = content.split(/\s+/).length;
  const sample = content.slice(0, 160).trim();
  const riskCount = highlights.filter(h => h.label === 'Risk').length;
  const cautionCount = highlights.filter(h => h.label === 'Caution').length;
  return `Document: ${fileName} • ${wordCount} words • ${lineCount} lines. Summary preview: ${sample}...\n\n` +
    `Detected ${riskCount} risk and ${cautionCount} caution lines. Review line-by-line highlights below.`;
};

const buildExplanations = (
  lines: string[],
  highlights: { label: 'Safe' | 'Caution' | 'Risk'; lineNumber?: number; text: string }[]
) => {
  // Take top 3 non-safe lines for explanation
  const candidates = highlights.filter(h => h.label !== 'Safe').slice(0, 3);
  return candidates.map(h => ({
    clause: `Line ${h.lineNumber}: ${truncate(h.text, 120)}`,
    meaning: h.label === 'Risk'
      ? 'This line may impose heavy obligations, penalties, or legal consequences. Read carefully.'
      : 'This line introduces conditions, fees, or changes that you should review in detail.',
    example: 'E.g., verify amounts, rates, timelines, and your responsibilities before proceeding.'
  }));
};

const buildActions = (lines: string[]) => {
  const lc = lines.join(' ').toLowerCase();
  const actions: string[] = [];
  if (/interest|rate|emi|processing|fee/.test(lc)) actions.push('Verify interest rates, fees, and the total cost');
  if (/penalty|fine|default|delay/.test(lc)) actions.push('Note penalties for delay or default');
  if (/pre[- ]?payment|pre[- ]?closure/.test(lc)) actions.push('Check prepayment/pre-closure terms');
  if (/insurance/.test(lc)) actions.push('Confirm insurance requirements and coverage');
  actions.push('Read every line carefully and keep copies of all communications');
  return actions;
};

const truncate = (s: string, n = 150) => (s.length > n ? s.slice(0, n).trim() + '…' : s);
