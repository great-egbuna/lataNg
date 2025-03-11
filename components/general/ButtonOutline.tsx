import { Text, TouchableOpacity } from "react-native";

interface Props {
  text: string;
  className?: string;
  textStyle?: string;
}

export default function ButtonOutline({ text, textStyle, className }: Props) {
  return (
    <TouchableOpacity
      className={`w-[83px] h-9 border rounded-[10px] items-center justify-center ${className}`}
    >
      <Text className={textStyle}>{text}</Text>
    </TouchableOpacity>
  );
}
