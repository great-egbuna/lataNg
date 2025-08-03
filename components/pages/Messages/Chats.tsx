import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
  Image,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { IAUTH } from "@/interfaces/context/auth";
import { useAuth } from "@/context/AuthContext";
import { io } from "socket.io-client";
import { AppContextProps, useApp } from "@/context/AppContext";
import { useRouter } from "expo-router";
import { formatDateToShortMonthDay } from "@/utils/utils";
export default function ChatUI({
  isLoading = false,
  onSendMessage,
  productInfo = null,
  sellerInfo = null,
}) {
  const { user } = useAuth() as IAUTH;
  const {
    chatMessageObj,
    socket,
    setChatMessageObj,
    messages: listner,
  } = useApp() as AppContextProps;

  const flatListRef = useRef(null);
  const router = useRouter();
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState(chatMessageObj?.messages || []);

  useEffect(() => {
    socket?.on("get-all:chats" + user?.id, () => {
      socket.emit("get-all:chats" + user?.id);
      return;
    });
    const newChatObj = listner?.find((chat) => chat?.id === chatMessageObj?.id);
    setChatMessageObj(newChatObj);
    if (!newChatObj) return;
    setMessages([...newChatObj?.messages]);
  }, [chatMessageObj, listner]);
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderMessage = ({ item }) => {
    const isUserMessage = item.userId === user?.id;

    return (
      <View
        style={{
          alignSelf: isUserMessage ? "flex-end" : "flex-start",
          maxWidth: "80%",
          marginVertical: 4,
        }}
      >
        <View
          className={`rounded-lg p-3 ${
            isUserMessage
              ? "bg-purple rounded-tr-none"
              : "bg-gray-200 rounded-tl-none"
          }`}
        >
          <Text className={`${isUserMessage ? "text-white" : "text-black"}`}>
            {item.message}
          </Text>
          <Text
            className={`text-xs mt-1 ${
              isUserMessage ? "text-purple-2" : "text-black"
            }`}
          >
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  const handleSend = () => {
    if (inputMessage.trim() === "") return;

    socket.emit("send:message" + user?.id, {
      userId: user?.id,
      chatId: chatMessageObj?.id,
      message: inputMessage,
      otherUserId: chatMessageObj?.receiver?.id,
    });

    setInputMessage("");
  };
  const isSender = () => {
    if (chatMessageObj?.sender?.id === user?.id) return true;
    return false;
  };

  return (
    <SafeAreaView className="h-full bg-white">
      {/* Product/Seller Info Header */}

      <View className="px-2 py-2  border-b border-gray-300 flex-row  items-center bg-purple gap-2">
        <Pressable onPress={() => router.push("/message")}>
          <AntDesign name="left" size={20} color={"white"} />
        </Pressable>
        <View className="w-10 h-10 rounded-full bg-gray-300">
          <Image
            className="w-full h-full rounded-full"
            source={{
              uri: isSender()
                ? chatMessageObj?.receiver?.avatar
                : chatMessageObj?.sender?.avatar,
            }}
          />
        </View>
        <View className="flex-1">
          <Text className="font-bold text-base text-white">
            {isSender()
              ? chatMessageObj?.receiver?.name
              : chatMessageObj?.sender?.name}
          </Text>
        </View>
      </View>
      {/* Messages List */}

      <Text className="text-center">
        {formatDateToShortMonthDay(messages[0].createdAt)}
      </Text>
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#8957E5" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => item.id || index.toString()}
          contentContainerStyle={{ padding: 10 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />
      )}

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View className="flex-row items-center p-2 border-t border-gray-300 bg-purple">
          <TextInput
            className="flex-1 bg-gray-100 rounded px-4 py-2 "
            placeholder="Type a message..."
            value={inputMessage}
            onChangeText={setInputMessage}
            multiline
          />
          <TouchableOpacity
            onPress={handleSend}
            className="w-10 h-10 rounded-full bg-purple justify-center items-center"
          >
            <Ionicons name="send" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
