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

export const translateTextToHindi = (text: string): string => {
  if (!text) return text;
  let out = text;
  
  // Extended translation map for better coverage
  const extendedMap: Record<string, string> = {
    ...enToHiMap,
    // Common words
    'page': 'पेज',
    'of': 'का',
    'and': 'और',
    'or': 'या',
    'the': '',
    'for': 'के लिए',
    'with': 'के साथ',
    'in': 'में',
    'on': 'पर',
    'at': 'पर',
    'by': 'द्वारा',
    'from': 'से',
    'to': 'को',
    'as': 'के रूप में',
    'is': 'है',
    'are': 'हैं',
    'was': 'था',
    'were': 'थे',
    'will': 'होगा',
    'shall': 'होगा',
    'must': 'जरूरी',
    'should': 'चाहिए',
    'may': 'हो सकता है',
    'can': 'सकता है',
    'amount': 'राशि',
    'value': 'मूल्य',
    'cost': 'लागत',
    'price': 'कीमत',
    'fee': 'शुल्क',
    'charge': 'शुल्क',
    'payment': 'भुगतान',
    'month': 'महीना',
    'year': 'साल',
    'day': 'दिन',
    'time': 'समय',
    'period': 'अवधि',
    'duration': 'अवधि',
    'bank': 'बैंक',
    'account': 'खाता',
    'number': 'संख्या',
    'customer': 'ग्राहक',
    'applicant': 'आवेदक',
    'borrower': 'उधारकर्ता',
    'lender': 'ऋणदाता',
    'document': 'दस्तावेज़',
    'documents': 'दस्तावेज़',
    'required': 'आवश्यक',
    'mandatory': 'अनिवार्य',
    'optional': 'वैकल्पिक',
    'minimum': 'न्यूनतम',
     'maximum': 'अधिकतम',
     'below': 'से नीचे',
     'upto': 'तक',
     'up to': 'तक',
     'between': 'के बीच',
     'home': 'घर',
     'house': 'मकान',
     'property': 'संपत्ति',
     'residential': 'आवासीय',
     'commercial': 'व्यावसायिक',
     'plot': 'प्लॉट',
     'land': 'जमीन',
     'construction': 'निर्माण',
     'purchase': 'खरीद',
     'sale': 'बिक्री',
     'transfer': 'स्थानांतरण',
     'important': 'महत्वपूर्ण',
     'most important': 'सबसे महत्वपूर्ण',
     'state bank': 'स्टेट बैंक',
     'india': 'भारत',
     'covers': 'कवर करता है',
     'following': 'निम्नलिखित',
     'products': 'उत्पाद',
     'general': 'सामान्य',
     'take over': 'टेक ओवर',
     'balance': 'बैलेंस',
     'realty': 'रियल्टी',
     'combo': 'कॉम्बो',
     'maxgain': 'मैक्सगेन',
     'overdraft': 'ओवरड्राफ्ट',
     'facility': 'सुविधा',
     'privilege': 'विशेषाधिकार',
     'employees': 'कर्मचारी',
     'central': 'केंद्रीय',
     'government': 'सरकार',
     'defence': 'रक्षा',
     'navy': 'नौसेना',
     'airforce': 'वायुसेना',
     'personnel': 'कर्मी',
     'flexipay': 'फ्लेक्सीपे',
     'higher': 'उच्च',
     'eligibility': 'पात्रता',
     'step up': 'स्टेप अप',
     'moratorium': 'मोराटोरियम',
     'flexi': 'फ्लेक्सी',
     'vishishtha': 'विशिष्ठा',
     'years': 'वर्ष',
    'age': 'आयु',
    'non': 'गैर',
    'salaried': 'वेतनभोगी',
    'differential': 'अंतर',
    'offerings': 'पेशकश',
    'upon': 'पर',
    'ghar': 'घर',
    'assam': 'असम',
    'state': 'राज्य',
    'kerala': 'केरल',
    'tribal': 'जनजातीय',
    'plus': 'प्लस',
    'purpose': 'उद्देश्य',
    'which': 'जो',
    'available': 'उपलब्ध',
    'sanctioned': 'स्वीकृत',
    'extension': 'विस्तार',
    'repairs': 'मरम्मत',
    'renovation': 'नवीकरण',
    'new': 'नई',
    'used': 'पुराना',
    'flat': 'फ्लैट',
    'furnishings': 'सामान',
    'interiors': 'आंतरिक',
    'hereinafter': 'इसके बाद',
    'referred': 'संदर्भित',
    'project': 'परियोजना',
    'ratio': 'अनुपात',
    'ltv': 'एलटीवी',
    'lacs': 'लाख'
  };
  
  // Replace multi-word keys first
  const keys = Object.keys(extendedMap).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    const safeKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const re = new RegExp(`\\b${safeKey}\\b`, 'gi');
    out = out.replace(re, () => extendedMap[key.toLowerCase()] || '');
  }
  
  // Symbols/units normalization
  out = out.replace(/INR|Rs\.?/gi, '₹');
  out = out.replace(/SBI/gi, 'एसबीआई');
  out = out.replace(/MITC/gi, 'एमआईटीसी');
  out = out.replace(/LTV/gi, 'एलटीवी');
  out = out.replace(/PSUs/gi, 'पीएसयू');
  out = out.replace(/PSBs/gi, 'पीएसबी');
  
  // Clean up multiple spaces
  out = out.replace(/\s+/g, ' ').trim();
  
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
