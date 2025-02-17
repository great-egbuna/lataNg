import { Text, TouchableOpacity } from "react-native";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { colors } from "@/colors";

interface Props {
  text: string;
  onPress?: () => void;
  icon?: any;
  customStyles?: string;
  customTextStyles?: string;
}

export default function ButtonSecondary({
  text,
  icon,
  customStyles,
  customTextStyles,
}: Props) {
  return (
    <TouchableOpacity
      className={`w-[140px] h-[32px] border border-purple rounded-xl flex flex-row justify-center items-center gap-[6px], ${customStyles} `}
    >
      <Text className={`text-purple font-normal ${customTextStyles}`}>
        {text}
      </Text>

      {icon && <MaterialIcon name={icon} size={18} color={colors.purple} />}
    </TouchableOpacity>
  );
}
