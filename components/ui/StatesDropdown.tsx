import React from "react";

import { View } from "react-native";
import DropdownInput from "../general/Dropdown";
import { AppContextProps, useApp } from "@/context/AppContext";

interface Props {
  onSelect: (value: any) => void;
  show?: boolean;
}

export default function StatesDropdown({ onSelect, show }: Props) {
  const { states } = useApp() as AppContextProps;

  if (!show) return <></>;
  return (
    <View className={`absolute top-full left-0 right-0 bg-white rounded-md `}>
      <DropdownInput data={states} onSelect={onSelect} open />
    </View>
  );
}
