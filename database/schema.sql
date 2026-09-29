-- AI Word-by-Word Translator Database Schema
-- MySQL 8.0+ / MariaDB Compatible

CREATE DATABASE IF NOT EXISTS `ai_word_translator`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `ai_word_translator`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Providers Table
CREATE TABLE IF NOT EXISTS `providers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `display_name` VARCHAR(100) NOT NULL,
  `supports_dynamic_models` BOOLEAN DEFAULT TRUE,
  `default_model` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. User API Keys Table
CREATE TABLE IF NOT EXISTS `user_api_keys` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL DEFAULT 1,
  `provider` VARCHAR(100) NOT NULL,
  `api_key` VARCHAR(512) NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_user_provider` (`user_id`, `provider`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Translation History Table
CREATE TABLE IF NOT EXISTS `translation_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL DEFAULT 1,
  `source_language` VARCHAR(50) NOT NULL,
  `target_language` VARCHAR(50) NOT NULL,
  `source_text` TEXT NOT NULL,
  `target_text` TEXT NOT NULL,
  `alignment_json` JSON NOT NULL,
  `grammar_json` JSON DEFAULT NULL,
  `provider` VARCHAR(100) NOT NULL,
  `model` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_user_created` (`user_id`, `created_at`),
  INDEX `idx_lang` (`source_language`, `target_language`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. User Settings Table
CREATE TABLE IF NOT EXISTS `user_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL DEFAULT 1 UNIQUE,
  `active_provider` VARCHAR(100) DEFAULT 'gemini',
  `active_model` VARCHAR(100) DEFAULT 'gemini-1.5-flash',
  `theme` VARCHAR(50) DEFAULT 'dark',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Initial User
INSERT IGNORE INTO `users` (`id`, `username`) VALUES (1, 'default_user');

-- Seed Initial Providers
INSERT IGNORE INTO `providers` (`name`, `display_name`, `supports_dynamic_models`, `default_model`) VALUES
('gemini', 'Google Gemini', 1, 'gemini-1.5-flash'),
('openai', 'OpenAI (ChatGPT)', 1, 'gpt-4o-mini'),
('claude', 'Anthropic Claude', 0, 'claude-3-5-sonnet-20241022'),
('deepseek', 'DeepSeek AI', 1, 'deepseek-chat'),
('mistral', 'Mistral AI', 1, 'mistral-small-latest'),
('groq', 'Groq LPU', 1, 'llama-3.3-70b-versatile'),
('openrouter', 'OpenRouter', 1, 'meta-llama/llama-3.3-70b-instruct'),
('cohere', 'Cohere', 0, 'command-r-plus'),
('xai', 'xAI (Grok)', 1, 'grok-2-latest'),
('together', 'Together AI', 1, 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo'),
('ollama', 'Ollama (Local)', 1, 'llama3'),
('lmstudio', 'LM Studio (Local)', 1, 'local-model'),
('custom', 'Custom OpenAI Compatible', 0, 'custom-model');

-- Seed Initial Settings
INSERT IGNORE INTO `user_settings` (`user_id`, `active_provider`, `active_model`, `theme`) VALUES
(1, 'gemini', 'gemini-1.5-flash', 'dark');
