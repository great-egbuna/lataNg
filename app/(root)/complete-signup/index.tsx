import CompleteSignUpComponent from "@/components/pages/CompleteSignUp/CompleteSignup";
import React from "react";
import { ScrollView } from "react-native";

export default function CompleteSignUp() {
  return (
    <ScrollView className="h-full bg-white p-6">
      <CompleteSignUpComponent />
    </ScrollView>
  );
}
