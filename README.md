# 🎓 AI Study Assistant

An intelligent AI-powered study companion built with **Expo + TypeScript** that helps students understand concepts, generate quizzes, summarize notes, and create smart revision plans.

---

## 🚀 Overview

AI Study Assistant is designed to help students:

* 📚 Upload notes and get AI summaries
* 🧠 Ask subject-related questions and get clear explanations
* 📝 Generate MCQs & long-answer questions
* 📅 Create smart revision plans
* 📊 Track study progress

This app aims to make exam preparation faster, smarter, and more structured.

---

## 🛠 Tech Stack

* ⚛️ Expo (React Native)
* 🟦 TypeScript
* 🔐 Authentication System
* 🌐 AI API Integration (OpenAI / Gemini / Custom Backend)
* 📦 Node.js Backend (recommended for secure API handling)

---

## ✨ Features

### 🔐 Authentication

* Secure login & signup
* User session management

### 🎨 Modern UI

* Custom color schemes
* Clean student-focused design
* Responsive layout

### 🤖 AI-Powered Tools (Planned / In Progress)

* AI Chat Tutor
* Notes Summarizer
* MCQ Generator
* Long Question Generator
* Smart Study Planner
* Flashcard Generator

---

## 📱 How It Works

1. User logs into the app
2. Uploads notes or types a question
3. AI processes the content
4. User receives:

   * Simplified explanations
   * Summary
   * Practice questions
   * Study plan

---

## 🧠 Example Use Cases

### Example 1 – Ask a Question

Input:

> Explain Newton’s Second Law in simple terms.

Output:

* Clear explanation
* Formula derivation
* Numerical example
* Exam tip

---

### Example 2 – Generate MCQs

Input:

> Create 10 MCQs from Thermodynamics chapter.

Output:

* 10 multiple choice questions
* Answers included
* Difficulty-based structure

---

## 🏗 Project Structure

```
ai-study-assistant/
│
├── app/                # Screens & navigation
├── components/         # Reusable UI components
├── services/           # API calls & AI logic
├── utils/              # Helper functions
├── assets/             # Images & icons
└── backend/ (optional) # Secure AI API handling
```

---

## 🔧 Installation

Clone the repository:

```bash
git clone https://github.com/Aashish-po/ai-study-assistant.git
cd ai-study-assistant
```

Install dependencies:

```bash
npm install
```

Start the project:

```bash
npx expo start
```

---

## 🔐 Environment Variables (Client vs Server)

This project separates client and server env values so secrets never end up in the app bundle.

### Client (Expo / EAS)

- Use the template in `.env.example` for local development.
- Only variables prefixed with `EXPO_PUBLIC_` are safe for the client.
- Set the same values in EAS Environment Variables for production builds.

### Server (Vercel)

- Use the template in `.env.server.example`.
- Store these in the Vercel Project Environment Variables (Production + Preview).
- Do not copy server secrets into the client `.env`.

⚠️ Never expose API keys or database credentials in frontend code.
Always keep them server-side.

### Local Development (Client + Server)

```bash
# Client (Expo)
cp .env.example .env
npm run dev

# Server (API)
cp .env.server.example .env.server.local
npx cross-env DOTENV_CONFIG_PATH=.env.server.local npm run dev:server
```

---

## 🧪 Future Improvements

* 📄 PDF upload support
* 📊 Study analytics dashboard
* ☁️ Cloud storage integration
* 🔔 Smart reminders & notifications
* 🏆 Gamification system
* 🧠 Adaptive learning based on performance

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🌟 Vision

To build a powerful AI-powered education assistant that helps students study efficiently, understand deeply, and perform better in exams.

---
