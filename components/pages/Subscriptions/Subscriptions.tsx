import { ScrollView, Text, View } from "react-native";
import SubscriptionCards from "@/components/ui/Cards/SubscriptionCard";
import { subscriptionPackages } from "@/constants/subscriptionPackages";
import { useRouter } from "expo-router";
import { AppContextProps, useApp } from "@/context/AppContext";

export const getColor = (index: number) => {
  switch (index) {
    case 0:
      return "bg-purple-5";

    case 1:
      return "bg-purple";

    default:
      return "bg-purple-8";
  }
};

export default function SubscriptionsComponent() {
  const router = useRouter();
  const { selectedPackage, setSelectedPackage } = useApp() as AppContextProps;

  return (
    <ScrollView className={"py-6  px-3 rounded-[10px]"}>
      <View className={"border border-grey-2 gap-2  px-9"}>
        <View className={"px-10"}>
          <Text className={"text-sm font-semibold text-grey-8 "}>
            Increase your product sales with our subscription packages
          </Text>

          <Text className={"text-tiny text-grey-8 font-normal"}>
            Choose the right category of ads for you products to experience
            massive sales
          </Text>
        </View>

        <View className={"gap-6 mt-4"}>
          {subscriptionPackages.map((item, index) => {
            return (
              <SubscriptionCards
                text={item.type}
                className={getColor(index)}
                key={index}
                onPress={() => {
                  router.push("/subscription-details");
                  setSelectedPackage(item);
                }}
              />
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}
