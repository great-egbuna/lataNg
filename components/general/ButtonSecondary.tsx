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
  return (
    <TouchableOpacity
      className={` min-w-[140px] min-h-[32px] border border-purple rounded-xl flex flex-row justify-center items-center gap-[6px],  ${customStyles} `}
      onPress={onPress}
      disabled={disabled}
    >
      {iconSrc && <Image source={iconSrc} className="mr-2 flex" />}

      <Text className={`text-purple font-normal ${customTextStyles}`}>
        {text}
      </Text>

      {icon && <MaterialIcon name={icon} size={18} color={colors.purple} />}
    </TouchableOpacity>
  );
}
