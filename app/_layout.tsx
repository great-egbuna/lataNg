import React, { useEffect } from "react";
import { Stack } from "expo-router";
import "./globals.css";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function RootLayout() {
  useEffect(() => {
    GoogleSignin.configure({
      iosClientId:
        "495767714876-sp2sl0dbiplcvnh37284ro8lpadnrcb5.apps.googleusercontent.com",
      webClientId:
        "495767714876-37rn3hid4ogboa4m0ib6ks91gfp7jvs5.apps.googleusercontent.com",
      profileImageSize: 150,
    });
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
