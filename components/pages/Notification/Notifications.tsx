import { FlatList, Text, TouchableOpacity, View } from "react-native";

import NotificationItem from "@/components/pages/Notification/NotificationItem";
import useNotifications from "@/hooks/useNotifications";
import Loader from "@/components/general/Loader";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import { Link } from "expo-router";
import PromptLogin from "@/components/ui/PromptLogin";

export default function NotificationsComponent() {
  const {
    notifications,
    loading,
    error,
    pagination,
    refreshNotifications,
    loadMoreNotifications,
  } = useNotifications();

  const { user, isLoggedIn } = useAuth() as IAUTH;

  console.log("notifications", pagination);

  if (loading) {
    return (
      <View className=" h-full  bg-white justify-center items-center">
        <Loader size="large" />
      </View>
    );
  }

  if (!isLoggedIn || !user) {
    return <PromptLogin />;
  }

  return (
    <View>
      <Header />
      <FlatList
        data={notifications}
        renderItem={({ item }: { item: any }) => (
          <NotificationItem
            message={item.message}
            image={item.data.image}
            createdAt={item.createdAt}
          />
        )}
        className={"px-2 bg-white py-4 border border-grey-2 rounded-[7px] "}
        keyExtractor={(item) => item?.data?.id}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500">No notifications found</Text>
          </View>
        )}
        ListFooterComponent={() => (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500">No more notifications</Text>
          </View>
        )}
        onEndReached={loadMoreNotifications}
        onRefresh={refreshNotifications}
        refreshing={loading}
        onEndReachedThreshold={0.5}
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
