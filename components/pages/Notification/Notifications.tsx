import { FlatList, Text, TouchableOpacity, View } from "react-native";

import NotificationItem from "@/components/pages/Notification/NotificationItem";
import useNotifications from "@/hooks/useNotifications";
import Loader from "@/components/general/Loader";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import PromptLogin from "@/components/ui/PromptLogin";
import { notificationService } from "@/services/notification.service";
import { useState } from "react";
import ErrorCard from "@/components/ui/ErrorCard";

export default function NotificationsComponent() {
  const {
    notifications,
    loading,
    error,
    refreshNotifications,
    loadMoreNotifications,
  } = useNotifications();

  const { user, isLoggedIn } = useAuth() as IAUTH;

  const [isRead, setIsRead] = useState(0);

  //console.log("notifications", notifications[0]?.id);

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

  if (error) return <ErrorCard error={error} />;

  return (
    <View>
      <Header setIsRead={setIsRead} isRead={isRead} />
      <FlatList
        data={notifications}
        renderItem={({ item }: { item: any }) => (
          <NotificationItem
            id={item?.id}
            message={item.message}
            image={item.data.image}
            createdAt={item.createdAt}
            isRead={isRead === 1 ? isRead : item?.isRead}
            url={item?.data?.url}
          />
        )}
        className={"px-2 bg-white   rounded-[7px] min-h-full "}
        keyExtractor={(item, index) => index?.toString()}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-base">
              No notifications found
            </Text>
          </View>
        )}
        ListFooterComponent={() => (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-base">
              No more notifications
            </Text>
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

const Header = ({
  setIsRead,
  isRead,
}: {
  setIsRead: (value: number) => void;
  isRead: number;
}) => {
  const markAsRead = async () => {
    const response = await notificationService.markAsRead();
    if (response instanceof Error) return;
    setIsRead(1);
  };

  return (
    <View className={"justify-between  py-3 flex-row  items-center bg-white"}>
      <Text className={"text-grey-9 font-medium text-base md:text-lg"}>
        Notifications
      </Text>
      <TouchableOpacity onPress={markAsRead} disabled={isRead === 1}>
        <Text
          className={`${
            isRead === 1 ? "opacity-50" : ""
          } text-purple font-medium text-base md:text-lg text-base`}
        >
          Mark all as read
        </Text>
      </TouchableOpacity>
    </View>
  );
};
