# AI Word-by-Word Translator

A full-stack web application that translates sentences with AI and visualizes **word-by-word and phrase-by-phrase alignment**, alongside grammatical analysis, IPA phonetics, and CEFR vocabulary classification.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Security](#security)
- [API Reference](#api-reference)
- [Adding a New AI Provider](#adding-a-new-ai-provider)
- [License](#license)

---

## Features

**Translation and Alignment**
- Interactive word blocks that visualize the connection between source and target units.
- Intelligent grouping of multi-word units such as phrasal verbs, idioms, compounds, and collocations (for example, `looking forward to` to `menantikan`, or `keluargaku` to `my family`).

**Word Inspection**
- Click any word block to open a floating card showing:
  - Base form (lemma) and part of speech
  - IPA pronunciation and simplified learner phonetics
  - Literal and contextual meanings
  - Example sentences
  - CEFR level (A1 to C2)

**Grammar Analysis**
- Detects tenses, structural formulas, and provides contextual explanations.

**Provider Flexibility**
- A unified abstraction over 13 AI providers (see below).
- Dynamic model discovery directly from each provider's endpoint.

**Interface and Storage**
- Monochrome dark interface: `#050505` background, `#101010` surface cards, `#252525` borders, with no gradients.
- Translation history stored in MySQL, with a zero-configuration SQLite fallback.

### Supported Providers

| Cloud | Local | Custom |
| --- | --- | --- |
| Google Gemini | Ollama | Any OpenAI-compatible API |
| OpenAI | LM Studio | |
| Anthropic Claude | | |
| DeepSeek | | |
| Mistral AI | | |
| Groq | | |
| OpenRouter | | |
| Cohere | | |
| xAI (Grok) | | |
| Together AI | | |

---

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | HTML5, vanilla CSS3 (custom properties, micro-animations), JavaScript ES6+ (Fetch API, SPA architecture) |
| Backend | Node.js, Express.js, Sequelize ORM, `mysql2`, `sqlite3` fallback |
| Security | Helmet, CORS, `express-rate-limit`, input sanitization, server-side API key handling |

---

## Getting Started

### Prerequisites

- Node.js v18 or later, with npm
- MySQL 8.0 or later (optional, SQLite fallback is included)

### Installation

```bash
npm install
```

### Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Then adjust the values as needed:

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

### Database Setup

Run the schema script with the MySQL CLI or Workbench:

```bash
mysql -u root -p < database/schema.sql
```

> If MySQL is unavailable, the application automatically falls back to SQLite at `./database/app.sqlite`.

### Running the Application

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Security

- **No key leakage**: API keys are handled exclusively in backend HTTP headers and never appear in HTML, frontend JavaScript, browser logs, or error responses.
- **Rate limiting**: 100 requests per 15 minutes to mitigate brute-force attempts.
- **SQL injection prevention**: All queries are parameterized through Sequelize ORM.

---

## API Reference

### Translate a Sentence

`POST /api/translate`

```json
{
  "text": "Aku pergi ke pantai bersama keluargaku.",
  "source_language": "Indonesian",
  "target_language": "English",
  "provider": "gemini",
  "model": "gemini-1.5-flash"
}
```

### Providers and Models

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/providers` | List available AI providers |
| `GET` | `/api/providers/:provider/models` | List models for a provider |
| `POST` | `/api/providers/test` | Test a provider connection |

### Translation History

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/history?search=beach&page=1` | Search and paginate history |
| `DELETE` | `/api/history/:id` | Delete a history entry |

---

## Adding a New AI Provider

1. Create `backend/services/ai/newprovider.js` with a class extending `BaseProvider`.
2. Implement the `getModels()`, `testConnection()`, and `translate()` methods.
3. Register the provider in `backend/services/ai/providerRegistry.js`.

---

## License

Released under the MIT License. Copyright &copy; 2026 AI Word-by-Word Translator.
