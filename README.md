# Convoco - AI-Powered Debate Platform

A sophisticated full-stack debate platform that combines real-time interactive debates with advanced AI analysis. Built with modern web technologies, featuring Google's Gemini AI integration, speech-to-text capabilities, and comprehensive user management for an immersive debate training experience.

## Live Demo

**Platform**: [Live Application](https://convoco.vercel.app) *(deployed on Vercel)*  
**API**: RESTful endpoints with real-time Firebase integration

## Features

- **Real-Time Debate System**: Engage in structured debates with live argument tracking and turn-based mechanics
- **AI-Powered Analysis**: Advanced argument analysis using Google's Gemini AI with real-time feedback and scoring
- **Speech-to-Text Integration**: Multiple speech recognition options including Google Cloud Speech-to-Text and Web Speech API
- **Comprehensive User System**: User authentication, profiles, leaderboards, and debate history tracking
- **Live Debate Rooms**: Join existing debates or create new rooms with customizable topics and rounds
- **Intelligent Debate Flow**: Automated turn management, round progression, and debate status tracking
- **Performance Analytics**: Detailed scoring system with AI-generated insights and improvement suggestions
- **Responsive Design**: Optimized interface for desktop, tablet, and mobile debate participation
- **Real-Time Updates**: Firebase-powered live updates for seamless multi-user experiences

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router and Server Components
- **React 18** - Modern UI library with concurrent features and hooks
- **TypeScript** - Full type safety across the application
- **Tailwind CSS** - Utility-first styling with custom design system
- **Headless UI** - Accessible UI components with React integration
- **Heroicons** - Beautiful hand-crafted SVG icons

### Backend & AI Services
- **Google Gemini AI** - Advanced language model for argument analysis and scoring
- **Google Cloud Speech-to-Text** - Professional-grade speech recognition API
- **Firebase Authentication** - Secure user management and session handling
- **Firestore Database** - NoSQL real-time database for debates and user data
- **Web Speech API** - Browser-native speech recognition fallback

### Development Tools
- **ESLint** - Code linting and quality enforcement
- **PostCSS** - CSS processing and optimization
- **TypeScript Config** - Strict type checking configuration
- **RecordRTC** - Audio recording and processing library

## Project Structure

```
convoco/
├── public/                     # Static assets and images
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── api/              # API routes and endpoints
│   │   │   └── speech-to-text/ # Speech recognition endpoints
│   │   ├── auth/             # Authentication pages
│   │   ├── debates/          # Debate-related pages
│   │   │   ├── [debateId]/   # Dynamic debate pages
│   │   │   └── new/          # Create new debate
│   │   ├── leaderboard/      # User rankings and stats
│   │   └── profile/          # User profile management
│   ├── components/           # Reusable UI components
│   │   ├── auth/            # Authentication components
│   │   ├── debate/          # Debate-specific components
│   │   │   ├── DebateArena.tsx    # Main debate interface
│   │   │   ├── AIAnalysis.tsx     # AI analysis display
│   │   │   ├── ArgumentInput.tsx  # Argument input with speech
│   │   │   └── SpeechToTextButton.tsx # Speech recognition
│   │   ├── layout/          # Layout and navigation
│   │   └── ui/              # Generic UI components
│   ├── context/             # React context providers
│   │   ├── AuthContext.tsx  # Authentication state
│   │   └── DebateContext.tsx # Debate state management
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries and services
│   │   ├── firebase/        # Firebase configuration and helpers
│   │   └── gemini/          # Google Gemini AI integration
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Helper functions and utilities
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Google Cloud Platform account (for Speech-to-Text API)
- Google AI Studio API key (for Gemini AI)
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/convoco.git
   cd convoco
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   
   ```bash
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   
   # Google AI (Gemini) Configuration
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   
   # Google Cloud Speech-to-Text
   GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id
   GOOGLE_CLOUD_PRIVATE_KEY=your_google_cloud_private_key
   GOOGLE_CLOUD_CLIENT_EMAIL=your_google_cloud_client_email
   
   # Application Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Development Process & Challenges

### Key Technical Implementations
- **AI Integration Architecture**: Implemented sophisticated prompt engineering with Google's Gemini AI for nuanced debate analysis and scoring
- **Real-Time Debate Flow**: Built complex state management system handling turn-based mechanics, round progression, and live updates
- **Multi-Modal Input**: Integrated multiple speech-to-text solutions with fallback mechanisms for cross-platform compatibility
- **Advanced Firebase Usage**: Leveraged Firestore's real-time capabilities with complex queries and transaction handling
- **Type-Safe Development**: Comprehensive TypeScript implementation with strict type checking across all components

### Problem-Solving Highlights
- **AI Response Optimization**: Developed token-efficient prompting strategies to minimize API costs while maintaining analysis quality
- **Speech Recognition Reliability**: Implemented hybrid approach combining Google Cloud API with Web Speech API for maximum compatibility
- **Real-Time Synchronization**: Solved complex state synchronization challenges in multi-user debate environments
- **Performance Optimization**: Built efficient argument caching and analysis result storage systems
- **User Experience Flow**: Designed intuitive debate progression with clear visual feedback and status indicators

## Key Components

- **DebateArena**: Core debate interface managing real-time argument exchange and AI analysis integration
- **AIAnalysis**: Sophisticated component displaying AI-generated argument scores and feedback
- **ArgumentInput**: Multi-modal input component with integrated speech recognition and text formatting
- **SpeechToTextButton**: Advanced speech recognition handler with multiple API support and error handling
- **DebateResults**: Comprehensive results display with AI-generated winner determination and detailed analytics
- **LeaderboardSystem**: User ranking system with performance tracking and statistical analysis

## API Architecture

- **Speech-to-Text API** (`/api/speech-to-text`) - Google Cloud Speech recognition with audio processing
- **Firebase Firestore** - Real-time database operations for debates, arguments, and user management
- **Google Gemini Integration** - AI analysis endpoints with optimized prompt engineering
- **Authentication System** - Firebase Auth integration with secure session management

## Deployment

Optimized for modern deployment platforms:

**Vercel (Recommended):**
```bash
npm run build
```

**Configuration Requirements:**
- Environment variables setup for all external APIs
- Firebase project configuration with proper security rules
- Google Cloud Platform setup for Speech-to-Text API
- Gemini AI API key configuration

## Security & Privacy

- **API Security**: All external API keys are server-side only with proper environment variable management
- **Firebase Security**: Comprehensive Firestore security rules preventing unauthorized data access
- **Speech Data**: Audio processing happens via secure Google Cloud endpoints with no local storage
- **User Authentication**: Secure Firebase Authentication with proper session handling
- **Data Privacy**: User debate data is encrypted and stored with appropriate access controls

## Future Enhancements

- [ ] Advanced debate formats (Oxford-style, Parliamentary, etc.)
- [ ] Video debate capabilities with WebRTC integration
- [ ] Tournament and bracket system for competitive debates
- [ ] Advanced AI coaching with personalized improvement suggestions
- [ ] Integration with educational platforms and LMS systems
- [ ] Multi-language support for international debate communities
- [ ] Advanced analytics dashboard with performance insights
- [ ] Collaborative debate preparation tools and research features

## Contributors

- **Full-Stack Development & AI Integration**: [Eleazar](https://github.com/P541M)
- **Backend Development & Database Architecture**: [Leon](https://github.com/Quoctynoob)  
- **Frontend Development & UI/UX Design**: [Megan](https://github.com/megdcosta)
- **Design & Frontend Development**: [Emily](https://github.com/milychang19)

---

*Empowering the next generation of debaters through AI-powered training and analysis*