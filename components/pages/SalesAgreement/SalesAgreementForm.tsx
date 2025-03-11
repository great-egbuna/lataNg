import { colors } from "@/colors";
import { Octicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function SalesAgreementForm() {
  return (
    <View className="border border-offwhite rounded-lg p-6">
      <View>
        <Text className="font-semibold">Sales Agreement Form</Text>

        <Text>Download and read through the LATA.ng sales agreement form</Text>
      </View>

      <View className="py-8 px-3 border border-grey-4 rounded-[5px] w-[108px] h-[124px] items-center mt-6 mb-[40px]">
        <Octicons name="table" size={50} color={colors.greyFour} />
      </View>

      <TouchableOpacity className="bg-purple w-[126px] px-6 items-center py-[6px] rounded-lg">
        <Text className="text-white font-semibold text-base">Download</Text>
      </TouchableOpacity>
    </View>
  );
}
