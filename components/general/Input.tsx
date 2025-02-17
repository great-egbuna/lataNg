import { StyleSheet, TextInput, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@/colors";
import Button from "./Button";

interface Props {
  placeholder?: string;
  customStyles?: Record<string, string | number>;
  customInputStyles?: string;
}

export default function Input({
  placeholder,
  customStyles,
  customInputStyles,
}: Props) {
  return (
    <View style={[styles.containerStyles, customStyles]}>
      <TextInput placeholder={placeholder} style={styles.inputStyles} />

      <Button
        icon={<MaterialIcons name="search" color={colors.white} size={20} />}
        customStyle={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 5,
          borderTopRightRadius: 5,
          width: 50,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    borderRadius: 5,
    flexDirection: "row",
    flex: 1,
  },
  inputStyles: {
    paddingTop: 17,
    paddingBottom: 14,
    flex: 1,
    height: "100%",
    backgroundColor: colors.offWhite,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
});
