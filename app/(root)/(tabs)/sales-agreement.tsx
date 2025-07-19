import React from "react";

import SalesAgreementComponent from "@/components/pages/SalesAgreement/SalesAgreement";
import { ScrollView } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import PromptLogin from "@/components/ui/PromptLogin";
export default function SalesAgreement() {
  const { isLoggedIn, user } = useAuth() as IAUTH;

  if (!isLoggedIn || !user) {
    return <PromptLogin />;
  }
  return (
    <ScrollView className="px-2 py-6 h-full bg-white">
      <SalesAgreementComponent />
    </ScrollView>
  );
}
