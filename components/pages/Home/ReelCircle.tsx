import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  imgSource: any;
  name: string;
}

export default function ReelCircle({ imgSource, name }: Props) {
  return (
    <View className="items-center">
      <TouchableOpacity className="w-[70px] h-[70px] rounded-[100px] border border-purple mr-1.5 shadow-[0px_6px_6px_black]">
        <Image
          source={imgSource}
          resizeMode="contain"
          className="w-full h-full rounded-full"
        />
      </TouchableOpacity>

      <Text className="text-xs font-normal mt-2">{name}</Text>
    </View>
  );
}
