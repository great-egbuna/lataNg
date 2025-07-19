import { Text, TouchableOpacity, View } from "react-native";
import RoundedImage from "@/components/ui/RoundedImage";
import { images } from "@/constants/images";
import { formatRelativeTime, getLocaleString } from "@/utils/utils";
import { useRouter } from "expo-router";
import { notificationService } from "@/services/notification.service";
import { useState } from "react";

interface Props {
  message: string;
  image: string;
  id: string;
  createdAt: string;
  isRead: 0 | 1;
  url: string;
}

export default function NotificationItem({
  message,
  image,
  id,
  createdAt,
  isRead: parentReadState,
  url,
}: Props) {
  const router = useRouter();
  const [internalIsRead, setInternalIsRead] = useState(0);

  const isRead = internalIsRead === 1 ? internalIsRead : parentReadState;
  const navigate = async () => {
    await notificationService.markAsReadSingle(id);
    setInternalIsRead(1);
    if (url === "/settings") router.push("/profile-form");
    if (url === "/subscriptions") router.push("/subscriptions");
  };

  return (
    <TouchableOpacity
      className={"flex-row gap-4 my-2 py-2  "}
      onPress={navigate}
    >
      <RoundedImage
        imgSource={{ uri: image }}
        className={"self-center w-12 h-12"}
      />

      <View className={"gap-0.5 flex-1"}>
        <Text
          className={`font-semibold text-sm ${
            isRead === 0 ? "text-grey-9" : "text-gray-400"
          }`}
        >
          {message}
        </Text>

        <View className="flex-row gap-1">
          <Text
            className={`font-normal text-xs  ${
              isRead === 1 ? "text-gray-400" : "text-grey-8-100"
            } `}
          >
            {formatRelativeTime(createdAt)}
          </Text>

          <Text
            className={` ${isRead === 1 ? "text-gray-400" : "text-grey-8-100"}`}
          >
            |
          </Text>

          <Text
            className={`font-normal text-xs   ${
              isRead === 1 ? "text-gray-400" : "text-grey-8-100"
            }`}
          >
            {getLocaleString(createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
