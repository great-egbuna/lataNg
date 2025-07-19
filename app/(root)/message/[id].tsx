import ChatUI from "@/components/pages/Messages/Chats";
import { useApp } from "@/context/AppContext";
import { AppContextProps } from "@/context/AppContext";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function MessageScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <ChatUI
        onSendMessage={() => {}}
        isLoading={false}
        productInfo={null}
        sellerInfo={null}
      />
    </View>
  );
}
