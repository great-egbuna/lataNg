import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import ImageText from "@/components/ui/ImageText";
import Button from "@/components/general/Button";
import { AppContextProps, useApp } from "@/context/AppContext";
import { Linking } from "react-native";
import ButtonSecondary from "@/components/general/ButtonSecondary";
import { useState } from "react";
import { Alert } from "react-native";
import { chatService } from "@/services/chat.service";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";

interface Prop {
  name?: string;
  phoneNumber?: string;
  avatar?: string;
  productId?: string;
  userId?: string;
}

export default function SellerContact(props: Prop) {
  const { selectedProduct } = useApp() as AppContextProps;

  return (
    <View className={" px-3 py-6 border border-grey-2 rounded-[10px]"}>
      <ImageText
        id={selectedProduct?.userId}
        title={
          (props?.name as string) ||
          selectedProduct?.user?.name ||
          selectedProduct?.product?.user?.name
        }
        text={
          (props.phoneNumber as string) ||
          selectedProduct?.user?.phoneNumber ||
          selectedProduct?.product?.user?.phoneNumber
        }
        imgSource={
          (props?.avatar as string) ||
          selectedProduct?.product?.user?.avatar ||
          selectedProduct?.user?.avatar
        }
      />

      <SellerCTA
        phoneNumber={props.phoneNumber}
        productId={props.productId}
        userId={props.userId}
      />
    </View>
  );
}

interface SellerCTAProp {
  phoneNumber?: string;
  productId?: string;
  userId?: string;
}

const SellerCTA = (props: SellerCTAProp) => {
  const { selectedProduct } = useApp() as AppContextProps;
  const { user, isLoggedIn } = useAuth() as IAUTH;
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState(
    `Hi, Is ${selectedProduct?.name} still available ?`
  );
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleOpenChat = () => {
    setError("");

    if (!isLoggedIn) {
      setError("Please log in to send messages to sellers");
      return;
    }

    if (
      user &&
      selectedProduct &&
      user.id === (props?.userId || selectedProduct.userId)
    ) {
      setError("You cannot send messages to yourself");
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
        productId: props?.productId || selectedProduct?.id,
        senderId: user?.id,
        receiverId: props.userId || selectedProduct?.userId,
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

  const phone = props?.phoneNumber || selectedProduct?.user?.phoneNumber;
  const productName = selectedProduct?.name;
  const msg = `Hi, I am interested in ${productName} on Lata.ng`;
  const url = `https://wa.me/234${phone}?text=${encodeURIComponent(msg)}`;

  return (
    <View className="gap-2 mt-6">
      <ButtonSecondary
        customStyles="py-1 bg-purple rounded-[16px]"
        customTextStyles="text-white text-base "
        text={"WhatsApp Seller"}
        onPress={() =>
          Linking.openURL(url).catch(() =>
            alert("WhatsApp is not installed on this device")
          )
        }
      />
      <Button
        className="py-1 rounded-2xl bg-white border border-purple"
        text={"Call Seller"}
        onPress={() =>
          Linking.openURL(
            `tel:${props?.phoneNumber || selectedProduct?.user?.phoneNumber}`
          ).catch(() => alert("Failed to open dailer"))
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
