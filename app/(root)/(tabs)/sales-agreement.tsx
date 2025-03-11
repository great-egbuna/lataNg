import React from "react";

import SalesAgreementComponent from "@/components/pages/SalesAgreement/SalesAgreement";
import { ScrollView } from "react-native";

export default function SalesAgreement() {
  return (
    <ScrollView className="px-3 py-6 h-full bg-white">
      <SalesAgreementComponent />
    </ScrollView>
  );
}
