import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

interface PayWithTransferModalProps {
  isVisible: boolean;
  onClose: () => void;
  onDownloadInvoice: () => void;
  transferDetails: {
    bankName: string;
    acctName: string;
    acctNumber: string;
    reference: string;
    amountToPay: string;
  };
}

export default function PayWithTransferModal({
  isVisible,
  onClose,
  onDownloadInvoice,
  transferDetails,
}: PayWithTransferModalProps) {
  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  if (!isVisible) return null;
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      useNativeDriver
      style={styles.modal}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Pay via bank transfer</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Bank Name:</Text>
            <Text style={styles.value}>{transferDetails.bankName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Acct Name:</Text>
            <Text style={styles.value}>{transferDetails.acctName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Acct No:</Text>
            <View style={styles.valueWithCopy}>
              <Text style={styles.value}>{transferDetails.acctNumber}</Text>
              <Pressable onPress={() => handleCopy(transferDetails.acctNumber)}>
                <View style={styles.copyButton}>
                  <Ionicons name="copy-outline" size={20} color="#666" />
                  <Text style={styles.copyText}>Copy</Text>
                </View>
              </Pressable>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Payment ID:</Text>
            <View style={styles.valueWithCopy}>
              <Text style={styles.value}>{transferDetails.reference}</Text>
              <Pressable onPress={() => handleCopy(transferDetails.reference)}>
                <View style={styles.copyButton}>
                  <Ionicons name="copy-outline" size={20} color="#666" />
                  <Text style={styles.copyText}>Copy</Text>
                </View>
              </Pressable>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Amount:</Text>
            <Text style={styles.value}>
              ₦{transferDetails.amountToPay.toLocaleString()}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.downloadButton}
            onPress={onDownloadInvoice}
          >
            <Text style={styles.downloadButtonText}>Download Invoice</Text>
          </TouchableOpacity>

          <View style={styles.instructionContainer}>
            <Text style={styles.instructionTitle}>*Instruction</Text>
            <Text style={styles.instructionText}>
              For mobile transfer use your payment ID as the narration
            </Text>
            <Text style={styles.instructionText}>
              For bank deposit use your payment ID as the depositor's name
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    width: "90%",
    borderRadius: 10,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  closeButton: {
    padding: 5,
  },
  content: {
    gap: 15,
  },
  detailRow: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  value: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  valueWithCopy: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    padding: 5,
  },
  copyText: {
    color: "#666",
    fontSize: 14,
  },
  downloadButton: {
    backgroundColor: "#5113a1",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
  },
  downloadButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  instructionContainer: {
    gap: 8,
  },
  instructionTitle: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
  },
});
