import { Text, View } from "react-native";
import ButtonSecondary from "../general/ButtonSecondary";
import Button from "../general/Button";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { colors } from "@/colors";

interface Props {
  text?: string;
  buttonText?: string;
  show?: boolean;
  onClose?: () => void;
  onPress?: () => void;
}

export default function CustomToast({
  text,
  buttonText,
  show,
  onClose,
  onPress,
}: Props) {
  if (!show) return null;

  return (
    <View
      className={`left-0 right-0 absolute top-[100%]  z-20 bg-white  py-2.5 px-4 rounded-md flex-row justify-between border border-offwhite duration-500 ease ${
        show ? "visible" : " invisible"
      }`}
    >
      <View className="flex-1 flex-row mt-4">
        <Text className="text-purple font-semibold flex-1">{text}</Text>

        {buttonText && (
          <ButtonSecondary
            text={buttonText}
            customStyles="border border-purple rounded min-w-[70px] px-2 rounded-base"
            onPress={onPress}
            disabled={show ? false : true}
          />
        )}
      </View>

      <Button
        icon={<FontAwesome5 name="times" color={"#000"} size={20} />}
        customStyle={{
          justifyContent: "start",
          paddingBlock: "0",
          alignItems: "end",
          backgroundColor: colors.white,
        }}
        onPress={onClose}
      />
    </View>
  );
}
