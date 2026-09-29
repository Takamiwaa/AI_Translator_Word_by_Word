# AI Word-by-Word Translator 🌐

An advanced full-stack web application for translating sentences using AI with **word-by-word / phrase-by-phrase alignment visualization**, detailed grammatical analysis, IPA phonetics, and CEFR vocabulary classification.

---

## 🌟 Key Features

- **Word & Phrase Alignment**: Visualizes connections between source sentence units and target translations with interactive word blocks.
- **Intelligent Multi-word Phrase Grouping**: Automatically handles phrasal verbs, idioms, compound words, and collocations (e.g., `"looking forward to"` &rarr; `"menantikan"`, `"keluargaku"` &rarr; `"my family"`).
- **Interactive Word Inspection**: Click any word block to trigger a floating card displaying base word (lemma), Part of Speech (POS), IPA pronunciation, simplified learner phonetics, literal & contextual meanings, sample sentences, and CEFR level (A1–C2).
- **Grammar Analysis Engine**: Identifies grammatical tenses, structural formulas, and context explanations.
- **13+ AI Provider Abstraction**:
  - Google Gemini
  - OpenAI (ChatGPT)
  - Anthropic Claude
  - DeepSeek AI
  - Mistral AI
  - Groq LPU
  - OpenRouter
  - Cohere
  - xAI (Grok)
  - Together AI
  - Ollama (Local)
  - LM Studio (Local)
  - Custom OpenAI-compatible API
- **Dynamic Model Discovery**: Fetches model lists dynamically from provider endpoints.
- **Monochrome Dark Interface**: Elegant `#050505` background, `#101010` surface cards, and `#252525` glowing borders with zero rainbow gradients.
- **MySQL History Logging**: Stores translation records with fallback zero-config support.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Variables & Micro-animations), JavaScript ES6+ (Fetch API, SPA UI architecture).
- **Backend**: Node.js, Express.js, Sequelize ORM, `mysql2`, `sqlite3` fallback.
- **Security**: Helmet headers, CORS, Rate Limiting (`express-rate-limit`), Input Sanitization, Server-side API key processing.

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- Node.js v18+ & npm
- MySQL 8.0+ (Optional - SQLite zero-config fallback included)

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` as needed:
```env
PORT=3000
NODE_ENV=development

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=ai_word_translator

DEFAULT_PROVIDER=gemini
DEFAULT_MODEL=gemini-1.5-flash
```

### 4. MySQL Setup & Schema DDL
Execute the schema script in your MySQL CLI or Workbench:
```bash
mysql -u root -p < database/schema.sql
```

*(Note: If MySQL is unavailable, the application automatically uses SQLite fallback at `./database/app.sqlite`)*

### 5. Running the Application
Start the development server:
```bash
npm run dev
```

Open your browser at:
`http://localhost:3000`

---

## 🔐 Security Best Practices

- **Zero Key Leakage**: API keys are processed strictly in backend HTTP headers. Keys never appear in HTML, frontend JS, browser logs, or error responses.
- **Rate Limiting**: Protected against brute force requests (100 requests per 15 minutes).
- **SQL Injection Prevention**: Parameterized queries using Sequelize ORM.

---

## 🔌 API Documentation

### 1. Translate Sentence
- **Endpoint**: `POST /api/translate`
- **Body**:
```json
{
  "text": "Aku pergi ke pantai bersama keluargaku.",
  "source_language": "Indonesian",
  "target_language": "English",
  "provider": "gemini",
  "model": "gemini-1.5-flash"
}
```

### 2. Get AI Providers & Dynamic Models
- **Providers**: `GET /api/providers`
- **Models**: `GET /api/providers/:provider/models`

### 3. Test Connection
- **Endpoint**: `POST /api/providers/test`

### 4. Translation History
- **List**: `GET /api/history?search=beach&page=1`
- **Delete**: `DELETE /api/history/:id`

---

## 🧩 Adding a New AI Provider

1. Create a new provider file in `backend/services/ai/newprovider.js` extending `BaseProvider`.
2. Implement `getModels()`, `testConnection()`, and `translate()`.
3. Register the provider in `backend/services/ai/providerRegistry.js`.

---

## 📜 License
MIT License &copy; 2026 AI Word-by-Word Translator.
