import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  PanResponder,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ICategory } from "@/context/AppContext";

interface DropdownInputProps {
  placeholder?: string;
  className?: string;
  btnClassName?: string;
  textClassName?: string;
  iconColor?: string;
  open?: boolean;
  isOpen?: boolean;
  setIsOpen: (val: boolean) => void;
}
export default function FLatlistDropdown({
  placeholder,

  className,
  btnClassName,
  textClassName,
  iconColor,

  setIsOpen,
  isOpen,
}: DropdownInputProps) {
  return (
    <View className={` relative ${className}   `}>
      <TouchableOpacity
        className={`flex-row items-center justify-between border border-grey-5 rounded-lg bg-white px-3  ${btnClassName} relative  `}
        onPress={() => {
          setIsOpen(!isOpen);
        }} // Toggle dropdown
      >
        <Text className={`text-base md:text-lg text-grey-5 ${textClassName}`}>
          {placeholder || "Quick Search"}
        </Text>
        <MaterialIcons
          name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} // Toggle icon based on open/close state
          size={16}
          color={iconColor || "#999999"} // Grey color for the icon
          className="text-grey-5"
        />
      </TouchableOpacity>
    </View>
  );
}

export function Dropdown({
  data,
  onPress,
}: {
  data: ICategory[];
  onPress: (val: any) => void;
}) {
  
  return (
    <View className="bg-white shadow-md w-full">
      {data.map((category, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => onPress(category)}
            className="px-4 py-2 border-0"
          >
            <Text className="text-sm text-grey-8">
              {category?.name || (category as any)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
