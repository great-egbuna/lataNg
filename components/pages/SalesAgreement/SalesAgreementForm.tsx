import { colors } from "@/colors";
import { Octicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View, Linking } from "react-native";

export default function SalesAgreementForm() {
  const onPress = () => {
    Linking.openURL(
      "https://res.cloudinary.com/dg9by7oca/image/upload/v1712012185/Lata.ng_Sales_Agreement.pdf"
    );
  };

  return (
    <View className="border border-offwhite rounded-lg p-3">
      <View>
        <Text className="font-semibold text-lg">Sales Agreement Form</Text>

        <Text className="text-base text-gray-500">
          Download and read through the LATA.ng sales agreement form
        </Text>
      </View>

      <View className="py-8 px-3 border border-grey-4 rounded-[5px] w-[108px] h-[124px] items-center mt-6 mb-[40px]">
        <Octicons name="table" size={50} color={colors.greyFour} />
      </View>

      <View className="items-end">
        <TouchableOpacity
          className="bg-purple w-[126px] px-6 items-center py-[6px] rounded-lg"
          onPress={onPress}
        >
          <Text className="text-white font-semibold text-base">Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
