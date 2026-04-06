import "dotenv/config";
import type { ConfigContext, ExpoConfig } from "expo/config";

const bundleId = "com.sathi001.studybuddy";
const scheme = "studybuddy";
const projectId = "fa6a2e23-08ad-44cc-98b6-cce5c27b4ec8";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Study Buddy",
  slug: "ai_study_assistant",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: bundleId,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: bundleId,
    permissions: ["POST_NOTIFICATIONS"],
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme,
            host: "*",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-audio",
      {
        microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone.",
      },
    ],
    [
      "expo-video",
      {
        supportsBackgroundPlayback: true,
        supportsPictureInPicture: true,
      },
    ],
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          buildArchs: ["armeabi-v7a", "arm64-v8a"],
          minSdkVersion: 24,
        },
      },
    ],
    "expo-asset",
  ],
  extra: {
    eas: {
      projectId,
    },
    EXPO_PUBLIC_OAUTH_PORTAL_URL: process.env.EXPO_PUBLIC_OAUTH_PORTAL_URL,
    EXPO_PUBLIC_OAUTH_SERVER_URL: process.env.EXPO_PUBLIC_OAUTH_SERVER_URL,
    EXPO_PUBLIC_APP_ID: process.env.EXPO_PUBLIC_APP_ID,
    EXPO_PUBLIC_OWNER_OPEN_ID: process.env.EXPO_PUBLIC_OWNER_OPEN_ID,
    EXPO_PUBLIC_OWNER_NAME: process.env.EXPO_PUBLIC_OWNER_NAME,
    EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
    EXPO_PUBLIC_APP_SCHEME: process.env.EXPO_PUBLIC_APP_SCHEME,
  },
  experiments: {
    typedRoutes: true,
    reactCompiler: false,
  },
});