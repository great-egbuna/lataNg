import Header from "@/components/ui/Header/Header";
import AppProvider from "@/context/AppContext";
import AuthProvider from "@/context/AuthContext";
import { Slot } from "expo-router";
import { ReactNode, useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import Toast from "react-native-toast-message";

export default function Layout() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AppProvider mounted={mounted}>
      <AuthProvider>
        {/*   <SafeAreaView className="bg-white  h-full relative ">
          <Header />
        </SafeAreaView> */}
        <Slot />
      </AuthProvider>

      <Toast />
    </AppProvider>
  );
}
