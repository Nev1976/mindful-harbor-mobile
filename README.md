#Mindful Harbor 🧘‍♀️

A modern mindfulness and wellness web application designed to support mental well-being through daily reflection prompts, habit tracking, and micro-moment mindfulness activities.

## ✨ Features

- **Daily Reflection Prompts** - 365+ unique mindfulness prompts for self-reflection
- **Habit Tracking** - Create and track mindfulness habits with streak counting
- **Micro Moments** - Quick 30-60 second mindfulness activities for busy schedules  
- **Progress Visualization** - Beautiful charts and progress indicators
- **Mood Tracking** - Track emotional well-being over time
- **Mobile-First Design** - Optimized for all devices with responsive UI

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with custom mindfulness-themed colors
- **Radix UI** components with shadcn/ui design system
- **TanStack Query** for server state management
- **Wouter** for lightweight routing

### Backend  
- **Node.js** with Express.js
- **TypeScript** with ES modules
- **PostgreSQL** database with Drizzle ORM
- **Neon** serverless PostgreSQL hosting
- **Session management** with PostgreSQL storage

## 🛠️ Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/YOUR_USERNAME/mindful-harbor.git
cd mindful-harbor
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env` file with:
```env
DATABASE_URL=your_neon_postgresql_url
NODE_ENV=development
```

4. **Run the application:**
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## 📁 Project Structure

```
mindful-harbor/
├── client/src/          # React frontend
│   ├── components/      # Reusable UI components
│   ├── pages/          # Application pages
│   └── lib/            # Utilities and configurations
├── server/             # Express.js backend
├── shared/             # Shared types and schemas
├── dist/               # Production build output
└── docs/               # Documentation
```

## 🎯 Core Components

### Mindfulness Features
- **Daily Prompts**: Thoughtfully crafted reflection questions
- **Habit Builder**: Create custom mindfulness routines
- **Micro Activities**: Quick mindfulness exercises
- **Progress Dashboard**: Visual tracking of wellness journey

### Technical Features
- **Type Safety**: Full TypeScript coverage with Zod validation
- **Responsive Design**: Mobile-optimized with desktop support
- **Real-time Updates**: Optimistic UI with background sync
- **Session Management**: Secure user authentication

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deployment Platforms
The application is ready for deployment on:
- **Vercel** (recommended for frontend)
- **Railway** (full-stack deployment)
- **Render** (Node.js hosting)
- **Netlify** (with serverless functions)

### Environment Requirements
- Node.js 18+
- PostgreSQL database (Neon recommended)
- Environment variables configured

## 🔧 Development Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production  
npm run start     # Start production server
npm run check     # TypeScript type checking
npm run db:push   # Push database schema changes
```

## 📱 Mobile Experience

Mindful Harbor is designed with a mobile-first approach:
- Touch-optimized interface
- Bottom navigation for easy thumb access
- Responsive design that works on all screen sizes
- Progressive Web App (PWA) capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies for optimal performance
- Designed with accessibility and user experience in mind
- Inspired by evidence-based mindfulness practices



**Mindful Harbor** - Your digital sanctuary for mindfulness and well-being 🌊

# Mindful Harbor Mobile App

A React Native mobile application for mindfulness and wellness.

## Features
- Daily reflection prompts
- Habit tracking
- Micro-moment mindfulness activities
- Progress visualization

## Build Instructions
This app is configured to build with CodeMagic CI/CD for iOS App Store deployment.

