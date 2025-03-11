import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SalesAgreementInput() {
  return (
    <View className="border border-offwhite rounded-lg  p-6 mt-6">
      <View>
        <Text className="font-semibold">Sales Agreement Form</Text>

        <Text>Download and read through the LATA.ng sales agreement form</Text>
      </View>

      <TextInput
        className="h-[150px] border border-grey-5 w-full max-w-[280px] rounded  mt-6 mb-[40px] p-4"
        placeholder="Write message"
      />

      <TouchableOpacity className="bg-purple w-[162px] px-6 items-center py-[6px] rounded-lg">
        <Text className="text-white font-semibold text-base">Send message</Text>
      </TouchableOpacity>
    </View>
  );
}
