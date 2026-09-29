const axios = require('axios');

class BaseProvider {
  constructor(name, displayName, apiKey = '', options = {}) {
    this.name = name;
    this.displayName = displayName;
    this.apiKey = apiKey;
    this.options = options;
  }

  getSystemPrompt(sourceLang, targetLang) {
    return `You are an expert linguistic analysis AI specializing in word-by-word and phrase-by-phrase translation alignment.
Your task is to analyze the input text in ${sourceLang} and translate it to ${targetLang} with high-precision word/phrase alignment, detailed grammar analysis, phonetic pronunciation, and vocabulary level categorization.

CRITICAL ALIGNMENT RULES:
1. DO NOT force literal 1:1 word mapping if it distorts natural language structure or meaning.
2. Group multiple words into a single unit when they function as a phrasal verb, idiom, collocation, compound word, or natural phrase (e.g., "looking forward to" -> "menantikan", "keluargaku" -> "my family", "sedang belajar" -> "studying", "terima kasih banyak" -> "thank you very much").
3. Ensure every source token is aligned to its corresponding target token(s).
4. Provide word-level details for each aligned block, including base word (lemma), part of speech (POS), simple pronunciation for learners, IPA pronunciation, literal vs. contextual meaning, example sentences, and CEFR level (A1, A2, B1, B2, C1, C2).
5. Perform thorough grammar analysis (identify Tense, Formula, and Explanation). If tense does not apply, explain sentence structure concisely.

MUST RETURN PURE VALID JSON matching EXACTLY this JSON schema (NO markdown blocks, NO preamble):
{
  "source_language": "${sourceLang}",
  "target_language": "${targetLang}",
  "source_sentence": "Original input sentence",
  "natural_translation": "Fluent natural translation in target language",
  "literal_translation": "Literal word-for-word translation if distinct, otherwise same as natural",
  "alignment": [
    {
      "source": ["Aku"],
      "target": ["I"],
      "type": "direct"
    },
    {
      "source": ["keluargaku"],
      "target": ["my", "family"],
      "type": "expanded"
    }
  ],
  "word_details": [
    {
      "word": "keluargaku",
      "translation": "my family",
      "base_word": "keluarga",
      "pos": "noun",
      "pronunciation_ipa": "/mai fem-lee/",
      "pronunciation_simple": "mai fem-lee",
      "literal_meaning": "my family",
      "contextual_meaning": "my family",
      "example_source": "Aku pergi bersama keluargaku.",
      "example_target": "I went with my family.",
      "grammar_note": "Noun with possessive suffix '-ku' (my)",
      "vocab_level": "A2"
    }
  ],
  "grammar": {
    "tense": "Simple Present / Past / etc.",
    "formula": "Subject + Verb + Object",
    "explanation": "Grammatical context and usage explanation."
  },
  "vocabulary_levels": [
    { "word": "beach", "level": "A2" },
    { "word": "family", "level": "A1" }
  ]
}`;
  }

  parseJSONResponse(text) {
    try {
      // Strip ```json markdown wrappers if present
      let clean = text.trim();
      if (clean.startsWith('```')) {
        clean = clean.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
      }
      return JSON.parse(clean);
    } catch (err) {
      console.error('Failed to parse AI JSON response:', text);
      throw new Error(`AI generated invalid JSON: ${err.message}`);
    }
  }

  async getModels() {
    return [];
  }

  async testConnection(model) {
    throw new Error('testConnection not implemented in BaseProvider');
  }

  async translate(text, sourceLang, targetLang, model) {
    throw new Error('translate not implemented in BaseProvider');
  }
}

module.exports = BaseProvider;
