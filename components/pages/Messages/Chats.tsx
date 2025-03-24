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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IAUTH } from "@/interfaces/context/auth";
import { useAuth } from "@/context/AuthContext";

export default function ChatUI({
  messages = [],
  isLoading = false,
  onSendMessage,
  productInfo = null,
  sellerInfo = null,
}) {
  const { user } = useAuth() as IAUTH;

  const [inputMessage, setInputMessage] = useState("");
  const flatListRef = useRef(null);

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
          <Text className={`${isUserMessage ? "text-white" : "text-gray-800"}`}>
            {item.message}
          </Text>
          <Text
            className={`text-xs mt-1 ${
              isUserMessage ? "text-purple-100" : "text-gray-500"
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

    onSendMessage(inputMessage);
    setInputMessage("");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Product/Seller Info Header */}
      {(productInfo || sellerInfo) && (
        <View className="p-3 border-b border-gray-300 flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-gray-300 mr-3" />
          <View className="flex-1">
            <Text className="font-bold">
              {productInfo?.name || sellerInfo?.name || "Chat"}
            </Text>
            <Text className="text-gray-600 text-sm">
              {productInfo
                ? `${productInfo.price || ""}`
                : sellerInfo?.email || ""}
            </Text>
          </View>
        </View>
      )}

      {/* Messages List */}
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
        <View className="flex-row items-center p-2 border-t border-gray-300">
          <TextInput
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
            placeholder="Type a message..."
            value={inputMessage}
            onChangeText={setInputMessage}
            multiline
          />
          <TouchableOpacity
            onPress={handleSend}
            className="w-10 h-10 rounded-full bg-purple justify-center items-center"
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
