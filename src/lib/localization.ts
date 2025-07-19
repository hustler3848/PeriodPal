
type Language = {
  value: string;
  label: string;
};

type Myth = {
  myth: string;
  reality: string;
};

type Localization = {
  name: string;
  languages: Language[];
  faqs: string[];
  myths: Myth[];
  ui: {
    welcome: string;
    welcomeSubtitle: string;
    askAQuestion: string;
    findFreeProducts: string;
    dailyTip: string;
    tipContent: string;
    mythBuster: string;
  }
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
        welcome: "Welcome!",
        welcomeSubtitle: "Your friendly guide to menstrual health.",
        askAQuestion: "Ask a Question",
        findFreeProducts: "Find Free Products",
        dailyTip: "Daily Tip",
        tipContent: "Staying hydrated can help ease menstrual cramps. Try drinking an extra glass or two of water today!",
        mythBuster: "Myth Buster"
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
        welcome: "Namaste!",
        welcomeSubtitle: "Aapke masik swasthya ke liye aapka dost.",
        askAQuestion: "Sawaal Pucho",
        findFreeProducts: "Muft Products Dhundo",
        dailyTip: "Aaj Ka Sujhav",
        tipContent: "Hydrated rehna masik dharm ke dard ko kam karne mein madad kar sakta hai. Aaj ek ya do glass pani zyada peene ki koshish karein!",
        mythBuster: "Galatfehmi Tod"
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
        welcome: "Namaste!",
        welcomeSubtitle: "Tapaiko masik s स्वास्थ्यको लागि tapainko mitratāpūrṇa mārganirdeśaka.",
        askAQuestion: "Prashna Sodhnuhos",
        findFreeProducts: "Nishulka Utpadanharu Bhetaunuhos",
        dailyTip: "Dainik Sujhav",
        tipContent: "Pani piirahanu mahināwārīkō peṭa dukha'ī kam garnamā maddata garna sakcha. Āja ēka vā du'ī gilāsa thapa pānī pi'unē prayāsa garnuhōs!",
        mythBuster: "Bhramako Nivāraṇa"
    }
  },
};
