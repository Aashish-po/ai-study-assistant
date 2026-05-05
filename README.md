# AI Study Assistant

> Intelligent tutoring platform powered by AI vision and natural language understanding. Study smarter with real-time document analysis and personalized learning guidance.

![GitHub](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-active-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

## 🎯 Overview

AI Study Assistant is a full-stack educational technology platform that leverages computer vision and large language models to provide intelligent tutoring support. Upload study materials, ask questions, and receive real-time AI-powered guidance tailored to your learning pace.

### Key Features

- **Document Intelligence**: Analyze images, PDFs, and handwritten notes with Google Cloud Vision API
- **Real-Time Guidance**: Get instant explanations and personalized study tips
- **OAuth Authentication**: Secure login with Google/GitHub integration
- **Adaptive Learning**: Track progress and adjust difficulty based on performance
- **Cross-Platform**: Native mobile experience with React Native/Expo

## 🛠️ Tech Stack

### Frontend
- **Framework**: React Native + Expo
- **State Management**: Redux / Context API
- **Styling**: Tailwind CSS, NativeWind
- **UI Components**: Custom + shadcn/ui (web)

### Backend
- **Runtime**: Node.js (v20+)
- **Framework**: Express.js
- **RPC Layer**: tRPC (type-safe API)
- **Database**: MySQL with Drizzle ORM
- **Authentication**: OAuth 2.0, JWT

### AI/ML
- **Vision**: Google Cloud Vision API
- **Language Models**: Claude API / Gemini
- **Document Processing**: PDF parsing, OCR

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.19.0 (use `nvm` on Windows)
- npm or pnpm
- Google Cloud Vision API key
- Anthropic API key (for LLM features)

### Installation

```bash
# Clone repository
git clone https://github.com/Aashish-po/ai-study-assistant.git
cd ai-study-assistant

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local

# Configure backend server
# Add OAUTH_SERVER_URL, GOOGLE_CLOUD_API_KEY, ANTHROPIC_API_KEY

# Start Metro bundler
npx expo start

# Open in Expo Go (mobile) or web
# Press 'w' for web, 'a' for Android emulator, 'i' for iOS Simulator
```

### Environment Variables

```env
# Google Cloud
GOOGLE_CLOUD_API_KEY=your_api_key_here

# Anthropic
ANTHROPIC_API_KEY=your_key_here

# OAuth (note: current workaround for OAUTH_SERVER_URL)
OAUTH_CLIENT_ID=your_google_client_id
OAUTH_CLIENT_SECRET=your_google_client_secret
```

## 📁 Project Structure

```
ai-study-assistant/
├── frontend/                 # React Native (Expo)
│   ├── app/                 # App routing & screens
│   ├── components/          # Reusable components
│   ├── hooks/               # Custom React hooks
│   └── utils/               # Helpers & API clients
├── backend/                 # Node.js/Express + tRPC
│   ├── routes/              # API endpoints
│   ├── middleware/          # Auth, logging, etc.
│   ├── schemas/             # tRPC validators
│   └── services/            # Business logic
├── shared/                  # Types & shared logic
└── docs/                    # Documentation

```

## 🔧 Development

### Running Tests

```bash
# Backend tests
npm run test:backend

# Frontend tests
npm run test:frontend

# Coverage report
npm run test:coverage
```

### Code Quality

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Format code
npm run format
```

### Building for Production

```bash
# Web build
npm run build:web

# Mobile build (Expo)
eas build --platform all

# Docker build
docker build -t ai-study-assistant:latest .
```

## 🎓 Usage Examples

### Upload & Analyze Document

```javascript
// Frontend: Select and analyze a study material
const { uploadDocument } = useStudyAssistant();
const result = await uploadDocument(imageFile);
// Returns: { text: "...", analysis: {...} }
```

### Get AI Guidance

```javascript
// Frontend: Ask for explanation
const response = await getStudyGuidance({
  question: "Explain photosynthesis",
  context: documentContent
});
// Returns: personalized explanation with examples
```

## 📊 Architecture

```
Client (React Native)
        ↓
  Expo/Metro
        ↓
  REST/tRPC API
        ↓
Express Server + Middleware
        ↓
┌──────────────────────────┐
│   tRPC Procedures        │
│  - Document processing   │
│  - Q&A generation        │
│  - User management       │
└──────────────────────────┘
        ↓
┌──────────────────────────┐
│  External Services       │
│  - Google Vision API     │
│  - Anthropic Claude API  │
│  - Google Gemini         │
└──────────────────────────┘
        ↓
   MySQL Database
```

## 🐛 Known Issues

- **OAUTH_SERVER_URL Warning**: Workaround deployed; full resolution in progress
- **Metro Bundler on Windows**: Use Node.js v20.19.4 (ESM compatibility)
- **Tailwind Config**: Ensure `tailwind.config.js` is present in root

See [Issues](https://github.com/Aashish-po/ai-study-assistant/issues) for tracking.

## 📚 Documentation

- [Architecture Guide](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [Setup Troubleshooting](./docs/TROUBLESHOOTING.md)
- [Contributing Guide](./CONTRIBUTING.md)

## 🤝 Contributing

Contributions are welcome! Please follow our [contribution guidelines](./CONTRIBUTING.md).

```bash
# Fork & clone
git clone https://github.com/your-username/ai-study-assistant.git
cd ai-study-assistant

# Create feature branch
git checkout -b feature/amazing-feature

# Commit changes
git commit -m 'Add amazing feature'

# Push & create PR
git push origin feature/amazing-feature
```

## 📄 License

This project is licensed under the MIT License — see [LICENSE](./LICENSE) file for details.

## 🙋 Support

- **Issues**: [GitHub Issues](https://github.com/Aashish-po/ai-study-assistant/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Aashish-po/ai-study-assistant/discussions)
- **Email**: poudelashish572@gmail.com

## 🔮 Roadmap

- [ ] Offline mode with local LLM support
- [ ] Video tutorial integration and analysis
- [ ] Collaborative study sessions (real-time)
- [ ] Advanced spaced repetition scheduling
- [ ] Multi-language support (Nepali, Hindi, etc.)
- [ ] Advanced analytics dashboard

---

**Built with ❤️ by [Aashish Paudel](https://github.com/Aashish-po)**

*Last updated: May 2025 | [View Latest](https://github.com/Aashish-po/ai-study-assistant)*
