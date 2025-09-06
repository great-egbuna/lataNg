import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import ImageText from "@/components/ui/ImageText";
import Button from "@/components/general/Button";
import { IProduct } from "@/context/AppContext";
import { Linking } from "react-native";
import ButtonSecondary from "@/components/general/ButtonSecondary";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { chatService } from "@/services/chat.service";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";

interface Prop {
  product: IProduct;
  className?: string;
}

export default function SellerContact(props: Prop) {
  const userDetails = props?.product?.user;

  return (
    <View
      className={`px-3 py-6 border border-grey-2 rounded-[10px] ${props.className}`}
    >
      <ImageText
        id={userDetails?.id}
        title={userDetails?.name}
        text={userDetails.phoneNumber}
        imgSource={userDetails?.avatar}
      />

      <SellerCTA product={props?.product} />
    </View>
  );
}

interface SellerCTAProp {
  product: IProduct;
}

const SellerCTA = (props: SellerCTAProp) => {
  const { user, isLoggedIn } = useAuth() as IAUTH;
  const [modalVisible, setModalVisible] = useState(false);

  const product = props.product;
  const [message, setMessage] = useState(
    `Hi, Is ${product?.name || "this"} still available ?`
  );
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleOpenChat = () => {
    setError("");

    if (!isLoggedIn) {
      setError("Please log in to send messages to sellers");
      return;
    }

    if (user && product && user.id === product.userId) {
      setError("You cannot send messages to yourself");
      return;
    }

    setModalVisible(true);
  };

  const downloadAndShareImage = async (imageUrl: string) => {
    try {
      const filename = imageUrl.split("/").pop();
      const localUri = `${FileSystem.cacheDirectory}${filename}`;

      const downloadResult = await FileSystem.downloadAsync(imageUrl, localUri);

      if (downloadResult.status === 200) {
        return downloadResult.uri;
      }
      return null;
    } catch (error) {
      console.error("Error downloading image:", error);
      return null;
    }
  };

  const handleWhatsAppShare = async () => {
    const imageUrl = product?.meta?.selectedImage;
    const productName = product?.name;
    const productId = product?.id;
    const phone = product?.user?.phoneNumber;
    const formattedPhone = phone?.replace(/^0+/, "").replace(/[^0-9]/g, "");
    const msg = `Hi, I am interested in your product on Lata.ng\n\nProduct Details:\nProduct Name: ${productName}\n\nView product at: https://lata.ng/product/${productId}`;

    // if no productId just send message to seller

    if (!productId) {
      await Linking.openURL(
        `https://wa.me/234${formattedPhone}?text=${encodeURIComponent(
          `Hi there! I got your contact fron Lata.ng`
        )}`
      );
      return;
    }

    if (!formattedPhone) {
      Alert.alert("Error", "No phone number available");
      return;
    }

    try {
      let localImageUri = null;
      if (imageUrl && typeof imageUrl === "string") {
        localImageUri = await downloadAndShareImage(imageUrl);
      }

      const whatsappUrl = localImageUri
        ? `whatsapp://send?phone=234${formattedPhone}&text=${encodeURIComponent(
            msg
          )}&attachment=${encodeURIComponent(localImageUri)}`
        : `whatsapp://send?phone=234${formattedPhone}&text=${encodeURIComponent(
            msg
          )}`;

      const canOpen = await Linking.canOpenURL(whatsappUrl);

      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        const webWhatsappUrl = `https://wa.me/234${formattedPhone}?text=${encodeURIComponent(
          msg
        )}`;
        await Linking.openURL(webWhatsappUrl);
      }
    } catch (error) {
      // Fallback to web WhatsApp
      const webWhatsappUrl = `https://wa.me/234${formattedPhone}?text=${encodeURIComponent(
        msg
      )}`;
      try {
        await Linking.openURL(webWhatsappUrl);
      } catch {
        Alert.alert("Error", "WhatsApp is not installed on this device");
      }
    }
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
        productId: product?.id,
        senderId: user?.id,
        receiverId: product.userId,
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
        onPress={handleWhatsAppShare}
      />
      <Button
        className="py-1 rounded-2xl bg-white border border-purple"
        text={"Call Seller"}
        onPress={() =>
          Linking.openURL(`tel:${product.user.phoneNumber}`).catch(() =>
            alert("Failed to open dailer")
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
