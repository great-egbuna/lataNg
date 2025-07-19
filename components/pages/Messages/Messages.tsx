import { FlatList, Text, TouchableOpacity, View } from "react-native";
import MessageItem from "@/components/pages/Messages/MessageItem";
import Input from "@/components/general/Input";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getValueFor } from "@/store/storage";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import { FullScreenLoader } from "@/components/general/Loader";
import { colors } from "@/colors";
import { useApp } from "@/context/AppContext";
import { AppContextProps } from "@/context/AppContext";

export default function Messages() {
  const { setSocket, setChatMessageObj, messages, setMessages } =
    useApp() as AppContextProps;
  const { user } = useAuth() as IAUTH;
  const [loading, setLoading] = useState(true);

  const SOCKET_URL = "https://lata-chat.azurewebsites.net";

  useEffect(() => {
    (async () => {
      const token = await getValueFor("lataAuthToken");
      try {
        const socketInstance = io(SOCKET_URL, {
          transports: ["websocket"],
          autoConnect: true,
          auth: {
            token: token,
          },
        });

        setSocket(socketInstance);

        socketInstance.on("connect", () => {
          socketInstance.emit(`get-all:chats${user?.id}`);
        });

        socketInstance.on(`receive-all:chats${user?.id}`, (res) => {
          console.log("Received all chat");
          setMessages(res);
          setLoading(false);
        });

        socketInstance.on("connect_error", (err) => console.log("error", err));
        socketInstance.on("connect_timeout", () => console.log("error"));
        return () => {
          socketInstance?.disconnect();
        };
      } catch (error) {
        console.log("socket error", error);
      }
    })();
  }, []);

  if (loading) return <FullScreenLoader />;

  return (
    <FlatList
      data={messages}
      renderItem={({ item }) => <MessageItem messageItem={item} />}
      className={"h-full px-2 bg-white py-4"}
      ListHeaderComponent={<Header />}
      ListHeaderComponentClassName="mb-4"
    />
  );
}

const Header = () => {
  return (
    <View className={"gap-4 "}>
      <View
        className={
          "bg-purple rounded-[5px] px-2 py-2 flex-row items-center justify-between"
        }
      >
        <Text className={"text-white font-semibold text-sm"}>My Messages</Text>
      </View>

      <Input
        placeholder={"Search messages "}
        customStyles={"bg-offwhite rounded-[10px]  "}
        customInputStyles=""
        btnClassName={{ backgroundColor: colors.offWhite }}
        showBtn={true}
        iconSize={16}
        iconColor={"#787878"}
      />
    </View>
  );
};
