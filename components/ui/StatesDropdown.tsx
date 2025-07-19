import React, { useEffect } from "react";

import { ScrollView, View } from "react-native";
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
    <>
      <DropdownInput
        data={states}
        onSelect={onSelect}
        className="right-5 top-7 rounded-md shadow  "
        open
        btnClassName="hidden"
      />
    </>
  );
}
