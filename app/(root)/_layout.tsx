import CustomToast from "@/components/ui/CustomToast";
import Header from "@/components/ui/Header/Header";
import AppProvider from "@/context/AppContext";
import AuthProvider from "@/context/AuthContext";
import SearchContextProvider from "@/context/SearchContext";
import { Slot } from "expo-router";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

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

      <Toast />
    </AppProvider>
  );
}
