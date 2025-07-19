import ButtonSecondary from "@/components/general/ButtonSecondary";
import { Text, View } from "react-native";

export default function ProductMgtButton({
  label,
  className,
  customTextStyle,
  onclick,
}: {
  label: string;
  customTextStyle: string;
  className: string;
  onclick: () => void;
}) {
  return (
    <View className={"border border-grey-2 rounded-[10px] p-4"}>
      <ButtonSecondary
        text={label}
        customStyles={className}
        customTextStyles={customTextStyle}
        onPress={onclick}
      />
    </View>
  );
}
