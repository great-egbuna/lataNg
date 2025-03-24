import UpgradeBuyerComponent from "@/components/pages/UpgradeBuyer/UpgradeBuyer";
import React from "react";
import { ScrollView } from "react-native";

export default function CompleteSignUp() {
  return (
    <ScrollView className="h-full bg-white p-6">
      <UpgradeBuyerComponent />
    </ScrollView>
  );
}
