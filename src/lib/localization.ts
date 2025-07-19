
type Language = {
  value: string;
  label: string;
};

type Myth = {
  myth: string;
  reality: string;
};

type UIText = {
  [langCode: string]: {
    welcome: string;
    welcomeSubtitle: string;
    askAQuestion: string;
    findFreeProducts: string;
    dailyTip: string;
    tipContent: string;
    mythBuster: string;
  }
};

type Localization = {
  name: string;
  languages: Language[];
  faqs: string[];
  myths: Myth[];
  ui: UIText;
};

type Localizations = {
  [key: string]: Localization;
};

export const localizations: Localizations = {
  usa: {
    name: "USA / Global",
    languages: [{ value: 'en', label: 'English' }],
    faqs: [
      'What are common PMS symptoms?',
      'How can I relieve period cramps?',
      'Is my period cycle regular?',
      'What is a menstrual cup?',
    ],
    myths: [
      {
        myth: "You can't get pregnant on your period.",
        reality: "It's less likely, but still possible to get pregnant during your period, especially if you have a shorter menstrual cycle."
      },
      {
        myth: "Exercise during your period is bad for you.",
        reality: "Gentle exercise can actually help relieve period cramps and improve your mood. Listen to your body and don't overdo it."
      }
    ],
    ui: {
      en: {
        welcome: "Welcome!",
        welcomeSubtitle: "Your friendly guide to menstrual health.",
        askAQuestion: "Ask a Question",
        findFreeProducts: "Find Free Products",
        dailyTip: "Daily Tip",
        tipContent: "Staying hydrated can help ease menstrual cramps. Try drinking an extra glass or two of water today!",
        mythBuster: "Myth Buster"
      }
    }
  },
  india: {
    name: "India",
    languages: [{ value: 'en', label: 'English' }, { value: 'hi', label: 'हिन्दी' }],
    faqs: [
      'What are common PMS symptoms?',
      'How to relieve period cramps with home remedies?',
      'Is it normal to have irregular periods?',
      'What are some sustainable period products?',
    ],
    myths: [
      {
        myth: "You shouldn't enter the kitchen or touch pickles during your period.",
        reality: "This is a widespread cultural myth with no scientific basis. Menstruation is a natural biological process and does not make you impure or unhygienic."
      },
      {
        myth: "Using a menstrual cup will make you lose your virginity.",
        reality: "Virginity is a social construct and is not lost by using an internal menstrual product. Menstrual cups are a safe and hygienic option for all."
      }
    ],
     ui: {
        en: {
            welcome: "Welcome!",
            welcomeSubtitle: "Your friendly guide to menstrual health.",
            askAQuestion: "Ask a Question",
            findFreeProducts: "Find Free Products",
            dailyTip: "Daily Tip",
            tipContent: "Staying hydrated can help ease menstrual cramps. Try drinking an extra glass or two of water today!",
            mythBuster: "Myth Buster"
        },
        hi: {
            welcome: "नमस्ते!",
            welcomeSubtitle: "मासिक धर्म स्वास्थ्य के लिए आपकी मैत्रीपूर्ण मार्गदर्शिका।",
            askAQuestion: "प्रश्न पूछें",
            findFreeProducts: "निःशुल्क उत्पाद ढूंढें",
            dailyTip: "आज का सुझाव",
            tipContent: "हाइड्रेटेड रहने से मासिक धर्म के दर्द को कम करने में मदद मिल सकती है। आज एक या दो गिलास अतिरिक्त पानी पीने का प्रयास करें!",
            mythBuster: "मिथक भंजक"
        }
    }
  },
  nepal: {
    name: "Nepal",
    languages: [{ value: 'en', label: 'English' }, { value: 'ne', label: 'नेपाली' }],
    faqs: [
      'How to manage period pain naturally?',
      'What is Chhaupadi and why is it harmful?',
      'Where can I find affordable sanitary pads?',
      'What are the signs of a healthy period?',
    ],
    myths: [
      {
        myth: "The practice of 'Chhaupadi' (isolating menstruating women in huts) is necessary for purity.",
        reality: "Chhaupadi is a dangerous and illegal practice that puts women and girls at risk. Menstruation is not impure, and everyone deserves to be safe and comfortable."
      },
      {
        myth: "You should not bathe or wash your hair during your period.",
        reality: "Maintaining good hygiene is very important during your period to prevent infections. Regular bathing is perfectly safe and recommended."
      }
    ],
    ui: {
        en: {
            welcome: "Welcome!",
            welcomeSubtitle: "Your friendly guide to menstrual health.",
            askAQuestion: "Ask a Question",
            findFreeProducts: "Find Free Products",
            dailyTip: "Daily Tip",
            tipContent: "Staying hydrated can help ease menstrual cramps. Try drinking an extra glass or two of water today!",
            mythBuster: "Myth Buster"
        },
        ne: {
            welcome: "नमस्ते!",
            welcomeSubtitle: "तपाईंको महिनावारी स्वास्थ्यको लागि तपाईंको मैत्रीपूर्ण गाइड।",
            askAQuestion: "प्रश्न सोध्नुहोस्",
            findFreeProducts: "नि: शुल्क उत्पादनहरू फेला पार्नुहोस्",
            dailyTip: "दैनिक सुझाव",
            tipContent: "हाइड्रेटेड रहँदा महिनावारीको दुखाइ कम गर्न मद्दत गर्दछ। आज एक वा दुई गिलास थप पानी पिउने प्रयास गर्नुहोस्!",
            mythBuster: "मिथक बस्टर"
        }
    }
  },
};
