window.GK_CONFIG = {
  LATEST_URL: 'data/latest.json',
  QUIZ_URL: 'data/quiz.json',

  // OPTIONAL: paste your deployed Apps Script Admin URL here.
  // Example: https://script.google.com/macros/s/XXXX/exec
  ADMIN_URL: '',

  SITE_NAME: 'GK Guide',
  DEFAULT_CATEGORIES: [
    'India','World','Economy','Science & Tech','Environment',
    'Sports','Awards & Honours','Appointments','Defence'
  ],

  FALLBACKS: {
    'India':'assets/fallback/india.jpg',
    'World':'assets/fallback/world.jpg',
    'Economy':'assets/fallback/economy.jpg',
    'Science & Tech':'assets/fallback/science.jpg',
    'Environment':'assets/fallback/environment.jpg',
    'Sports':'assets/fallback/sports.jpg',
    'Awards & Honours':'assets/fallback/general.jpg',
    'Appointments':'assets/fallback/general.jpg',
    'Defence':'assets/fallback/general.jpg',
    'default':'assets/fallback/general.jpg'
  }
};