import { Pressable, Text, View } from "react-native";
import RoundedImage from "@/components/ui/RoundedImage";
import { images } from "@/constants/images";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import { formatRelativeTime, formatTimeString } from "@/utils/utils";
import { useRouter } from "expo-router";
import { AppContextProps, useApp } from "@/context/AppContext";
import { useState } from "react";

interface IMESSAGE {
  id: string;
  receiver: {
    name: string;
    avatar: string;
  };

  product: {
    name: string;
  };

  sender: {
    id: string;
    name: string;
    avatar: string;
  };

  lastMessage: string;
  lastMessageAt: string;
  messages: any[];
  lastMessageData: {
    id: string;
    userId: string;
    isRead: boolean;
  };
}

interface Prop {
  messageItem: IMESSAGE;
}

export default function MessageItem(prop: Prop) {
  const { user } = useAuth() as IAUTH;
  const { setChatMessageObj, socket } = useApp() as AppContextProps;
  const router = useRouter();

  const [isRead, setIsRead] = useState(false);

  const ownsMessage = (userId: string) => {
    if (userId === user?.id) return true;

    return false;
  };

  const isSender = () => {
    if (prop?.messageItem?.sender?.id === user?.id) return true;
    return false;
  };

  const handlePress = () => {
    const payload = {
      chatId: prop?.messageItem?.id,
      messageId: prop?.messageItem?.lastMessageData?.id,
      messageData: prop?.messageItem?.lastMessageData,
    };

    if (!ownsMessage(prop?.messageItem?.lastMessageData?.userId)) {
      console.log("emitting");
      socket.emit("read:message" + user?.id, payload);
      setIsRead(true);
    }

    setChatMessageObj(prop?.messageItem);

    router.push({
      pathname: "/message/[id]",
      params: { id: prop?.messageItem?.id },
    });
  };

  return (
    <Pressable
      className={"flex-row gap-4 my-2  border-b border-grey-1 "}
      onPress={handlePress}
    >
      <RoundedImage
        imgSource={{
          uri: isSender()
            ? prop?.messageItem?.receiver?.avatar
            : prop?.messageItem?.sender?.avatar,
        }}
        className={"self-center "}
        objClassName={{ width: 50, height: 50 }}
      />

      <View className={"gap-0.5 flex-1"}>
        <View className={"flex-row gap-1 justify-between pr-[43px] "}>
          <Text
            className={`${
              ownsMessage(prop?.messageItem?.lastMessageData?.userId)
                ? "font-normal"
                : prop?.messageItem?.lastMessageData?.isRead || isRead
                ? "font-normal"
                : "font-medium"
            }font-normal text-sm`}
          >
            {isSender()
              ? prop?.messageItem?.receiver?.name
              : prop?.messageItem?.sender?.name}
          </Text>

          <Text className={"font-normal text-xs text-grey-8-100"}>
            {formatRelativeTime(prop?.messageItem?.lastMessageAt)}
          </Text>
        </View>

        <Text
          className={` ${
            ownsMessage(prop?.messageItem?.lastMessageData?.userId)
              ? "font-normal"
              : prop?.messageItem?.lastMessageData?.isRead || isRead
              ? "font-normal"
              : "font-medium"
          } text-base text-grey-11`}
        >
          {prop?.messageItem?.product?.name}
        </Text>

        <Text
          className={`${
            ownsMessage(prop?.messageItem?.lastMessageData?.userId)
              ? "font-normal"
              : prop?.messageItem?.lastMessageData?.isRead || isRead
              ? "font-normal"
              : "font-medium"
          } text-sm text-grey-8-100`}
        >
          {ownsMessage(prop?.messageItem?.lastMessageData?.userId) && "You:"}{" "}
          {prop?.messageItem?.lastMessage}
        </Text>
      </View>
    </Pressable>
  );
}
