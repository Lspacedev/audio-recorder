import { ExpoConfig, ConfigContext } from "@expo/config";
import * as dotenv from "dotenv";

// initialize dotenv
dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: "audio-recorder",
  name: "audio-recorder",
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.lspacedev.audiorecorder",
  },
  extra: {
    eas: {
      projectId: "7ecf467c-c60f-4dd7-b9a5-64b65b5ff47e",
    },
    WEB_CLIENT_KEY: process.env.WEB_CLIENT_KEY,
    ANDROID_CLIENT_KEY: process.env.ANDROID_CLIENT_KEY,
  },
});
