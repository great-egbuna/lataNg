import AppProvider from "@/context/AppContext";
import AuthProvider from "@/context/AuthContext";
import SearchContextProvider from "@/context/SearchContext";
import { Slot } from "expo-router";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import * as SplashScreen from "expo-splash-screen";
import { toastConfig } from "@/components/general/Toast";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AppProvider mounted={mounted}>
      <AuthProvider>
        <SearchContextProvider>
          <Slot />
        </SearchContextProvider>
      </AuthProvider>

      <Toast config={toastConfig} />
    </AppProvider>
  );
}
