import { StyleSheet, TextInput, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@/colors";
import Button from "./Button";
import Loader from "./Loader";

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
  btnClassName?: any;
  iconSize?: number;
  editable?: boolean;
  selectTextOnFocus?: boolean;
  onPress?: () => void;
  loading?: boolean;
  secureTextEntry?: boolean;
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
  onPress,
  loading,
  secureTextEntry = false,
}: Props) {
  return (
    <View className={`rounded flex-row flex-1 ${customStyles} `}>
      <TextInput
        placeholder={placeholder}
        className={`p-1 flex-1 bg-offwhite rounded-tl-md rounded-bl-md placeholder:text-gray-700/70 placeholder:text-base ${customInputStyles} `}
        onChangeText={onChangeText}
        onBlur={onBlur}
        /*     value={value} */
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
        selectTextOnFocus={selectTextOnFocus}
        defaultValue={value}
        secureTextEntry={secureTextEntry}
      />

      {showBtn && (
        <Button
          icon={
            loading ? (
              <Loader color="white" size="small" />
            ) : (
              <MaterialIcons
                name="search"
                color={iconColor || colors.white}
                size={iconSize || 13}
              />
            )
          }
          className={`rounded-md  bg-white `}
          btnStyle={btnClassName}
          onPress={onPress}
          disabled={loading as boolean}
        />
      )}
    </View>
  );
}
