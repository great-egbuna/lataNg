import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import ImageText from "@/components/ui/ImageText";
import Button from "@/components/general/Button";
import { colors } from "@/colors";
import { images } from "@/constants/images";
import { AppContextProps, useApp } from "@/context/AppContext";
import { Linking } from "react-native";
import ButtonSecondary from "@/components/general/ButtonSecondary";
import { useState } from "react";
import { Alert } from "react-native";
import { chatService } from "@/services/chat.service";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";

export default function SellerContact() {
  const { selectedProduct } = useApp() as AppContextProps;

  return (
    <View className={" px-3 py-6 border border-grey-2 rounded-[10px]"}>
      <ImageText
        title={
          (selectedProduct?.user?.name as string) ||
          selectedProduct?.product?.user?.name
        }
        text={
          (selectedProduct?.user?.phoneNumber as string) ||
          selectedProduct?.product?.user?.phoneNumber
        }
        imgSource={
          (selectedProduct?.user?.avatar as string) ||
          selectedProduct?.product?.user?.avatar
        }
      />

      <SellerCTA />
    </View>
  );
}

const SellerCTA = () => {
  const { selectedProduct } = useApp() as AppContextProps;
  const { user, isLoggedIn } = useAuth() as IAUTH;
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleOpenChat = () => {
    setError("");

    if (!isLoggedIn) {
      setError("Please log in to send messages to sellers");
      return;
    }

    if (user && selectedProduct && user.id === selectedProduct.userId) {
      setError("You cannot send messages to yourself");
      return;
    }

    if (user && user.role === "SELLER") {
      setError("Please login as a buyer to send messages to sellers");
      return;
    }

    setModalVisible(true);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      Alert.alert("Error", "Please enter a message");
      return;
    }

    try {
      setSending(true);

      const res = await chatService.initiateChat({
        message: message.trim(),
        productId: selectedProduct?.id,
        senderId: user?.id,
        receiverId: selectedProduct?.userId,
      });

      if (res instanceof Error) {
        setError(res.message);
        setSending(false);
        return;
      }

      setSending(false);
      setModalVisible(false);
      setMessage("");
      Alert.alert("Success", "Message sent to seller");
    } catch (error: any) {
      setSending(false);
      Alert.alert("Error", error.message || "Failed to send message");
    }
  };

  return (
    <View className="gap-2 mt-6">
      <ButtonSecondary
        customStyles="py-1 bg-purple rounded-[16px]"
        customTextStyles="text-white text-base "
        text={"WhatsApp Seller"}
        onPress={() =>
          Linking.openURL(
            `https://wa.me/+234${selectedProduct?.user?.phoneNumber}`
          ).catch(() => alert("WhatsApp is not installed on this device"))
        }
      />
      <Button
        className="py-1 rounded-2xl bg-white border border-purple"
        text={"Call Seller"}
        onPress={() =>
          Linking.openURL(`tel:${selectedProduct?.user?.phoneNumber}`).catch(
            () => alert("Failed to open dailer")
          )
        }
        purpleText
      />

      <Button
        className="py-1 rounded-2xl bg-white border border-purple"
        buttonTextStyle={"text-purple"}
        text={"Send message to Seller"}
        onPress={handleOpenChat}
        purpleText
      />

      {/* <Button
        customStyle={{
          backgroundColor: colors.white,
          width: "100%",
          borderWidth: 1,
          borderColor: colors.purple,
          borderRadius: 12,
        }}
        buttonTextStyle={{
          fontWeight: 600,
          color: colors.purple,
        }}
        className="py-2"
        text={"Give feedback"}
        onPress={handleOpenChat}
      /> */}

      {error ? <Text className="text-red-500 text-center">{error}</Text> : null}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-4 h-1/2">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold">Message to Seller</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text className="text-purple">Cancel</Text>
              </TouchableOpacity>
            </View>

            <View className="border border-gray-300 rounded-lg p-2 mb-4">
              <TextInput
                multiline
                numberOfLines={5}
                placeholder="Type your message here..."
                value={message}
                onChangeText={setMessage}
                className="min-h-[100px] text-base"
              />
            </View>

            <Button
              buttonTextStyle={"font-semibold"}
              className="py-2 w-full rounded-xl"
              text={sending ? "Sending..." : "Send Message"}
              onPress={handleSendMessage}
              disabled={sending || !message.trim()}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
