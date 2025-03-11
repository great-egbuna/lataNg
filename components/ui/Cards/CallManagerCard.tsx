import { Text, TouchableOpacity, View } from "react-native";

export default function CallManagerCard() {
  return (
    <View className=" border rounded-lg border-grey-2 py-6 px-9 gap-6">
      <View>
        <Text className="font-semibold text-sm text-grey-9">Call Manager</Text>
        <Text className="font-normal text-small text-grey-9">
          You can call the LATA.ng manager on the number below
        </Text>
      </View>

      <TouchableOpacity className="border rounded-lg border-purple flex items-center justify-center">
        <Text className="font-semibold text-base text-purple">09069394365</Text>
      </TouchableOpacity>
    </View>
  );
}
