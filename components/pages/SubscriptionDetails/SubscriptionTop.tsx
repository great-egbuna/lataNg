import React, { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import {
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
import Loader, { FullScreenLoader } from "@/components/general/Loader";
import Button from "@/components/general/Button";
import { useWallet } from "@/hooks/useWallet";
import ErrorCard from "@/components/ui/ErrorCard";
import PayWithTransferModal from "./PayWithTransferModal";
import { generateInvoiceHTML } from "./invoice";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";

interface TransferDataInterface {
  bankName: string;
  acctName: string;
  reference: string;
  acctNumber: string;
  amountToPay: string;
  clientName: string;
  phoneNumber: string;
  invoiceDate: string;
  items: Array<{
    description: string;
    unitPrice: string;
    VAT: number;
    total: string;
  }>;
}

export default function SubscriptionDetailsTop() {
  const { selectedPackage } = useApp() as AppContextProps;
  const { wallet } = useWallet();
  const { user } = useAuth() as IAUTH;

  const { loading, error, initiatePayment, resetPaymentData } =
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
  const [processingBalPayment, setProcessingBalPayment] = useState(false);
  const [processingTransferPayment, setProcessingTransferPay] = useState(false);
  const [processingPaystackPayment, setProcessingPaystackPay] = useState(false);
  const [transferData, setTransferData] =
    useState<TransferDataInterface | null>(null);

  const durations = [1, 3, 6, 12];
  const isComboSales = selectedPackage?.type === "COMBO";

  const tabs = [
    {
      name: "Free",
    },

    {
      name: "Premium",
    },

    {
      name: "VIP",
    },

    {
      name: "Gold",
    },

    {
      name: "Pro Sales",
    },
  ];

  useEffect(() => {
    const duration = isComboSales
      ? selectedDuration
      : activePackage === "Free"
      ? 0
      : selectedDuration;
    if (isComboSales) {
      const search = selectedPackage?.plans?.find(
        (item: Record<string, any>) => {
          return item.duration === duration;
        }
      );

      console.log("selectedBenefit", search);
      setSelectedBenefits(search);
    } else {
      const search = selectedPackage?.plans?.find(
        (item: Record<string, any>) => {
          return item.duration === duration && item.name === activePackage;
        }
      );

      setSelectedBenefits(search);
    }
  }, [activePackage, selectedDuration]);

  const handlePaymentClick = () => {
    if (activePackage === "Free" && !isComboSales) {
      return; // Already active, do nothing
    }
    setModalVisible(true);
  };

  const handlePayWithPaystack = async () => {
    setProcessingPaystackPay(true);
    if (!selectedBenefits?.id) {
      setProcessingPaystackPay(false);

      Alert.alert("Error", "No plan selected");
      return;
    }

    const result = await initiatePayment(
      selectedBenefits.id,
      "paystack",
      useWalletBalance
    );
    setProcessingPaystackPay(false);

    if (result.credentials.paystackConfig) {
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
    setProcessingTransferPay(true);
    if (!selectedBenefits?.id) {
      Alert.alert("Error", "No plan selected");
      setProcessingTransferPay(false);
      return;
    }

    const result = await initiatePayment(
      selectedBenefits.id,
      "transfer",
      useWalletBalance
    );

    if (result.credentials) {
      setModalVisible(false);
      setProcessingTransferPay(false);

      const discount =
        result.credentials.actualTotalAmount *
        (result.credentials.discountPercentage / 100);

      const unitPriceVat = result.credentials.actualTotalAmount * 0.075;
      const discountVat = result.credentials.discountPercentage * 0.075;
      const items = [
        {
          description: `Subscription to ${result.credentials.planName} on Lata.ng`,
          unitPrice: result.credentials.actualTotalAmount,
          VAT: 7.5,
          total: result.credentials.actualTotalAmount + unitPriceVat - discount,
        },

        {
          description: `Plan Discount`,
          unitPrice: discount,
          VAT: 7.5,
          total: discount + discountVat,
        },
      ];
      setTransferData({
        bankName: result.credentials.bankName,
        acctName: result.credentials.acctName,
        acctNumber: result.credentials.acctNumber,
        reference: result.credentials.reference,
        amountToPay: result.credentials.amountToPay,
        clientName: user?.name,
        phoneNumber: user?.phoneNumber,
        invoiceDate: new Date().toLocaleDateString(),
        items,
      });
    }
  };

  const handlePayWithBalance = async (value: boolean) => {
    setProcessingBalPayment(true);
    if (!selectedBenefits?.id) {
      Alert.alert("Error", "No plan selected");
      setProcessingBalPayment(false);
      setUseWalletBalance(false);
      return;
    }

    const result = await initiatePayment(
      selectedBenefits.id,
      "paystack",
      value
    );

    setUseWalletBalance(false);

    setProcessingBalPayment(false);

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

  const handleToggle = (value: boolean) => {
    const walletBal = wallet?.balance;
    const benefitPrice = selectedBenefits?.price;

    if (!walletBal) return;
    if (walletBal < benefitPrice) return;

    setUseWalletBalance(value);
    handlePayWithBalance(value);
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

  if (error) return <ErrorCard error={error?.message} />;
  if (processingBalPayment)
    return <FullScreenLoader label="Processing payment" />;

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
      <PayWithTransferModal
        isVisible={!!transferData}
        onClose={() => setTransferData(null)}
        onDownloadInvoice={() =>
          generateInvoiceHTML(transferData as TransferDataInterface)
        }
        transferDetails={{
          bankName: transferData?.bankName!,
          acctName: transferData?.acctName!,
          acctNumber: transferData?.acctNumber!,
          reference: transferData?.reference!,
          amountToPay: transferData?.amountToPay!,
        }}
      />
      <Text
        className={"font-semibold text-grey-8-100 text-base mb-2"}
      >{`Available plans for ${selectedPackage.name} ads`}</Text>

      <View className="flex-row gap-1">
        {isComboSales ? (
          <>
            {durations.map((duration) => (
              <TouchableOpacity
                key={duration}
                onPress={() => {
                  setSelectedDuration(duration);
                }}
                className={`${
                  duration === selectedDuration
                    ? "bg-purple-2 text-white"
                    : "bg-white border border-purple"
                } rounded flex items-center justify-center py-0.5  mr-1  mb-2  flex-1`}
              >
                <Text
                  className={`${
                    duration === selectedDuration ? "text-black" : "text-purple"
                  } text-xs`}
                >
                  {duration} {duration === 1 ? "month" : "months"}
                </Text>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
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
                  } rounded-xl  flex items-center justify-center    mt-4 mb-2 px-2`}
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
          </>
        )}
      </View>

      <View className={"border border-grey-2 rounded-[10px] px-2 py-4  gap-4"}>
        {!isComboSales && (
          <>
            {activePackage !== "Free" && (
              <View>
                <View className="flex-row ">
                  {durations.map((duration) => (
                    <TouchableOpacity
                      key={duration}
                      onPress={() => {
                        setSelectedDuration(duration);
                      }}
                      className={`${
                        duration === selectedDuration
                          ? "bg-purple-2 text-white"
                          : "bg-white border border-purple"
                      } rounded flex items-center justify-center py-0.5  mr-3  mb-2  flex-1`}
                    >
                      <Text
                        className={`${
                          duration === selectedDuration
                            ? "text-black"
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
          </>
        )}

        {/* Always show features, for all packages */}
        {selectedBenefits?.features?.map((text: string, index: number) => {
          return (
            <Benefit
              text={text}
              key={index}
              activePackage={activePackage}
              isComboSales={isComboSales}
            />
          );
        })}

        {/* Button/price section */}
        <TouchableOpacity
          className={
            "bg-purple py-1.5 flex items-center justify-center rounded-lg relative"
          }
          onPress={handlePaymentClick}
        >
          {isComboSales ? (
            <>
              <View className="flex-row items-center gap-2">
                <Text className={"text-white text-sm font-normal line-through"}>
                  ₦
                  {selectedBenefits.price?.toLocaleString("en-US", {
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
                  )?.toLocaleString("en-US", {
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
          ) : activePackage === "Free" ? (
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

            <View className="flex-row justify-between items-center mb-4 p-3 bg-purple-2 rounded-lg">
              <View>
                <Text className="font-medium">Use wallet balance</Text>
                <Text className="text-sm text-grey-6">
                  Available: ₦{wallet?.balance.toLocaleString()}
                </Text>
              </View>
              <Switch
                value={useWalletBalance}
                onValueChange={(value) => handleToggle(value)}
                disabled={wallet?.balance! < selectedBenefits?.price}
                trackColor={{ false: colors.greyFour, true: colors.purple }}
                thumbColor={colors.white}
              />
            </View>

            {error && (
              <Text className="text-red-500 mb-4">An Error occurred</Text>
            )}

            <View className="gap-3">
              <Button
                customStyle={{
                  backgroundColor: colors.purple,
                  width: "100%",
                  borderRadius: 12,
                }}
                className="py-1 rounded-lg"
                text={
                  processingPaystackPayment ? "Processing..." : "Pay online"
                }
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
                buttonTextStyle={"font-semibold text-purple"}
                purpleText
                className="py-1 rounded-lg bg-white border border-purple"
                text={
                  processingTransferPayment
                    ? "Processing..."
                    : "Pay with transfer"
                }
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

const Benefit = ({
  text,
  activePackage,
  isComboSales,
}: {
  text: string;
  activePackage: string;
  isComboSales: boolean;
}) => {
  return (
    <View className={"flex-row gap-[5px] items-center"}>
      <MaterialIcons
        name={
          isComboSales
            ? "check-circle-outline"
            : activePackage === "Free"
            ? "cancel"
            : "check-circle-outline"
        }
        color={
          isComboSales
            ? "#5113a1"
            : activePackage === "Free"
            ? "#db3030"
            : "#5113a1"
        }
      />
      <Text className={"font-normal text-sm text-grey-6"}>{text}</Text>
    </View>
  );
};
