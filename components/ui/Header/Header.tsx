import { View, Text, StyleSheet, Pressable } from "react-native";

import { colors } from "@/colors";
import Button from "@/components/general/Button";
import Input from "@/components/general/Input";
import LocationBox from "./LocationBox";

export default function Header() {
  return (
    <View style={styles.containerStyle} className="px-2 items-center">
      <Button
        text="SELL"
        customStyle={{ width: 50, flexShrink: 0, padding: 0, height: 35 }}
      />

      <Input
        placeholder="Search for products here"
        customStyles={{
          borderColor: colors.offWhite,
          borderRadius: 5,
        }}
       
      />

      <LocationBox text="Ikega" />
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
