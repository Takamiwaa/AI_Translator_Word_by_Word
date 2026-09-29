const { getProviderInstance } = require('./ai/providerRegistry');
const { UserApiKey, UserSetting } = require('../models');

/**
 * High quality mock alignment generator used as fallback if no API key is supplied,
 * allowing full visual interactive demonstration of word alignment, detailed modals,
 * and grammar analysis out of the box!
 */
function generateDemoTranslation(text, sourceLang, targetLang) {
  const isIndoToEng = sourceLang.toLowerCase().includes('indonesian') || sourceLang.toLowerCase() === 'id';
  
  if (isIndoToEng) {
    return {
      source_language: "Indonesian",
      target_language: "English",
      source_sentence: text,
      natural_translation: "I go to the beach with my family.",
      literal_translation: "I go to beach with my family.",
      alignment: [
        { source: ["Aku"], target: ["I"], type: "direct" },
        { source: ["pergi"], target: ["go"], type: "direct" },
        { source: ["ke"], target: ["to"], type: "direct" },
        { source: ["pantai"], target: ["the", "beach"], type: "expanded" },
        { source: ["bersama"], target: ["with"], type: "direct" },
        { source: ["keluargaku"], target: ["my", "family"], type: "expanded" }
      ],
      word_details: [
        {
          word: "Aku",
          translation: "I",
          base_word: "aku",
          pos: "pronoun",
          pronunciation_ipa: "/ai/",
          pronunciation_simple: "ai",
          literal_meaning: "I / me",
          contextual_meaning: "I (subject pronoun)",
          example_source: "Aku pergi ke sekolah.",
          example_target: "I go to school.",
          grammar_note: "First person singular pronoun",
          vocab_level: "A1"
        },
        {
          word: "pergi",
          translation: "go",
          base_word: "pergi",
          pos: "verb",
          pronunciation_ipa: "/gou/",
          pronunciation_simple: "gou",
          literal_meaning: "go / depart",
          contextual_meaning: "go (move from one place to another)",
          example_source: "Dia pergi kemarin.",
          example_target: "He went yesterday.",
          grammar_note: "Base action verb",
          vocab_level: "A1"
        },
        {
          word: "ke",
          translation: "to",
          base_word: "ke",
          pos: "preposition",
          pronunciation_ipa: "/tuː/",
          pronunciation_simple: "tu",
          literal_meaning: "to / toward",
          contextual_meaning: "preposition indicating direction",
          example_source: "Ke mana kamu pergi?",
          example_target: "Where are you going to?",
          grammar_note: "Directional preposition",
          vocab_level: "A1"
        },
        {
          word: "pantai",
          translation: "the beach",
          base_word: "pantai",
          pos: "noun",
          pronunciation_ipa: "/ðə biːtʃ/",
          pronunciation_simple: "de biych",
          literal_meaning: "beach",
          contextual_meaning: "seashore or coast",
          example_source: "Pantai ini sangat indah.",
          example_target: "This beach is very beautiful.",
          grammar_note: "Singular noun with definite article 'the'",
          vocab_level: "A2"
        },
        {
          word: "bersama",
          translation: "with",
          base_word: "sama",
          pos: "preposition",
          pronunciation_ipa: "/wɪð/",
          pronunciation_simple: "wid",
          literal_meaning: "together / with",
          contextual_meaning: "in company with",
          example_source: "Makan bersama keluarga.",
          example_target: "Eat together with family.",
          grammar_note: "Preposition of accompaniment",
          vocab_level: "A2"
        },
        {
          word: "keluargaku",
          translation: "my family",
          base_word: "keluarga",
          pos: "noun",
          pronunciation_ipa: "/mai fem-lee/",
          pronunciation_simple: "mai fem-lee",
          literal_meaning: "my family",
          contextual_meaning: "household members and relatives",
          example_source: "Aku mencintai keluargaku.",
          example_target: "I love my family.",
          grammar_note: "Noun 'keluarga' appended with possessive enclitic '-ku' (my)",
          vocab_level: "A2"
        }
      ],
      grammar: {
        tense: "Simple Present",
        formula: "Subject + Verb 1 + Prepositional Phrase",
        explanation: "Digunakan untuk menggambarkan kejadian rutin, fakta umum, atau aksi langsung dalam waktu sekarang."
      },
      vocabulary_levels: [
        { word: "Aku", level: "A1" },
        { word: "pergi", level: "A1" },
        { word: "ke", level: "A1" },
        { word: "pantai", level: "A2" },
        { word: "bersama", level: "A2" },
        { word: "keluargaku", level: "A2" }
      ]
    };
  } else {
    // English to Indonesian Demo
    return {
      source_language: "English",
      target_language: "Indonesian",
      source_sentence: text,
      natural_translation: "Saya sangat menantikan untuk bertemu dengan Anda.",
      literal_translation: "Saya sedang melihat ke depan untuk menemui Anda.",
      alignment: [
        { source: ["I"], target: ["Saya"], type: "direct" },
        { source: ["am", "looking", "forward", "to"], target: ["sangat", "menantikan"], type: "idiom" },
        { source: ["meeting"], target: ["bertemu"], type: "direct" },
        { source: ["you"], target: ["dengan", "Anda"], type: "expanded" }
      ],
      word_details: [
        {
          word: "I",
          translation: "Saya",
          base_word: "I",
          pos: "pronoun",
          pronunciation_ipa: "/sa-ya/",
          pronunciation_simple: "sa-ya",
          literal_meaning: "I / me",
          contextual_meaning: "Formal first person pronoun",
          example_source: "I am ready.",
          example_target: "Saya siap.",
          grammar_note: "Subject pronoun",
          vocab_level: "A1"
        },
        {
          word: "am looking forward to",
          translation: "sangat menantikan",
          base_word: "look forward to",
          pos: "phrasal verb",
          pronunciation_ipa: "/sa-ngat me-nan-ti-kan/",
          pronunciation_simple: "sa-ngat me-nan-ti-kan",
          literal_meaning: "looking forward to",
          contextual_meaning: "eagerly anticipating an event",
          example_source: "I look forward to your reply.",
          example_target: "Saya menantikan balasan Anda.",
          grammar_note: "Idiomatic phrasal verb requiring gerund (-ing) afterwards",
          vocab_level: "B2"
        },
        {
          word: "meeting",
          translation: "bertemu",
          base_word: "meet",
          pos: "verb (gerund)",
          pronunciation_ipa: "/ber-te-mu/",
          pronunciation_simple: "ber-te-mu",
          literal_meaning: "meeting / encounter",
          contextual_meaning: "to come into the presence of someone",
          example_source: "Meeting new people is fun.",
          example_target: "Bertemu orang baru itu menyenangkan.",
          grammar_note: "Gerund acting as object of preposition 'to'",
          vocab_level: "A2"
        },
        {
          word: "you",
          translation: "dengan Anda",
          base_word: "you",
          pos: "pronoun",
          pronunciation_ipa: "/de-ngan an-da/",
          pronunciation_simple: "de-ngan an-da",
          literal_meaning: "you",
          contextual_meaning: "polite second person pronoun",
          example_source: "Nice to meet you.",
          example_target: "Senang bertemu dengan Anda.",
          grammar_note: "Direct object pronoun",
          vocab_level: "A1"
        }
      ],
      grammar: {
        tense: "Present Continuous with Phrasal Verb",
        formula: "Subject + am/is/are + Verb-ing (phrasal verb) + Object",
        explanation: "Menggunakan phrasal verb 'look forward to' untuk menyatakan perasaan antusias terhadap kejadian di masa depan."
      },
      vocabulary_levels: [
        { word: "I", level: "A1" },
        { word: "look forward to", level: "B2" },
        { word: "meeting", level: "A2" },
        { word: "you", level: "A1" }
      ]
    };
  }
}

async function translateText({ text, sourceLang, targetLang, providerName, modelName, userApiKey }) {
  // 1. Determine active key
  let apiKey = userApiKey || '';
  if (!apiKey && providerName) {
    try {
      const stored = await UserApiKey.findOne({ where: { user_id: 1, provider: providerName } });
      if (stored) apiKey = stored.api_key;
    } catch (e) {
      // ignore db error
    }
  }

  // 2. Fallback to Demo if provider needs key and none is set (except Ollama / LM Studio)
  const isLocalProvider = ['ollama', 'lmstudio', 'custom'].includes(providerName.toLowerCase());
  const hasEnvKey = Boolean(process.env[`${providerName.toUpperCase()}_API_KEY`]);
  
  if (!apiKey && !hasEnvKey && !isLocalProvider) {
    console.log(`ℹ️ No API key for "${providerName}". Returning demo structure for word alignment visualization.`);
    return generateDemoTranslation(text, sourceLang, targetLang);
  }

  // 3. Invoke provider instance
  const provider = getProviderInstance(providerName, apiKey);
  const result = await provider.translate(text, sourceLang, targetLang, modelName);

  return result;
}

module.exports = {
  translateText,
  generateDemoTranslation
};
