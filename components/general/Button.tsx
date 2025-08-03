import { colors } from "@/colors";
import { ReactElement } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface Props {
  text?: string;
  icon?: ReactElement;
  customStyle?: Record<string, any>;
  buttonTextStyle?: string;
  className?: string;
  onPress?: () => void;
  disabled?: boolean;
  purpleText?: boolean;
  btnStyle?: any;
}

export default function Button({
  text,
  icon,
  buttonTextStyle,
  className,
  onPress,
  disabled,
  purpleText = false,
  btnStyle,
}: Props) {
  return (
    <Pressable
      className={`bg-purple flex items-center justify-center py-1 px-2 rounded-base, ${className}`}
      onPress={onPress}
      disabled={disabled}
      style={{ ...btnStyle }}
    >
      {text && (
        <Text
          className={`${
            purpleText ? "text-purple" : "text-white"
          } text-base md:text-lg ${buttonTextStyle}`}
        >
          {text}
        </Text>
      )}
      {icon && icon}
    </Pressable>
  );
}
