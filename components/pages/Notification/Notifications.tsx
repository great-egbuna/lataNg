import { FlatList, Text, TouchableOpacity, View } from "react-native";
import MessageItem from "@/components/pages/Messages/MessageItem";
import Input from "@/components/general/Input";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NotificationItem from "@/components/pages/Notification/NotificationItem";

export default function NotificationsComponent() {
  return (
    <View>
      <Header />
      <FlatList
        data={[1, 2, 3]}
        renderItem={() => <NotificationItem />}
        className={"px-2 bg-white py-4 border border-grey-2 rounded-[7px] "}
        keyExtractor={(_item, index) => index.toString()}
      />
    </View>
  );
}

const Header = () => {
  return (
    <View
      className={
        "justify-between  py-10 flex-row px-[45px] items-center bg-white"
      }
    >
      <Text className={"text-grey-9 font-semibold text-sm"}>Notifications</Text>

      <Text className={"text-purple font-normal text-small"}>
        Mark all as read
      </Text>
    </View>
  );
};
