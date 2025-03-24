import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import Loader from "@/components/general/Loader";
import { useWallet } from "@/hooks/useWallet";
import { paymentService } from "@/services/payment.service"; // Adjust path as needed
import { colors } from "@/colors";
import Button from "@/components/general/Button";
import { WebView } from "react-native-webview"; // You'll need to install this package

export default function BalanceComponent() {
  const { wallet, loading, error, refreshWallet } = useWallet();
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);

  const handleRecharge = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await paymentService.getWalletCreditCredentials(
        Number(amount)
      );

      if (response instanceof Error) {
        Alert.alert("Error", response.message || "Failed to process payment");
        setIsProcessing(false);
        return;
      }

      // Get credentials from the response
      const { credentials } = response;

      const paystackConfig = credentials.paystackConfig;

      // There are two ways to proceed:

      // Option 1: If using the Paystack Inline JS approach, create a WebView with the HTML
      const checkoutHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Paystack Payment</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <script src="https://js.paystack.co/v1/inline.js"></script>
        </head>
        <body style="padding: 0; margin: 0;">
          <div id="paystackEmbedContainer"></div>
          <script>
            // Close WebView function to communicate with React Native
            const messagePayload = (action, data = {}) => {
              window.ReactNativeWebView.postMessage(JSON.stringify({ action, ...data }));
            };
            
            // Call the PaystackPop.setup function
            const payWithPaystack = () => {
              const handler = PaystackPop.setup({
                key: '${paystackConfig.publicKey}',
                email: '${paystackConfig.email}',
                amount: ${paystackConfig.amount},
                currency: 'NGN',
                ref: '${credentials.reference || ""}',
                metadata: ${JSON.stringify(paystackConfig.metadata || {})},
                channels: ${JSON.stringify(paystackConfig.channels || [])},
                label: '${paystackConfig.label || ""}',
                onClose: function() {
                  messagePayload('close');
                },
                callback: function(response) {
                  messagePayload('success', { reference: response.reference });
                }
              });
              handler.openIframe();
            };
            
            // Run the function when the page loads
            payWithPaystack();
          </script>
        </body>
        </html>
      `;

      setCheckoutUrl(
        `data:text/html;charset=utf-8,${encodeURIComponent(checkoutHtml)}`
      );

      // Show the checkout WebView
      setShowCheckout(true);
      setModalVisible(false);
    } catch (err) {
      Alert.alert("Error", "An unexpected error occurred");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.action === "close") {
        setShowCheckout(false);
      } else if (data.action === "success") {
        // Payment successful
        setShowCheckout(false);
        Alert.alert("Success", "Payment successful");
        refreshWallet();
      }
    } catch (error) {
      console.error("Error parsing WebView message:", error);
    }
  };

  if (loading) {
    return (
      <View className={"h-full items-center justify-center bg-white"}>
        <Loader />
      </View>
    );
  }

  if (error) {
    return (
      <View className={"h-full items-center justify-center bg-white"}>
        <Text className={"text-red-500"}>{error}</Text>
      </View>
    );
  }

  if (showCheckout) {
    return (
      <View className="h-full bg-white">
        <WebView
          source={{ uri: checkoutUrl }}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View className="absolute inset-0 flex items-center justify-center bg-white">
              <Loader />
            </View>
          )}
        />
      </View>
    );
  }

  return (
    <View className={"border border-grey-2 rounded-[10px] gap-6 p-6 h-full"}>
      <View className={"gap-2"}>
        <Text className={"font-semibold text-grey-9 text-sm"}>My Balance</Text>
        <Text className={"font-normal text-grey-8-100 text-small"}>
          You can use your balance to pay for subscription packages
        </Text>
      </View>

      <View
        className={
          "bg-purple-2 w-[114px] h-[85px] rounded-[5px] justify-center gap-3 px-6"
        }
      >
        <Text className={"font-normal text-tiny text-grey-8-100"}>
          Available balance
        </Text>
        <Text className={"font-semibold text-grey-10 text-base"}>
          #{wallet?.balance}
        </Text>
      </View>

      <TouchableOpacity
        className={
          "bg-purple w-[174px] h-[32px] items-center justify-center rounded-lg"
        }
        onPress={() => setModalVisible(true)}
      >
        <Text className={"text-white font-semibold text-base"}>Recharge</Text>
      </TouchableOpacity>

      {/* Recharge Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold">Recharge Wallet</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text className="text-purple">Cancel</Text>
              </TouchableOpacity>
            </View>

            <Text className="mb-2">Enter Amount</Text>
            <View className="border border-gray-300 rounded-lg p-2 mb-4">
              <TextInput
                placeholder="Enter amount to recharge"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                className="text-base"
              />
            </View>

            <Button
              customStyle={{
                backgroundColor: colors.purple,
                width: "100%",
                borderRadius: 12,
              }}
              buttonTextStyle={{
                fontWeight: 600,
                color: colors.white,
              }}
              className="py-3"
              text={isProcessing ? "Processing..." : "Proceed to Payment"}
              onPress={handleRecharge}
              disabled={isProcessing || !amount.trim()}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
