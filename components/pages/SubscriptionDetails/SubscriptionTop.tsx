import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Switch,
  Alert,
} from "react-native";
import { AppContextProps, useApp } from "@/context/AppContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@/colors";
import { useSubscriptionPayment } from "@/hooks/usePayment";
import { WebView } from "react-native-webview";
import Loader from "@/components/general/Loader";
import Button from "@/components/general/Button";
import { useWallet } from "@/hooks/useWallet";
import { useSubscriptions } from "@/hooks/useSubscriptions";
export default function SubscriptionDetailsTop() {
  const { selectedPackage } = useApp() as AppContextProps;
  const { wallet } = useWallet();
  const { tabs } = useSubscriptions();
  const { loading, error, paymentData, initiatePayment, resetPaymentData } =
    useSubscriptionPayment({
      onSuccess: (data) => {
        console.log("Payment initiated successfully", data);
      },
      onError: (error) => {
        Alert.alert("Error", error.message || "Failed to process payment");
      },
    });

  const [activePackage, setActivePackage] = useState("Free");
  const [modalVisible, setModalVisible] = useState(false);
  const [useWalletBalance, setUseWalletBalance] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [selectedBenefits, setSelectedBenefits] = useState<any>({});

  const durations = [1, 3, 6, 12];

  useEffect(() => {
    const duration = activePackage === "Free" ? 0 : selectedDuration;

    const search = selectedPackage?.plans?.find((item: Record<string, any>) => {
      return item.duration === duration && item.name === activePackage;
    });

    setSelectedBenefits(search);
  }, [activePackage, selectedDuration]);

  const handlePaymentClick = () => {
    if (activePackage === "Free") {
      return; // Already active, do nothing
    }
    setModalVisible(true);
  };

  const handlePayWithPaystack = async () => {
    if (!selectedBenefits?.id) {
      Alert.alert("Error", "No plan selected");
      return;
    }

    const result = await initiatePayment(
      selectedBenefits.id,
      "paystack",
      useWalletBalance
    );

    if (result && result.credentials?.paystackConfig) {
      const paystackConfig = result.credentials.paystackConfig;

      // Create HTML for Paystack inline payment
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
                ref: '${result.credentials.reference || ""}',
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
      setShowCheckout(true);
      setModalVisible(false);
    }
  };

  const handlePayWithTransfer = async () => {
    if (!selectedBenefits?.id) {
      Alert.alert("Error", "No plan selected");
      return;
    }

    const result = await initiatePayment(
      selectedBenefits.id,
      "transfer",
      useWalletBalance
    );

    if (result && result.credentials) {
      setModalVisible(false);

      // Format the transfer details in the requested format
      Alert.alert(
        "Pay via bank transfer",
        `Bank Name: ${result.credentials.bankName}\n\nAcct Name: ${
          result.credentials.acctName
        }\n\nAcct No: ${result.credentials.acctNumber}\n\nCopy\nPayment ID: ${
          result.credentials.reference
        }\n\nCopy\nAmount: ₦${result.credentials.amountToPay.toLocaleString(
          "en-US",
          { minimumFractionDigits: 0, maximumFractionDigits: 0 }
        )}\n\nDownload Invoice\n*Instruction\nFor mobile transfer use your payment ID as the narration\n\nFor bank deposit use your payment ID as the depositor's name`,
        [{ text: "OK" }]
      );
    }
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.action === "close") {
        setShowCheckout(false);
        resetPaymentData();
      } else if (data.action === "success") {
        // Payment successful
        setShowCheckout(false);
        Alert.alert(
          "Success",
          "Payment successful! Your subscription is now active."
        );
        // You might want to refresh user data or subscription status here
      }
    } catch (error) {
      console.error("Error parsing WebView message:", error);
    }
  };

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
    <View>
      <Text
        className={"font-semibold text-grey-8-100 text-sm"}
      >{`Available plans for ${selectedPackage.name} ads`}</Text>

      <ScrollView
        horizontal={true}
        bounces={false}
        showsHorizontalScrollIndicator={false}
      >
        {tabs?.map((item: Record<string, any>, index: number) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setActivePackage(item.name);
              }}
              className={`${
                item.name === activePackage
                  ? "bg-purple text-white"
                  : "bg-white border border-purple"
              } rounded-xl  flex items-center justify-center py-1.5 px-6 mr-3 mt-4 mb-2`}
            >
              <Text
                className={`${
                  item.name === activePackage ? "text-white" : "text-purple"
                } text-base`}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View className={"border border-grey-2 rounded-[10px] px-3 py-6 gap-4"}>
        {activePackage !== "Free" && (
          <View>
            <Text className="font-semibold text-grey-8 mb-2">
              Subscription Duration
            </Text>

            <View className="flex-row ">
              {durations.map((duration) => (
                <TouchableOpacity
                  key={duration}
                  onPress={() => {
                    setSelectedDuration(duration);
                  }}
                  className={`${
                    duration === selectedDuration
                      ? "bg-purple text-white"
                      : "bg-white border border-purple"
                  } rounded-xl  flex items-center justify-center py-1.5  mr-3 mt-4 mb-2  flex-1`}
                >
                  <Text
                    className={`${
                      duration === selectedDuration
                        ? "text-white"
                        : "text-purple"
                    } text-xs`}
                  >
                    {duration} {duration === 1 ? "month" : "months"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Always show features, for all packages */}
        {selectedBenefits?.features?.map((text: string, index: number) => {
          return <Benefit text={text} key={index} />;
        })}

        {/* Button/price section */}
        <TouchableOpacity
          className={
            "bg-purple py-1.5 flex items-center justify-center rounded-lg relative"
          }
          onPress={handlePaymentClick}
        >
          {activePackage === "Free" ? (
            <Text className={"text-white text-base font-semibold"}>Active</Text>
          ) : selectedBenefits?.discountPercentage ? (
            <>
              <View className="flex-row items-center gap-2">
                <Text className={"text-white text-sm font-normal line-through"}>
                  ₦
                  {selectedBenefits.price.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </Text>
                <Text className={"text-white text-base font-semibold"}>
                  ₦
                  {Math.floor(
                    selectedBenefits.price -
                      (selectedBenefits.price *
                        selectedBenefits.discountPercentage) /
                        100
                  ).toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </Text>
              </View>

              <View
                style={{
                  position: "absolute",
                  bottom: "-100%",
                  right: 0,
                  backgroundColor: "red",
                  borderTopLeftRadius: 6,
                  borderBottomRightRadius: 8,
                  paddingHorizontal: 4,
                  paddingVertical: 2,
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 10, fontWeight: "bold" }}
                >
                  -{selectedBenefits.discountPercentage}% OFF
                </Text>
              </View>
            </>
          ) : (
            <Text className={"text-white text-base font-semibold"}>
              ₦
              {selectedBenefits?.price?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Payment Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold">
                Choose Payment Method
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text className="text-purple">Cancel</Text>
              </TouchableOpacity>
            </View>

            {/* Wallet balance toggle */}
            {wallet && wallet.balance > 0 && (
              <View className="flex-row justify-between items-center mb-4 p-3 bg-purple-2 rounded-lg">
                <View>
                  <Text className="font-medium">Use wallet balance</Text>
                  <Text className="text-sm text-grey-6">
                    Available: ₦{wallet.balance.toLocaleString()}
                  </Text>
                </View>
                <Switch
                  value={useWalletBalance}
                  onValueChange={setUseWalletBalance}
                  trackColor={{ false: colors.greyFour, true: colors.purple }}
                  thumbColor={colors.white}
                />
              </View>
            )}

            {error && (
              <Text className="text-red-500 mb-4">{error.message}</Text>
            )}

            <View className="gap-3">
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
                text={loading ? "Processing..." : "Pay with Card/Bank"}
                onPress={handlePayWithPaystack}
                disabled={loading}
              />

              <Button
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
                className="py-3"
                text={loading ? "Processing..." : "Pay with Bank Transfer"}
                onPress={handlePayWithTransfer}
                disabled={loading}
              />
            </View>

            <View className="mt-4">
              <Text className="text-center text-grey-6 text-sm">
                You'll be subscribing to {selectedPackage?.name} -{" "}
                {selectedBenefits?.name} for {selectedBenefits?.duration}{" "}
                month(s)
              </Text>

              {selectedBenefits?.discountPercentage > 0 && (
                <Text className="text-center text-green-500 text-sm mt-1">
                  {selectedBenefits.discountPercentage}% discount applied
                </Text>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const Benefit = ({ text }: { text: string }) => {
  return (
    <View className={"flex-row gap-[5px] items-center"}>
      <MaterialIcons name={"cancel"} color={"#db3030"} />
      <Text className={"font-normal text-sm text-grey-6"}>{text}</Text>
    </View>
  );
};
