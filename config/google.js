import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: Constants.expoConfig?.extra?.WEB_CLIENT_KEY,
    androidId: Constants.expoConfig?.extra?.ANDROID_CLIENT_KEY,
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.file",
    ],
    offlineAccess: true,
  });
};
export const signIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    const token = (await GoogleSignin.getTokens()).accessToken;
    return token;
  } catch (error) {
    switch (error.code) {
      case statusCodes.SIGN_IN_CANCELLED:
        console.error("User Sign In is required");
        break;
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        console.error("Google Play Services are needed");
        break;
    }
    console.log("Error", error.code);
  }
};
