import { StyleSheet, TextInput, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@/colors";
import Button from "./Button";

interface Props {
  placeholder?: string;
  customStyles?: string;
  customInputStyles?: string;
  onChangeText?: (text: string) => void;
  onBlur?: (text: any) => void;
  showBtn?: boolean;
  value?: string;
  multiline?: boolean;
  numberOfLines?: number;
  iconColor?: string;
  btnClassName?: string;
  iconSize?: number;
  editable?: boolean;
  selectTextOnFocus?: boolean;
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
  iconColor,
  btnClassName,
  iconSize,
  editable = true,
  selectTextOnFocus = true,
}: Props) {
  return (
    <View className={`rounded flex-row flex-1 ${customStyles}`}>
      <TextInput
        placeholder={placeholder}
        className={`p-4 flex-1 h-full bg-offwhite rounded-tl-md rounded-bl-md ${customInputStyles}`}
        onChangeText={onChangeText}
        onBlur={onBlur}
        value={value}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
        selectTextOnFocus={selectTextOnFocus}
      />

      {showBtn && (
        <Button
          icon={
            <MaterialIcons
              name="search"
              color={iconColor || colors.white}
              size={iconSize || 20}
            />
          }
          customStyle={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 5,
            borderTopRightRadius: 5,
            width: 50,
          }}
          className={btnClassName}
        />
      )}
    </View>
  );
}
