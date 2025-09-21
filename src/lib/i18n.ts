import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Welcome screen
      "welcome.title": "Welcome to OpenWell",
      "welcome.subtitle": "Your mental health companion",
      "welcome.selectLanguage": "Select your preferred language",
      "welcome.anonymousMode": "Anonymous mode",
      "welcome.anonymousDesc": "Use the app without providing personal information",
      "welcome.continue": "Continue",
      
      // Dashboard
      "dashboard.welcome": "Welcome back",
      "dashboard.howFeeling": "How are you feeling today?",
      "dashboard.aiChat": "AI First-Aid Chat",
      "dashboard.aiChatDesc": "Get immediate support through our guided chat",
      "dashboard.aiChatCta": "Start Chat",
      "dashboard.assessment": "Mental Health Assessment",
      "dashboard.assessmentDesc": "Take a quick assessment to understand your mental state",
      "dashboard.resources": "Mental Health Resources",
      "dashboard.resourcesDesc": "Access helpful articles, videos, and guides",
      "dashboard.resourcesCta": "Explore Resources",
      "dashboard.booking": "Book a Counsellor",
      "dashboard.bookingDesc": "Schedule a session with a professional counsellor",
      "dashboard.bookingCta": "Book Now",
      
      // Crisis support
      "crisis.needHelp": "Need immediate help?",
      "crisis.hotline": "Crisis Hotline: 1075",
      "crisis.emergency": "Emergency: 102",
      
      // AI Chat
      "chat.title": "AI Mental Health Assistant",
      "chat.placeholder": "Type your message here...",
      "chat.send": "Send",
      "chat.welcome": "Hello! I'm here to help you with your mental health concerns. How are you feeling today?",
      
      // Assessment
      "assessment.title": "Mental Health Assessment",
      "assessment.dass21": "DASS-21 Questionnaire",
      "assessment.start": "Start Assessment",
      "assessment.submit": "Submit Assessment",
      
      // Resources
      "resources.title": "Mental Health Resources",
      "resources.search": "Search resources...",
      "resources.all": "All Resources",
      "resources.anxiety": "Anxiety",
      "resources.depression": "Depression",
      "resources.stress": "Stress",
      "resources.coping": "Coping Skills",
      "resources.crisis": "Crisis Support",
      
      // Booking
      "booking.title": "Book a Counsellor",
      "booking.selectCounsellor": "Select a counsellor",
      "booking.selectDate": "Select date and time",
      "booking.confirm": "Confirm Booking",
      
      // Common
      "common.back": "Back",
      "common.home": "Home",
      "common.next": "Next",
      "common.previous": "Previous",
      "common.save": "Save",
      "common.cancel": "Cancel"
    }
  },
  hi: {
    translation: {
      // Welcome screen
      "welcome.title": "माइंडएड हब में आपका स्वागत है",
      "welcome.subtitle": "आपका मानसिक स्वास्थ्य साथी",
      "welcome.selectLanguage": "अपनी पसंदीदा भाषा चुनें",
      "welcome.anonymousMode": "गुमनाम मोड",
      "welcome.anonymousDesc": "व्यक्तिगत जानकारी दिए बिना ऐप का उपयोग करें",
      "welcome.continue": "जारी रखें",
      
      // Dashboard
      "dashboard.welcome": "वापसी पर स्वागत",
      "dashboard.howFeeling": "आज आप कैसा महसूस कर रहे हैं?",
      "dashboard.aiChat": "एआई प्राथमिक सहायता चैट",
      "dashboard.aiChatDesc": "हमारी निर्देशित चैट के माध्यम से तत्काल सहायता प्राप्त करें",
      "dashboard.aiChatCta": "चैट शुरू करें",
      "dashboard.assessment": "मानसिक स्वास्थ्य मूल्यांकन",
      "dashboard.assessmentDesc": "अपनी मानसिक स्थिति को समझने के लिए एक त्वरित मूल्यांकन लें",
      "dashboard.resources": "मानसिक स्वास्थ्य संसाधन",
      "dashboard.resourcesDesc": "सहायक लेख, वीडियो और गाइड तक पहुंचें",
      "dashboard.resourcesCta": "संसाधन खोजें",
      "dashboard.booking": "एक काउंसलर बुक करें",
      "dashboard.bookingDesc": "एक पेशेवर काउंसलर के साथ सत्र शेड्यूल करें",
      "dashboard.bookingCta": "अभी बुक करें",
      
      // Crisis support
      "crisis.needHelp": "तत्काल सहायता चाहिए?",
      "crisis.hotline": "क्राइसिस हॉटलाइन: 1075",
      "crisis.emergency": "आपातकाल: 102",
      
      // AI Chat
      "chat.title": "एआई मानसिक स्वास्थ्य सहायक",
      "chat.placeholder": "यहाँ अपना संदेश टाइप करें...",
      "chat.send": "भेजें",
      "assessment.title": "मानसिक स्वास्थ्य मूल्यांकन",
      "assessment.dass21": "DASS-21 प्रश्नावली",
      "assessment.start": "मूल्यांकन शुरू करें",
      "assessment.submit": "मूल्यांकन जमा करें",
      
      // Resources
      "resources.title": "मानसिक स्वास्थ्य संसाधन",
      "resources.search": "संसाधन खोजें...",
      "resources.all": "सभी संसाधन",
      "resources.anxiety": "चिंता",
      "resources.depression": "अवसाद",
      "resources.stress": "तनाव",
      "resources.coping": "सामना करने के कौशल",
      "resources.crisis": "संकट सहायता",
      
      // Booking
      "booking.title": "एक काउंसलर बुक करें",
      "booking.selectCounsellor": "एक काउंसलर चुनें",
      "booking.selectDate": "दिनांक और समय चुनें",
      "booking.confirm": "बुकिंग की पुष्टि करें",
      
      // Common
      "common.back": "वापस",
      "common.home": "होम",
      "common.next": "अगला",
      "common.previous": "पिछला",
      "common.save": "सेव करें",
      "common.cancel": "रद्द करें"
    }
  },
  ks: {
    translation: {
      // Welcome screen (Kashmiri - using Devanagari script)
      "welcome.title": "माइंडएड हबस manz स्वागत",
      "welcome.subtitle": "तुम्हार मानसिक स्वास्थ्य साथी",
      "welcome.selectLanguage": "अपनी पसंदीदा भाषा चुनें",
      "welcome.anonymousMode": "गुमनाम मोड",
      "welcome.anonymousDesc": "व्यक्तिगत जानकारी दिए बिना ऐप का उपयोग करें",
      "welcome.continue": "जारी रखें",
      
      // Dashboard
      "dashboard.welcome": "वापसी पर स्वागत",
      "dashboard.howFeeling": "आज तुम कैसा महसूस कर रहे हो?",
      "dashboard.aiChat": "एआई प्राथमिक सहायता चैट",
      "dashboard.aiChatDesc": "हमारी निर्देशित चैट के माध्यम से तत्काल सहायता प्राप्त करें",
      "dashboard.aiChatCta": "चैट शुरू करो",
      "dashboard.assessment": "मानसिक स्वास्थ्य मूल्यांकन",
      "dashboard.assessmentDesc": "अपनी मानसिक स्थिति को समझने के लिए एक त्वरित मूल्यांकन लें",
      "dashboard.resources": "मानसिक स्वास्थ्य संसाधन",
      "dashboard.resourcesDesc": "सहायक लेख, वीडियो और गाइड तक पहुंचें",
      "dashboard.resourcesCta": "संसाधन खोजें",
      "dashboard.booking": "एक काउंसलर बुक करें",
      "dashboard.bookingDesc": "एक पेशेवर काउंसलर के साथ सत्र शेड्यूल करें",
      "dashboard.bookingCta": "अभी बुक करो",
      
      // Crisis support
      "crisis.needHelp": "तत्काल सहायता चाहिए?",
      "crisis.hotline": "क्राइसिस हॉटलाइन: 1075",
      "crisis.emergency": "आपातकाल: 102",
      
      // AI Chat
      "chat.title": "एआई मानसिक स्वास्थ्य सहायक",
      "chat.placeholder": "यहाँ अपना संदेश टाइप करें...",
      "chat.send": "भेजें",
      "chat.welcome": "नमस्ते! मैं तुम्हारी मानसिक स्वास्थ्य चिंताओं में मदद करने के लिए यहाँ हूँ। आज तुम कैसा महसूस कर रहे हो?",
      
      // Assessment
      "assessment.title": "मानसिक स्वास्थ्य मूल्यांकन",
      "assessment.dass21": "DASS-21 प्रश्नावली",
      "assessment.start": "मूल्यांकन शुरू करें",
      "assessment.submit": "मूल्यांकन जमा करें",
      
      // Resources
      "resources.title": "मानसिक स्वास्थ्य संसाधन",
      "resources.search": "संसाधन खोजें...",
      "resources.all": "सभी संसाधन",
      "resources.anxiety": "चिंता",
      "resources.depression": "अवसाद",
      "resources.stress": "तनाव",
      "resources.coping": "सामना करने के कौशल",
      "resources.crisis": "संकट सहायता",
      
      // Booking
      "booking.title": "एक काउंसलर बुक करें",
      "booking.selectCounsellor": "एक काउंसलर चुनें",
      "booking.selectDate": "दिनांक और समय चुनें",
      "booking.confirm": "बुकिंग की पुष्टि करें",
      
      // Common
      "common.back": "वापस",
      "common.home": "होम",
      "common.next": "अगला",
      "common.previous": "पिछला",
      "common.save": "सेव करें",
      "common.cancel": "रद्द करें"
    }
  },
  dgo: {
    translation: {
      // Welcome screen (Dogri)
      "welcome.title": "माइंडएड हब च तुसां दा स्वागत ऐ",
      "welcome.subtitle": "तुसां दा मानसिक स्वास्थ्य साथी",
      "welcome.selectLanguage": "अपनी पसंदीदा भाषा चुनो",
      "welcome.anonymousMode": "गुमनाम मोड",
      "welcome.anonymousDesc": "व्यक्तिगत जानकारी दित्ते बगैर ऐप दा इस्तेमाल करो",
      "welcome.continue": "जारी रक्खो",
      
      // Dashboard
      "dashboard.welcome": "वापसी ते स्वागत",
      "dashboard.howFeeling": "अज्ज तुसीं कियां महसूस करा दे ओ?",
      "dashboard.aiChat": "एआई प्राथमिक सहायता चैट",
      "dashboard.aiChatDesc": "साडी निर्देशित चैट दे जरिए तुरंत सहायता हासिल करो",
      "dashboard.aiChatCta": "चैट शुरू करो",
      "dashboard.assessment": "मानसिक स्वास्थ्य मूल्यांकन",
      "dashboard.assessmentDesc": "अपनी मानसिक स्थिति गी समझने आस्तै इक त्वरित मूल्यांकन लो",
      "dashboard.resources": "मानसिक स्वास्थ्य संसाधन",
      "dashboard.resourcesDesc": "सहायक लेख, वीडियो ते गाइड तगर पुज्जो",
      "dashboard.resourcesCta": "संसाधन तलाश करो",
      "dashboard.booking": "इक काउंसलर बुक करो",
      "dashboard.bookingDesc": "इक पेशेवर काउंसलर कन्नै सत्र शेड्यूल करो",
      "dashboard.bookingCta": "अज्जै बुक करो",
      
      // Crisis support
      "crisis.needHelp": "तुरंत सहायता चाहिदी ऐ?",
      "crisis.hotline": "क्राइसिस हॉटलाइन: 1075",
      "crisis.emergency": "आपातकाल: 102",
      
      // AI Chat
      "chat.title": "एआई मानसिक स्वास्थ्य सहायक",
      "chat.placeholder": "इत्थै अपना संदेश टाइप करो...",
      "chat.send": "भेजो",
      "chat.welcome": "नमस्ते! मैं तुसां दी मानसिक स्वास्थ्य चिंताएं च मदद करने आस्तै इत्थै ऐ। अज्ज तुसीं कियां महसूस करा दे ओ?",
      
      // Assessment
      "assessment.title": "मानसिक स्वास्थ्य मूल्यांकन",
      "assessment.dass21": "DASS-21 प्रश्नावली",
      "assessment.start": "मूल्यांकन शुरू करो",
      "assessment.submit": "मूल्यांकन जमा करो",
      
      // Resources
      "resources.title": "मानसिक स्वास्थ्य संसाधन",
      "resources.search": "संसाधन तलाश करो...",
      "resources.all": "सारे संसाधन",
      "resources.anxiety": "चिंता",
      "resources.depression": "अवसाद",
      "resources.stress": "तनाव",
      "resources.coping": "सामना करने दे कौशल",
      "resources.crisis": "संकट सहायता",
      
      // Booking
      "booking.title": "इक काउंसलर बुक करो",
      "booking.selectCounsellor": "इक काउंसलर चुनो",
      "booking.selectDate": "दिनांक ते समय चुनो",
      "booking.confirm": "बुकिंग दी पुष्टि करो",
      
      // Common
      "common.back": "वापस",
      "common.home": "होम",
      "common.next": "अगला",
      "common.previous": "पिछला",
      "common.save": "सेव करो",
      "common.cancel": "रद्द करो"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

