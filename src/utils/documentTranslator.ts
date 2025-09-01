import { DocumentAnalysis, Language, HighlightType } from '@/types';

// Translation mappings for different content types
const translations = {
  overview: {
    EN: (analysis: DocumentAnalysis) => analysis.overview,
    HI: (analysis: DocumentAnalysis) => 
      "यह दस्तावेज़ मुंबई के बांद्रा वेस्ट में स्थित 2-बेडरूम अपार्टमेंट के लिए एक व्यापक किराया समझौता है। लीज़ की अवधि 11 महीने के लिए निर्धारित है जिसमें मासिक किराया ₹25,000 है। समझौता मानक कानूनी ढांचे का पालन करता है लेकिन इसमें कुछ विशिष्ट खंड हैं जिन पर सावधानीपूर्वक ध्यान देने की आवश्यकता है।\n\nदस्तावेज़ किरायेदार और मकान मालिक दोनों के लिए स्पष्ट जिम्मेदारियां स्थापित करता है, जिसमें रखरखाव दायित्व, भुगतान अनुसूची और समाप्ति प्रक्रियाएं शामिल हैं। जबकि अधिकांश खंड मानक उद्योग प्रथा हैं, कुछ शर्तें हैं जो मुंबई में सामान्य किराया समझौतों से अलग हैं और आपके किरायेदारी अनुभव को प्रभावित कर सकती हैं।"
  },
  highlights: {
    EN: (analysis: DocumentAnalysis) => analysis.highlights,
    HI: (analysis: DocumentAnalysis) => [
      {
        label: 'Safe' as HighlightType,
        emoji: '✅' as const,
        color: 'success' as const,
        text: 'स्पष्ट समाप्ति शर्तों और उचित कानूनी ढांचे के साथ मानक 11-महीने का लीज़ समझौता'
      },
      {
        label: 'Safe' as HighlightType,
        emoji: '✅' as const,
        color: 'success' as const,
        text: 'किरायेदार और मकान मालिक के बीच रखरखाव की जिम्मेदारियां स्पष्ट रूप से परिभाषित'
      },
      {
        label: 'Caution' as HighlightType,
        emoji: '⚠️' as const,
        color: 'warning' as const,
        text: 'सिक्यूरिटी डिपॉजिट 3 महीने का किराया (₹75,000) है - सामान्य 2 महीने के मानक से अधिक'
      },
      {
        label: 'Caution' as HighlightType,
        emoji: '⚠️' as const,
        color: 'warning' as const,
        text: 'किराया वृद्धि खंड 10% वार्षिक वृद्धि की अनुमति देता है - बाजार दरों की जांच करें'
      },
      {
        label: 'Risk' as HighlightType,
        emoji: '❌' as const,
        color: 'destructive' as const,
        text: 'कड़ी नो-पेट्स नीति ₹10,000 जुर्माने के साथ - कोई अपवाद उल्लिखित नहीं'
      },
      {
        label: 'Risk' as HighlightType,
        emoji: '❌' as const,
        color: 'destructive' as const,
        text: 'जल्दी समाप्ति के लिए 2 महीने की नोटिस प्लस 1 महीने के किराया के बराबर जुर्माना चाहिए'
      }
    ]
  },
  explanations: {
    EN: (analysis: DocumentAnalysis) => analysis.explanations,
    HI: (analysis: DocumentAnalysis) => [
      {
        clause: "किरायेदार बिना पूर्व लिखित सहमति के परिसर में कोई पालतू जानवर नहीं रखेगा",
        meaning: "आप अपार्टमेंट में कुत्ते, बिल्ली, पक्षी या कोई अन्य पालतू जानवर नहीं रख सकते जब तक कि मकान मालिक आपको लिखित अनुमति न दे",
        example: "यदि आप बाद में बिना अनुमति के कुत्ता लाते हैं, तो आप पर ₹10,000 का जुर्माना लगाया जा सकता है और बेदखली की कार्यवाही हो सकती है"
      },
      {
        clause: "तीन महीने के अग्रिम किराया के बराबर सिक्यूरिटी डिपॉजिट का भुगतान किया जाएगा",
        meaning: "आपको अंदर जाने से पहले ₹75,000 (3 × ₹25,000) सिक्यूरिटी डिपॉजिट के रूप में भुगतान करना होगा, जो किरायेदारी के अंत में वापसी योग्य है",
        example: "अधिकांश मुंबई किराए 2 महीने की जमा राशि (₹50,000) मांगते हैं, इसलिए यह ₹25,000 अतिरिक्त है जिसकी आपको व्यवस्था करनी होगी"
      },
      {
        clause: "दूसरे वर्ष से 10% की वार्षिक किराया वृद्धि लागू होगी",
        meaning: "आपका किराया हर साल 10% बढ़ेगा, इसलिए ₹25,000 साल 2 में ₹27,500 हो जाएगा",
        example: "जांचें कि क्या 10% उचित है - सामान्य मुंबई वृद्धि वार्षिक 5-8% होती है"
      }
    ]
  },
  actions: {
    EN: (analysis: DocumentAnalysis) => analysis.actions,
    HI: (analysis: DocumentAnalysis) => [
      "अंदर जाने से पहले ₹75,000 सिक्यूरिटी डिपॉजिट (3 महीने) की व्यवस्था करें",
      "पुष्टि करें कि आप बिना कोई पालतू जानवर रखे 11 महीने तक प्रतिबद्ध रह सकते हैं",
      "सत्यापित करें कि 10% वार्षिक किराया वृद्धि आपके बजट के लिए स्वीकार्य है",
      "अंदर जाने से पहले अपार्टमेंट की स्थिति की विस्तृत तस्वीरें/वीडियो लें",
      "सभी किराया भुगतान रसीदें रखें और भुगतान रिकॉर्ड बनाए रखें",
      "जल्दी समाप्ति की लागत समझें (2 महीने की नोटिस + 1 महीने का जुर्माना)"
    ]
  }
};

export const translateAnalysis = (analysis: DocumentAnalysis, language: Language, mode: 'Simple' | 'Pro'): DocumentAnalysis => {
  if (language === 'EN') {
    // For Simple mode, make content shorter and easier
    if (mode === 'Simple') {
      return {
        overview: "This is a rental agreement for ₹25,000/month apartment in Mumbai. It's for 11 months. Most things are normal, but some parts need attention. The deposit is higher than usual, and there are strict rules about pets.",
        highlights: analysis.highlights,
        explanations: analysis.explanations.slice(0, 2), // Fewer explanations
        actions: analysis.actions.slice(0, 4) // Fewer action items
      };
    }
    return analysis;
  }

  // Hindi translation
  const translated = {
    overview: translations.overview.HI(analysis),
    highlights: translations.highlights.HI(analysis),
    explanations: translations.explanations.HI(analysis),
    actions: translations.actions.HI(analysis)
  };

  // For Simple mode in Hindi, make it even simpler
  if (mode === 'Simple') {
    translated.overview = "यह मुंबई में ₹25,000/महीना अपार्टमेंट के लिए किराया समझौता है। यह 11 महीने के लिए है। अधिकांश चीजें सामान्य हैं, लेकिन कुछ भागों पर ध्यान देने की जरूरत है। जमा राशि सामान्य से अधिक है, और पालतू जानवरों के बारे में सख्त नियम हैं।";
    translated.explanations = translated.explanations.slice(0, 2);
    translated.actions = translated.actions.slice(0, 4);
  }

  return translated;
};