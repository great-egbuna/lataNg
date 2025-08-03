import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
} from "react-native";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { colors } from "@/colors";
import { ReactNode } from "react";

interface Props {
  text: string | ReactNode;
  onPress?: () => void;
  icon?: any;
  customStyles?: string;
  customTextStyles?: string;
  iconSrc?: ImageSourcePropType;
  disabled?: boolean;
}

export default function ButtonSecondary({
  text,
  icon,
  customStyles,
  customTextStyles,
  onPress,
  iconSrc,
  disabled,
}: Props) {
  const defaultClass =
    "min-w-[140px] min-h-[32px] border border-purple  flex flex-row justify-center items-center gap-[6px] rounded-xl";

  const mergedClass = `${defaultClass} ${customStyles}`;

  const textClass = `text-purple font-normal ${customTextStyles}`;

  return (
    <TouchableOpacity
      className={mergedClass}
      onPress={onPress}
      disabled={disabled}
    >
      {iconSrc && <Image source={iconSrc} className="mr-2 flex" />}

      <Text className={`${textClass} text-base md:text-lg`}>{text}</Text>

      {icon && <MaterialIcon name={icon} size={18} color={colors.purple} />}
    </TouchableOpacity>
  );
}
