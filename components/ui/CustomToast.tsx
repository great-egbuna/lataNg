import { Text, View } from "react-native";
import ButtonSecondary from "../general/ButtonSecondary";
import Button from "../general/Button";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { colors } from "@/colors";
import { useEffect } from "react";

interface Props {
  text?: string;
  buttonText?: string;
  show?: boolean;
  onClose?: () => void;
  onPress?: () => void;
  setShow: (value: boolean) => void;
}

export default function CustomToast({
  text,
  buttonText,
  show,
  onClose,
  onPress,
  setShow,
}: Props) {
  useEffect(() => {
    if (show) {
      const interval = setInterval(() => setShow(false), 5000);

      return () => clearInterval(interval);
    }
  }, [show]);

  if (!show) return null;

  return (
    <View
      className={`left-10 right-10 absolute top-[120%]  z-20 bg-purple  py-2.5 px-4 rounded-md flex-row justify-between border border-offwhite duration-500 ease ${
        show ? "visible" : " invisible"
      }`}
    >
      <View className="flex-1 flex-row mt-4">
        <Text className="text-white font-semibold flex-1">{text}</Text>

        {buttonText && (
          <ButtonSecondary
            text={buttonText}
            customStyles="border border-white  min-w-[70px] px-2  rounded-[3px]"
            customTextStyles="text-white"
            onPress={onPress}
            disabled={show ? false : true}
          />
        )}
      </View>

      {/*   <Button
        icon={<FontAwesome5 name="times" color={"#000"} size={20} />}
        className={"justify-start p-0 items-end bg-white"}
        onPress={onClose}
      /> */}
    </View>
  );
}
