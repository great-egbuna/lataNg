import { ScrollView, Text } from "react-native";
import SubscriptionDetailsPageComponent from "@/components/pages/SubscriptionDetails/SubscriptionDetails";

export default function SubscriptionDetails() {
  return (
    <ScrollView className={"h-full bg-white"}>
      <SubscriptionDetailsPageComponent />
    </ScrollView>
  );
}
