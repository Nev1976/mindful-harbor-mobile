# Mindful Moments - Mobile App

This is the React Native mobile version of the Mindful Moments mindfulness and wellness app, built for iOS and Android app stores.

## Features

- **Daily Reflection Prompts**: Thought-provoking questions for self-reflection
- **Habit Tracking**: Create and track mindfulness habits with streak counting
- **Micro Moments**: Quick 30-60 second mindfulness activities
- **Progress Visualization**: Beautiful charts and progress tracking
- **Mobile-First Design**: Optimized for touch interfaces with native navigation

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Expo Router** for file-based navigation
- **React Query** for data fetching and caching
- **React Native SVG** for custom graphics
- **Expo Linear Gradient** for beautiful UI elements

## Getting Started

### Prerequisites

- Node.js 18+ 
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android)

### Installation

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Choose your platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your device

### Development

The app connects to your backend server running on `localhost:5000` in development mode. Make sure your main backend is running before testing the mobile app.

### Building for Production

1. Configure your app.json with proper bundle identifiers
2. Build for iOS: `expo build:ios`
3. Build for Android: `expo build:android`
4. Submit to app stores using `expo submit`

## Project Structure

```
mobile/
├── app/
│   ├── (tabs)/          # Tab navigation screens
│   │   ├── index.tsx    # Home screen
│   │   ├── reflect.tsx  # Reflection screen
│   │   ├── habits.tsx   # Habits screen
│   │   └── progress.tsx # Progress screen
│   ├── lib/
│   │   └── api.ts       # API client
│   ├── types/
│   │   └── index.ts     # TypeScript types
│   └── _layout.tsx      # Root layout
├── assets/              # App icons and images
└── app.json            # Expo configuration
```

## App Store Preparation

### Required Assets (to be created):
- App icon (1024x1024)
- Splash screen
- App Store screenshots
- Privacy policy
- App description and keywords

### Revenue Model
- Freemium with basic features free
- Premium subscription: $9.99/month or $59.99/year
- 7-day free trial for premium features

## API Integration

The mobile app connects to the same backend API as the web version, ensuring data consistency across platforms. API endpoints include:

- `/api/daily-prompt` - Get daily reflection prompt
- `/api/habits` - Manage user habits
- `/api/reflections` - Save and retrieve reflections
- `/api/progress/daily` - Track daily progress
- `/api/micro-moments` - Get mindfulness activities

## Next Steps

1. Create app assets (icons, splash screens)
2. Set up App Store Connect account
3. Configure push notifications for daily reminders
4. Implement subscription management
5. Add social sharing features
6. Create onboarding flow for new users