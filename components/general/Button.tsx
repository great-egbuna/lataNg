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
}

export default function Button({
  text,
  icon,
  customStyle,
  buttonTextStyle,
  className,
  onPress,
}: Props) {
  return (
    <Pressable
      style={[styles.buttonStyles, customStyle]}
      className={`bg-purple ${className}`}
      onPress={onPress}
    >
      {text && <Text style={[styles.buttonText, buttonTextStyle]}>{text}</Text>}
      {icon && icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonStyles: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingBlock: 4,
    paddingInline: 8,
    borderRadius: 5,
  },

  buttonText: {
    color: colors.white,
    fontSize: 12,
  },
});
