import { GetTokensResponse } from "./../node_modules/@react-native-google-signin/google-signin/src/types";
import { IGOOGLE } from "./../interfaces/auth";
import { $http } from "@/config/$http";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { getErrorMessage } from "@/utils/utils";

class SocialAuthService {
  public async googleSignUp() {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const { accessToken } = await GoogleSignin.getTokens();
        return accessToken;
      }
    } catch (error: any) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            console.log("Google Signup is in progress");

            return new Error("Google Signup is in progress");

          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log("Google play services is not available on your device");
            return new Error(
              "Google play services is not available on your device"
            );
        }
      } else {
        console.log(
          "An Error Occurred During Google Signup",
          JSON.stringify(error)
        );

        return new Error("An Error Occurred During Google Signup");
      }
    }
  }

  public async googleSignIn() {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const { user } = response?.data;

        return user;
      }
    } catch (error: any) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            console.log("Google Signin is in progress");

            return new Error("Google Signin is in progress");

          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log("Google play services is not available on your device");
            return new Error(
              "Google play services is not available on your device"
            );
        }
      } else {
        console.log(
          "An Error Occurred During Google Signin",
          JSON.stringify(error)
        );

        return new Error("An Error Occurred During Google Signin");
      }
    }
  }

  public async googleCallback({ role, accessToken }: IGOOGLE) {
    try {
      const res = await $http.get(
        `/auth/google-callback-token?role=${role}&accessToken=${accessToken}`
      );

      return res?.data;
    } catch (error) {
      console.log("google callback error", error);
      return new Error("Failed to authenticate with google");
    }
  }

  public async googleRedirect({ role }: IGOOGLE) {
    try {
      const res = await $http.get(`/auth/google-redirect?role=${role}`);

      return res?.data;
    } catch (error) {
      console.log("google callback error", error);
      return new Error("Failed to authenticate with google");
    }
  }

  public async googleCallbackNotAlly({
    role,
    accessToken,
    credential,
  }: {
    role: string;
    accessToken?: string;
    credential?: string;
  }) {
    try {
      const params = new URLSearchParams();
      params.append("role", role);

      if (accessToken) {
        params.append("accessToken", accessToken);
      }

      if (credential) {
        params.append("credential", credential);
      }

      const res = await $http.get(
        `/auth/google-callback-token?${params.toString()}`
      );

      return res?.data;
    } catch (error) {
      console.log(
        "google callback not ally error",
        JSON.stringify(error?.response?.data)
      );
      return new Error(getErrorMessage(error?.response?.data));
    }
  }
}

export const socialAuthService = new SocialAuthService();
