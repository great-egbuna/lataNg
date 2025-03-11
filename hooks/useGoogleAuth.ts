import { socialAuthService } from "@/services/socialAuth.service";

import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { useEffect, useState } from "react";

const CLIENT_ID =
  "495767714876-37rn3hid4ogboa4m0ib6ks91gfp7jvs5.apps.googleusercontent.com";
const REDIRECT_URI = makeRedirectUri();

export const useGoogleAuth = (role: "SELLER" | "BUYER") => {
  const [userInfo, setUserInfo] = useState(null);

  const discovery = {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    revocationEndpoint: "https://oauth2.googleapis.com/revoke",
  };

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scopes: ["openid", "profile", "email"],
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      sendTokenToBackend(authentication?.accessToken);
    }
  }, [response]);

  const sendTokenToBackend = async (accessToken: string | undefined) => {
    try {
      /*  const res = await fetch(`${BASE_URL}/auth/google/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken, role: "BUYER" }), // 🔥 Include role if needed
      }); */

      const res = socialAuthService.googleCallback({
        role,
        accessToken: accessToken as string,
      });

      console.log("Res", res);
    } catch (error) {
      console.log("Google Auth Error:", error);
    }
  };

  return { userInfo, promptAsync };
};
