# Flick Frontend

React Native frontend for `Flick`, built with Expo and `expo-router`. The app lets users pick or capture an image, choose one or more visual styles, send the image to the backend for generation, and then preview, save, or share the generated clipart results.

## Features

- Pick an image from the gallery or capture one with the camera
- Compress the selected image before upload
- Choose multiple clipart styles in one session
- Add an optional prompt extension to influence generation
- Show generation progress and per-style result states
- Save generated images to the device gallery
- Share generated images through the native share sheet

## Tech Stack

- React Native
- Expo
- Expo Router
- Expo Image Picker
- Expo Media Library
- Expo Sharing
- Expo File System
- Expo Image Manipulator

## Setup Steps

### 1. Install prerequisites

Make sure you have:

- Node.js installed
- Android Studio and an emulator, or a physical Android device
- Java/Android SDK configured for local Android builds

### 2. Install dependencies

From the frontend folder:

```bash
cd flick_app
npm install
```

### 3. Configure the backend API URL

The frontend currently uses a hardcoded backend URL in `services/api.js`:

```js
const API_BASE_URL = "http://192.168.1.20:3000";
```

Update this IP address so it points to the machine running the backend. If you test on a physical device, both the phone and backend machine must be on the same network.

### 4. Start the backend

Run the backend server separately before using the app. The frontend expects the generation endpoint at:

- `POST /api/generate`

### 5. Run the app

For Android dev client flow:

```bash
cd flick_app
npx expo run:android
npx expo start --dev-client
```

If the native app is already installed and you only changed JavaScript, `npx expo start --dev-client` is enough. If you changed native config like splash screen, app icon, permissions, or plugins, rebuild with `npx expo run:android`.

### 6. Create an APK

From the Android folder:

```bash
cd flick_app/android
.\gradlew.bat assembleDebug
```

For a release build:

```bash
cd flick_app/android
.\gradlew.bat assembleRelease
```

## Tech Decisions

### Expo-managed React Native with native Android folder

Expo was chosen to move quickly with React Native while still keeping access to native Android builds through the generated `android/` folder. This makes local builds, permissions, splash assets, and APK creation straightforward.

### Expo Router for navigation

`expo-router` keeps navigation file-based and easy to reason about. The app currently has a simple route structure with a home/upload flow and a result screen.

### Hook-based state organization

Generation, result actions, and loading feedback are split into reusable hooks such as:

- `hooks/useClipartGeneration.js`
- `hooks/useResultMediaActions.js`
- `hooks/useRotatingJoke.js`

This keeps screens focused on UI composition instead of putting all async logic into route files.

### Client-side image preprocessing

The frontend compresses images before upload to reduce payload size and improve upload reliability on mobile networks. This helps user experience when working with photos directly from the camera roll.

### Multipart upload to backend

Images are sent as `FormData` instead of base64 from the client. This is simpler for upload handling, reduces request overhead compared with large inline strings, and fits standard backend file processing workflows.

### Native save/share integrations

The app uses Expo modules for gallery save and native share flows so generated images can be used immediately after creation without building custom native bridges.

## Tradeoffs Made


### Local state only

Generation state is kept in memory and tied to the current session. This keeps the implementation simple, but results are not persisted across app restarts and there is no generation history.

### Concurrent generation per style

Generating each selected style independently improves responsiveness and lets users see partial progress, but it can increase network load and backend pressure if many styles are selected at once.

### Android-first setup

The current workflow is optimized for Android development and testing. iOS support is possible through Expo, but it is not the main documented path in this frontend right now.

## Project Structure

```text
flick_app/
  app/
    (tabs)/
      index.jsx
      result.jsx
  components/
  constants/
  hooks/
  services/
  assets/
  app.json
  package.json
```


