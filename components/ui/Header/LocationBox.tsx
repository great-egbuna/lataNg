import { colors } from "@/colors";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
  text: string;
  onPress?: () => void;
}

export default function LocationBox({ text, onPress }: Props) {
  return (
    <Pressable style={styles.box} onPress={onPress}>
      <Ionicons name="location-outline" />
      <Text
        style={{
          fontSize: 8,
        }}
      >
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 50,
    backgroundColor: colors.offWhite,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    padding: 10,
    borderRadius: 5,
    height: "100%",
  },
});
