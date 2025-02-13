import { StyleSheet, TextInput, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@/colors";
import Button from "./Button";

interface Props {
  placeholder?: string;
}

export default function Input({ placeholder }: Props) {
  return (
    <View style={styles.containerStyles}>
      <TextInput placeholder={placeholder} style={styles.inputStyles} />

      <Button
        icon={<MaterialIcons name="search" color={colors.white} size={20} />}
        customStyle={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,

          width: 50,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    borderRadius: 6,
    backgroundColor: colors.offWhite,
    flexDirection: "row",
    flex: 1,
  },
  inputStyles: {
    padding: 16,
    flex: 1,
    backgroundColor: colors.offWhite,
  },
});
