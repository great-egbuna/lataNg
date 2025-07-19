import { Text, View } from "react-native";
import SubscriptionCards from "@/components/ui/Cards/SubscriptionCard";
import { AppContextProps, useApp } from "@/context/AppContext";
import { useRouter } from "expo-router";
import { getColor } from "@/components/pages/Subscriptions/Subscriptions";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import Loader from "@/components/general/Loader";

export default function SubscriptionSuggestions() {
  const { selectedPackage, setSelectedPackage } = useApp() as AppContextProps;

  const {
    subscriptionPackages,
    userData,
    loading,
    error,
    refetchSubscriptions,
  } = useSubscriptions();

  const filteredSubscriptionPackages = subscriptionPackages.filter(
    (item) => item.type !== selectedPackage.type
  );

  const router = useRouter();

  if (loading) {
    return (
      <View className="h-full bg-white justify-center items-center">
        <Loader size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="h-full bg-white justify-center items-center p-4">
        <Text className="text-red-500 text-center mb-4">{error}</Text>
      </View>
    );
  }

  return (
    <View className={"gap-4 mt-4"}>
      <Text className={"font-semibold text-base text-grey-8-100 "}>
        Have a different product?
      </Text>

      {filteredSubscriptionPackages.map((item, index) => {
        return (
          <SubscriptionCards
            text={item.name}
            className={getColor(index)}
            key={index}
            onPress={() => {
              router.push("/subscription-details");
              setSelectedPackage(item);
            }}
            image={item?.meta?.image}
          />
        );
      })}
    </View>
  );
}
