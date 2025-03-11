import RegisterComponent from "@/components/pages/Register/RegisterComponent";
import { ScrollView } from "react-native";

export default function Register() {
  return (
    <ScrollView className="h-full bg-white p-6">
      <RegisterComponent />
    </ScrollView>
  );
}
