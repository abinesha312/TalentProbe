# 🧠 HireSensi - Intelligent Survey Generation for Modern Recruiters

![HireSensi Banner](https://img.shields.io/badge/HireSensi-AI_Powered_Recruitment-blue?style=for-the-badge&logo=brain&logoColor=white)

**HireSensi** is an innovative AI-powered platform that transforms traditional job postings into intelligent, personalized survey questions and enables dynamic voice interviews with AI assistance. Built for modern recruiters who want to gather deeper insights about roles, candidates, and hiring requirements.

## 🚀 Features

### 📋 Smart Job Post Analysis

- **Intelligent Text Processing**: Upload job postings via file upload (.txt) or direct text input
- **AI-Powered Analysis**: Leverages OpenRouter API with Claude 3 Haiku for sophisticated content analysis
- **Context Understanding**: Extracts key requirements, responsibilities, and implicit job details

### 🎯 Dynamic Question Generation

- **Personalized Surveys**: Generates 8-12 tailored questions based on specific job postings
- **Multi-Category Questions**: Covers responsibilities, candidate profiles, team dynamics, company culture, and success metrics
- **Intelligent Filtering**: AI ensures questions are relevant, actionable, and conversation-ready

### 🎤 AI Voice Interview System

- **Real-time Speech Recognition**: Web Speech API integration for natural voice interaction
- **Smart Conversation Flow**: AI responds contextually to recruiter inputs with follow-up questions
- **Advanced Audio Controls**:
  - Minimum 5-second listening periods
  - 5-second pause detection for natural conversation flow
  - Duplicate response prevention
  - Background noise filtering

### 💬 Interactive Conversation Management

- **Live Chat Interface**: Real-time conversation history with timestamps
- **Message Threading**: Clear distinction between user and AI responses
- **Context Preservation**: Maintains conversation context throughout the session
- **Export Capabilities**: Save conversation transcripts for future reference

## 🛠️ Technology Stack

### Frontend Framework

- **React 18** - Modern UI library with hooks and functional components
- **TypeScript** - Type-safe development environment
- **Vite** - Lightning-fast build tool and development server

### Styling & UI

- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Shadcn/UI** - Beautiful, accessible React component library
- **Radix UI** - Low-level UI primitives for complex interactions
- **Lucide React** - Beautiful, customizable icon set

### AI & API Integration

- **OpenRouter API** - Access to Claude 3 Haiku for intelligent text processing
- **Web Speech API** - Browser-native speech recognition and synthesis
- **Custom Speech Processing** - Advanced audio handling and conversation management

### Development Tools

- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing and optimization
- **React Hook Form** - Efficient form state management
- **Zod** - Runtime type validation

## 📁 Project Structure

```
HireSensi/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Base UI components (shadcn)
│   │   ├── JobPostInput.tsx # Job posting input interface
│   │   ├── QuestionGenerator.tsx # Question generation display
│   │   └── VoiceInterviewer.tsx # AI voice interview system
│   ├── services/            # API and business logic
│   │   └── questionGenerator.ts # OpenRouter API integration
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Application pages
│   └── lib/                 # Utility functions
├── public/                  # Static assets
├── .env                     # Environment variables (not tracked)
└── package.json            # Dependencies and scripts
```

## 🔧 Installation & Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **OpenRouter API Key** (for AI functionality)

### Installation Steps

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd HireSensi
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   - The OpenRouter API key is already configured in the `.env` file
   - No additional setup required for AI functionality

4. **Start Development Server**

   ```bash
   npm run dev
   ```

5. **Open Application**
   - Navigate to `http://localhost:5173`
   - Start using HireSensi immediately!

## 🎯 How to Use HireSensi

### Step 1: Job Post Input

1. Navigate to the **"Job Post Input"** tab
2. Either upload a `.txt` file containing your job posting or paste the content directly
3. Click **"Generate Survey Questions"** to process with AI

### Step 2: Review Generated Questions

1. Switch to the **"Generated Questions"** tab
2. Review the AI-generated survey questions tailored to your job posting
3. Questions cover various aspects like responsibilities, culture, and success metrics

### Step 3: Voice Interview

1. Go to the **"Voice Interview"** tab
2. Click **"Start Interview"** to begin the AI conversation
3. Use the microphone to speak naturally - the system will:
   - Listen for a minimum of 5 seconds
   - Automatically detect 5-second pauses to process your input
   - Respond with contextual follow-up questions
   - Maintain conversation history

## 🔒 Security & Privacy

- **Environment Variables**: API keys stored securely in `.env` files
- **No Data Persistence**: Conversations are not stored permanently
- **Local Processing**: Speech recognition happens in the browser
- **Secure API Calls**: All AI requests use encrypted HTTPS connections

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deployment Options

- **Vercel**: Optimized for React applications
- **Netlify**: Simple drag-and-drop deployment
- **Traditional Hosting**: Upload `dist/` folder contents

## 🤝 Contributing

We welcome contributions to HireSensi! Please feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your improvements
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions, issues, or feature requests:

- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for common solutions

---

**Built with ❤️ for modern recruiters who want to hire smarter, not harder.**
