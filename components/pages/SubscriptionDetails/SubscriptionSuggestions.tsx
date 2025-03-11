import { Text, View } from "react-native";
import { subscriptionPackages } from "@/constants/subscriptionPackages";
import SubscriptionCards from "@/components/ui/Cards/SubscriptionCard";
import { AppContextProps, useApp } from "@/context/AppContext";
import { useRouter } from "expo-router";
import { getColor } from "@/components/pages/Subscriptions/Subscriptions";

export default function SubscriptionSuggestions() {
  const { selectedPackage, setSelectedPackage } = useApp() as AppContextProps;

  const filteredSubscriptionPackages = subscriptionPackages.filter(
    (item) => item.type !== selectedPackage.type,
  );

  const router = useRouter();

  return (
    <View className={"gap-6 mt-4"}>
      <Text className={"font-semibold text-sm text-grey-8-100 self-center"}>
        Have a different product?
      </Text>

      {filteredSubscriptionPackages.map((item, index) => {
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
  );
}
