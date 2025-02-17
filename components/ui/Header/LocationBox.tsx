import { colors } from "@/colors";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
  text: string;
}

export default function LocationBox({ text }: Props) {
  return (
    <View style={styles.box}>
      <Ionicons name="location-outline" />
      <Text
        style={{
          fontSize: 8,
        }}
      >
        {text}
      </Text>
    </View>
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
