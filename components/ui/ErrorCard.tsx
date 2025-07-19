import { Text, View } from "react-native";

interface Props {
  error: string;
}

export default function ErrorCard(props: Props) {
  return (
    <View className="h-full bg-white p-3">
      <View className="bg-white w-full max-w-[350px] px-4 py-12 flex items-center justify-center shadow-md mx-auto my-auto">
        <Text className="text-black text-sm text-semibold">
          Ops! {props.error}
        </Text>
      </View>
    </View>
  );
}
