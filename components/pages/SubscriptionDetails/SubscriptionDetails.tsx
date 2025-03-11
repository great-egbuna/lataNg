import { Text, View } from "react-native";
import SubscriptionDetailsTop from "@/components/pages/SubscriptionDetails/SubscriptionTop";
import SubscriptionSuggestions from "@/components/pages/SubscriptionDetails/SubscriptionSuggestions";

export default function SubscriptionDetailsPageComponent() {
  return (
    <View className={"px-3 py-9"}>
      <SubscriptionDetailsTop />

      <SubscriptionSuggestions />
    </View>
  );
}
