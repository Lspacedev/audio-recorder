import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: "",
    androidId: "",
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
