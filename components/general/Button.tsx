import { colors } from "@/colors";
import { ReactElement } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface Props {
  text?: string;
  icon?: ReactElement;
  customStyle?: Record<string, any>;
  buttonTextStyle?: Record<string, any>;
  className?: string;
  onPress?: () => void;
  disabled?: boolean;
}

export default function Button({
  text,
  icon,
  customStyle,
  buttonTextStyle,
  className,
  onPress,
  disabled,
}: Props) {
  return (
    <Pressable
      style={customStyle}
      className={`bg-purple flex items-center justify-center py-1 px-2 rounded-base, ${className}`}
      onPress={onPress}
      disabled={disabled}
    >
      {text && <Text style={[styles.buttonText, buttonTextStyle]}>{text}</Text>}
      {icon && icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: colors.white,
    fontSize: 12,
  },
});
