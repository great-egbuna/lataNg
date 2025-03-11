import { colors } from "@/colors";
import Loader from "@/components/general/Loader";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import { save } from "@/store/storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function LogoutComponent() {
  const router = useRouter();

  const { setIsLoggedIn, setUser } = useAuth() as IAUTH;

  useEffect(() => {
    (async () => {
      try {
        await save("lataPubToken", "");
        await save("lataUser", "");

        setIsLoggedIn(false);
        setUser!(null);
        router.push("/");
      } catch (error) {
        console.log("Error:", error);
      }
    })();
  }, []);

  return (
    <View className="h-full bg-white items-center justify-center gap-2">
      <Loader size="large" color={colors.purple} />

      <Text>Logging out...</Text>
    </View>
  );
}
