import { Text, View } from "react-native";
import SalesAgreementForm from "./SalesAgreementForm";
import SalesAgreementInput from "./SalesAgreementInput";

export default function SalesAgreementComponent() {
  return (
    <View className="pb-6">
      <SalesAgreementForm />
      <SalesAgreementInput />
    </View>
  );
}
