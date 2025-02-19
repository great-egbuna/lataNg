import { StyleSheet, TextInput, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@/colors";
import Button from "./Button";

interface Props {
  placeholder?: string;
  customStyles?: Record<string, string | number>;
  customInputStyles?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  showBtn?: boolean;
  value?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

export default function Input({
  placeholder,
  customStyles,
  onChangeText,
  onBlur,
  showBtn = false,
  customInputStyles,
  value,
  multiline,
  numberOfLines,
}: Props) {
  return (
    <View style={[styles.containerStyles, customStyles]}>
      <TextInput
        placeholder={placeholder}
        className={`p-4 flex-1 h-full bg-offwhite rounded-tl-md rounded-bl-md ${customInputStyles}`}
        onChangeText={onChangeText}
        onBlur={onBlur}
        value={value}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />

      {showBtn && (
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    borderRadius: 5,
    flexDirection: "row",
    flex: 1,
  },
});
