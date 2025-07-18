# Mindful Harbor - A Wellness and Mindfulness App

## Overview

Mindful Harbor is a modern web application focused on mental wellness and mindfulness practices. It provides users with daily reflection prompts, habit tracking, micro-moment activities, and progress visualization to support their mindfulness journey. The app features a clean, calming design with a mobile-first approach and responsive UI components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a full-stack architecture with a clear separation between frontend and backend components:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom mindfulness-themed color palette
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture  
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple
- **API Design**: RESTful API endpoints with JSON responses

### Database Schema
The application uses a relational database structure with the following main entities:
- **Users**: Basic user information and authentication
- **Prompts**: Daily reflection prompts with usage tracking
- **MicroMoments**: Quick mindfulness activities categorized by type
- **Habits**: User-defined habits with completion tracking
- **Reflections**: User responses to daily prompts with mood tracking
- **DailyProgress**: Aggregated daily metrics and progress tracking

## Key Components

### Core Features
1. **Daily Reflection System**: Provides users with thoughtful prompts for self-reflection
2. **Habit Tracking**: Allows users to create and track mindfulness habits with streak counting
3. **Micro Moments**: Quick 30-60 second mindfulness activities for busy schedules
4. **Progress Visualization**: Circular progress indicators and streak tracking
5. **Mobile-First Design**: Optimized for mobile devices with bottom navigation

### UI Components
- **Component Library**: Comprehensive set of reusable UI components based on Radix UI primitives
- **Design System**: Consistent color palette with teal, sage, and coral accent colors
- **Responsive Layout**: Mobile-optimized with desktop support
- **Navigation**: Bottom tab navigation for mobile, header navigation for desktop

### Data Management
- **Storage Interface**: Abstracted storage layer supporting both in-memory and database implementations
- **Query Optimization**: React Query for caching and background data synchronization
- **Type Safety**: Full TypeScript coverage with Zod schema validation

## Data Flow

1. **User Interaction**: Users interact with React components that trigger API calls
2. **API Layer**: Express.js routes handle HTTP requests and validate input
3. **Storage Layer**: Abstracted storage interface manages data persistence
4. **Database**: PostgreSQL stores user data with Drizzle ORM for type-safe queries
5. **State Management**: TanStack Query manages client-side state and caching
6. **UI Updates**: React components re-render based on updated state

The application uses optimistic updates for better user experience, with background synchronization to maintain data consistency.

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **Build Tools**: Vite, TypeScript, ESBuild for production builds
- **UI Components**: Radix UI primitives, Tailwind CSS, Lucide React icons
- **State Management**: TanStack React Query for server state

### Backend Dependencies
- **Server**: Express.js with TypeScript support
- **Database**: Drizzle ORM, Neon serverless PostgreSQL driver
- **Validation**: Zod for runtime type checking and validation
- **Session Management**: connect-pg-simple for PostgreSQL session storage

### Development Tools
- **Type Checking**: TypeScript with strict mode enabled
- **Code Quality**: ESLint integration, Prettier formatting
- **Development Server**: Vite with HMR and error overlay
- **Replit Integration**: Custom plugins for Replit development environment

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express.js backend proxy
- **Hot Module Replacement**: Real-time updates during development
- **Error Handling**: Runtime error overlays and comprehensive logging

### Production Build
- **Frontend Build**: Vite builds optimized static assets to `dist/public`
- **Backend Build**: ESBuild compiles TypeScript server to `dist/index.js`
- **Asset Serving**: Express serves static files in production mode
- **Environment Variables**: Database connections managed via environment variables

### Database Management
- **Migrations**: Drizzle Kit for database schema migrations
- **Connection**: Neon serverless PostgreSQL for scalable database hosting
- **Schema Validation**: TypeScript types generated from database schema

## Recent Changes

### July 18, 2025 - Deployment Configuration Fixes
- ✓ Resolved React Native dependency conflicts for web deployment
- ✓ Removed mobile-specific dependencies (@expo/cli, expo, eas-cli) from web build
- ✓ Updated @types/react to version 19.1.8 to resolve peer dependency conflicts
- ✓ Updated @types/react-dom to version 19.1.0 for compatibility
- ✓ Fixed tsconfig.json by removing expo/tsconfig.base extends configuration
- ✓ Verified successful production build process (npm run build)
- ✓ Application is now ready for web deployment without React Native conflicts

### July 15, 2025 - App Store Submission Preparation
- ✓ Created React Native mobile app in `/mobile` directory  
- ✓ Implemented all main screens: Home, Reflect, Habits, Progress
- ✓ Added native navigation with bottom tabs
- ✓ Integrated with existing backend API
- ✓ Added mobile-optimized UI components with haptic feedback
- ✓ Configured for iOS/Android App Store deployment
- ✓ Set up subscription-ready architecture
- ✓ Built professional support infrastructure with FAQ page
- ✓ Created business email: mindfulharborapp@gmail.com
- ✓ Resolved app name trademark issues (changed to "Mindful Harbor")
- ✓ Created App Store screenshots without transparency (PNG format)
- ✓ Deployed support page at /support endpoint
- ✓ Web app fully functional and deployed
- → iOS .ipa build challenges encountered - requires actual Xcode/Apple Developer workflow

### Status Summary
**COMPLETED AND WORKING:**
- ✅ Full web application with 365 unique daily prompts
- ✅ All core features: habits, progress tracking, micro-moments, reflections
- ✅ Mobile-responsive design that works perfectly on phones
- ✅ Professional App Store screenshots (PNG format, no transparency)
- ✅ App Store Connect listing prepared with all metadata
- ✅ Support page and contact information ready
- ✅ Ready for Progressive Web App submission to Apple

**REMAINING CHALLENGE:**
- iOS .ipa file creation requires actual Xcode + Apple Developer certificates
- Transporter only accepts properly code-signed iOS builds
- Web-based build tools (CodeMagic, EAS) require account setup and proper configuration

**RECOMMENDED NEXT STEPS:**
1. Submit as Progressive Web App through App Store Connect
2. Or use Xcode locally with Apple Developer certificates to create signed .ipa
3. Web app is production-ready and can be submitted immediately as PWA

### Mobile App Features
- Daily reflection prompts with mood tracking
- Habit creation and completion tracking  
- Progress visualization with circular charts
- Micro-moments mindfulness activities
- Native mobile navigation and animations
- Haptic feedback for interactions
- Optimized for touch interfaces

### Deployment Strategy
- Web app: Replit deployment for web users
- Mobile app: React Native + Expo for iOS/Android App Stores
- Revenue model: Freemium with $9.99/month premium subscription
- Target market: Mindfulness and wellness app users

The application is designed for deployment on platforms like Replit, Vercel, or similar services that support Node.js applications with PostgreSQL databases.