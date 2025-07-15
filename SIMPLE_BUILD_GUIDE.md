# SIMPLE BUILD GUIDE FOR MINDFUL HARBOR

## What You Need:
- The mindful-harbor-complete.tar.gz file from this Replit
- A Mac computer
- 30 minutes

## Step-by-Step on Mac:

### 1. Download the App Files
Download `mindful-harbor-complete.tar.gz` from this Replit to your Mac

### 2. Open Terminal
- Press Cmd+Space
- Type "terminal"
- Press Enter

### 3. Install Tools (run once)
```bash
npm install -g @expo/cli eas-cli
```

### 4. Create Build Folder
```bash
cd ~/Desktop
mkdir mindful-harbor-app
cd mindful-harbor-app
```

### 5. Extract Your App Files
Drag the mindful-harbor-complete.tar.gz file to the mindful-harbor-app folder, then:
```bash
tar -xzf mindful-harbor-complete.tar.gz
```

### 6. Login to Expo
```bash
npx expo login
```
Use your Expo account credentials

### 7. Build for iOS
```bash
eas build --platform ios
```

### 8. Wait and Download
- Build takes 15-20 minutes
- You'll get a download link for the .ipa file
- Download the .ipa file

### 9. Upload to App Store Connect
- Go back to App Store Connect
- In the Build section, upload the .ipa file
- Submit for review

## Your App Details:
- Name: Mindful Harbor
- Bundle ID: com.mindfulmoments.app
- Version: 1.0.0

You're almost there! The build process is automated - just follow these steps.