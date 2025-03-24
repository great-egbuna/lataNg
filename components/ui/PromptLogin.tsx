import { Link } from "expo-router";
import { View, Text } from "react-native";

export default function PromptLogin() {
  return (
    <View className="h-full bg-white items-center justify-center gap-4">
      <Text className="text-grey-9 font-normal text-sm">
        Please Login to see notifications
      </Text>

      <Link
        href={"/login"}
        className="bg-purple w-[140px] rounded-md flex-row items-center justify-center p-2"
      >
        <Text className=" text-white  font-black text-center text-base ">
          Login
        </Text>
      </Link>
    </View>
  );
}
