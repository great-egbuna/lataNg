import LoginComponent from "@/components/pages/Login/LoginCompnent";
import { ScrollView } from "react-native";

export default function Login() {
  return (
    <ScrollView className="h-full bg-white p-6">
      <LoginComponent />
    </ScrollView>
  );
}
