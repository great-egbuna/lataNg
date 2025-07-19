import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { showToast } from "@/components/general/Toast";
import Loader from "@/components/general/Loader";
import { useMessageLata } from "@/hooks/useMessageLata";

export default function SalesAgreementInput() {
  const [message, setMessage] = useState("");
  const { sendMessage, loading, error } = useMessageLata();

  const handleSendMessage = async () => {
    if (!message.trim()) {
      showToast({
        type: "error",
        text1: "Error",
        text2: "Please enter a message",
      });
      return;
    }

    const result = await sendMessage(message);

    if (result) {
      showToast({
        type: "success",
        text1: "Success",
        text2: "Message sent successfully",
      });
      setMessage("");
    } else {
      showToast({
        type: "error",
        text1: "Error",
        text2: error || "Failed to send message",
      });
    }
  };

  return (
    <View className="border border-offwhite rounded-lg p-3 mt-4">
      <View className="gap-1">
        <Text className="font-semibold text-base">Message LATA.ng</Text>
        <Text className="text-sm text-gray-500">
          You can send the LATA.ng team a direct message from here.
        </Text>

        <Text className="text-sm text-gray-500">
          If you have made a transfer, please include the payment ID, amount and
          date of trnasfer in your message
        </Text>
      </View>

      <TextInput
        className="h-[150px] border border-grey-5 w-full max-w-[400px] rounded mt-6 mb-[40px] p-4"
        placeholder="Write message"
        value={message}
        onChangeText={setMessage}
        multiline={true}
        textAlignVertical="top"
      />
      <View className="items-end">
        <TouchableOpacity
          className="bg-purple w-[162px] px-6 items-center py-[6px] rounded-lg"
          onPress={handleSendMessage}
          disabled={loading || !message}
        >
          <Text className="text-white font-semibold text-base">
            {loading ? <Loader size="small" color="white" /> : "Send message"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
