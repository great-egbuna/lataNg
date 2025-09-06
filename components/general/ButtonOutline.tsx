import { Text, TouchableOpacity } from "react-native";

interface Props {
  text: string;
  className?: string;
  textStyle?: string;
  onPress?: () => void;
}

export default function ButtonOutline({
  text,
  textStyle,
  className,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      className={` h-9 border items-center justify-center ${className}`}
      onPress={onPress}
    >
      <Text className={textStyle}>{text}</Text>
    </TouchableOpacity>
  );
}
