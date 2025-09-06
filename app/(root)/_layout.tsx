import AppProvider from "@/context/AppContext";
import AuthProvider from "@/context/AuthContext";
import SearchContextProvider from "@/context/SearchContext";
import { Slot } from "expo-router";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import * as SplashScreen from "expo-splash-screen";
import { toastConfig } from "@/components/general/Toast";
import ProductContextProvider from "@/context/ProductContext";
import { MessageProvider } from "@/context/MessageContext";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AppProvider mounted={mounted}>
      <AuthProvider>
        <ProductContextProvider>
          <SearchContextProvider>
            <MessageProvider>
              <Slot />
            </MessageProvider>
          </SearchContextProvider>
        </ProductContextProvider>
      </AuthProvider>

      <Toast config={toastConfig} />
    </AppProvider>
  );
}
