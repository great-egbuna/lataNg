import { View } from "react-native";
import React from "react";
import Modal from "react-native-modal";
import { AppContextProps, useApp } from "@/context/AppContext";

interface Props {
  children: React.ReactNode;
}

export default function Overlay({ children }: Props) {
  const { feedbackOpen, setFeedbackOpen } = useApp() as AppContextProps;
  return (
    <Modal
      isVisible={feedbackOpen}
      onBackdropPress={() => setFeedbackOpen(false)}
      backdropOpacity={0.5}
      className={"items-start justify-start flex-row pt-24"}
    >
      {children}
    </Modal>
  );
}
