import { View, Text, StyleSheet, Pressable } from "react-native";

import Button from "@/components/general/Button";
import Input from "@/components/general/Input";
import LocationBox from "./LocationBox";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";

export default function Header() {
  const { isLoggedIn, user } = useAuth() as IAUTH;

  const router = useRouter();

  const onPress = () => {
    if (isLoggedIn) router.push("/sell");

    if (!isLoggedIn) router.push("/decision");
  };

  return (
    <View style={styles.containerStyle} className="px-2 items-center">
      <Button
        text="SELL"
        customStyle={{ width: 50, flexShrink: 0, padding: 0, height: 35 }}
        onPress={onPress}
      />

      <Input placeholder="Search for products here" showBtn={true} />

      <LocationBox text={user ? user?.address : ""} />
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
    /*    height: 42, */
  },
});
