import { colors } from "@/colors";
import { StyleSheet, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Props {
  text: string;
}

export default function LocationBox({ text }: Props) {
  return (
    <View style={styles.box}>
      <MaterialIcons name="map" />
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
  },
});
