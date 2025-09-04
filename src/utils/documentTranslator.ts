import { DocumentAnalysis, Language } from '@/types';

// Lightweight, rule-based translator for English -> Hindi.
// We preserve structure and only transform strings. NO mock content injected.
const enToHiMap: Record<string, string> = {
  // Sections
  document: 'दस्तावेज़',
  overview: 'सारांश',
  summary: 'सारांश',
  highlight: 'मुख्य बिंदु',
  highlights: 'मुख्य बिंदु',
  explanation: 'व्याख्या',
  explanations: 'व्याख्याएँ',
  actions: 'कार्रवाई',
  action: 'कार्रवाई',

  // Legal/financial terms
  agreement: 'समझौता',
  contract: 'अनुबंध',
  clause: 'खंड',
  terms: 'शर्तें',
  conditions: 'नियम व शर्तें',
  section: 'धारा',
  liability: 'देयता',
  penalty: 'जुर्माना',
  fine: 'जुर्माना',
  termination: 'समाप्ति',
  breach: 'उल्लंघन',
  notice: 'सूचना',
  signature: 'हस्ताक्षर',
  sign: 'हस्ताक्षर',
  deposit: 'जमा राशि',
  'security deposit': 'सिक्योरिटी डिपॉजिट',

  // Lending/loan terminology
  loan: 'ऋण',
  interest: 'ब्याज',
  'interest rate': 'ब्याज दर',
  rate: 'दर',
  emi: 'ईएमआई',
  principal: 'मूलधन',
  'processing fee': 'प्रोसेसिंग शुल्क',
  prepayment: 'पूर्व-भुगतान',
  foreclosure: 'समय से पहले समापन',
  'late fee': 'देरी शुल्क',
  default: 'डिफॉल्ट',
  collateral: 'गिरवी',
  insurance: 'बीमा',
  tenure: 'अवधि',
  repayment: 'भुगतान',
  schedule: 'अनुसूची',
  floating: 'फ्लोटिंग',
  fixed: 'फिक्स्ड',

  // Risk words (used only in text; labels remain EN as types)
  safe: 'सुरक्षित',
  caution: 'सावधानी',
  risk: 'जोखिम',
};

const translateTextToHindi = (text: string): string => {
  if (!text) return text;
  let out = text;
  // Replace multi-word keys first
  const keys = Object.keys(enToHiMap).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    const safeKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const re = new RegExp(`\\b${safeKey}\\b`, 'gi');
    out = out.replace(re, () => enToHiMap[key.toLowerCase()] || '');
  }
  // Symbols/units normalization
  out = out.replace(/INR|Rs\.?/gi, '₹');
  return out;
};

export const translateAnalysis = (
  analysis: DocumentAnalysis,
  language: Language,
  mode: 'Simple' | 'Pro'
): DocumentAnalysis => {
  // English: return as-is (no simplification to keep source-of-truth exact)
  if (language === 'EN') return analysis;

  // Hindi: translate strings only, keep structure and labels
  const t = (s: string) => translateTextToHindi(s);

  const translated: DocumentAnalysis = {
    overview: t(analysis.overview),
    highlights: analysis.highlights.map(h => ({ ...h, text: t(h.text) })),
    explanations: analysis.explanations.map(e => ({
      clause: t(e.clause),
      meaning: t(e.meaning),
      example: t(e.example),
    })),
    actions: analysis.actions.map(a => t(a)),
    lines: analysis.lines ? analysis.lines.map(t) : undefined,
  };

  // Optional readability tweak in Simple mode (truncate long overview only)
  if (mode === 'Simple') {
    const trim = (s: string) => (s.length > 800 ? s.slice(0, 800).trim() + '…' : s);
    translated.overview = trim(translated.overview);
  }

  return translated;
};
