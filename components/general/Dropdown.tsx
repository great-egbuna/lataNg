import React, { useState } from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ICategory } from "@/context/AppContext";

interface DropdownInputProps {
  placeholder?: string;
  data: string[] | ICategory[] | any;
  onSelect: (value: string | ICategory | any) => void;
  className?: string;
  btnClassName?: string;
  textClassName?: string;
  iconColor?: string;
  open?: boolean;
  scrollViewClassName?: string;
}

export default function DropdownInput({
  placeholder,
  data,
  onSelect,
  className,
  btnClassName,
  textClassName,
  iconColor,
  open,
  scrollViewClassName
}: DropdownInputProps) {
  const [isOpen, setIsOpen] = useState(open || false); // State to track dropdown open/close
  const [selectedValue, setSelectedValue] = useState<string | ICategory | null>(
    null
  ); // State for selected value
  const handleSelect = (value: string | ICategory) => {
    setIsOpen(false);
    onSelect(value);
  };

  return (
    <View className={`absolute z-50  ${className}`}>
      {/* Dropdown Trigger */}
      <TouchableOpacity
        className={`flex-row items-center justify-between border border-grey-5 rounded-lg bg-white px-3 py-2 relative, ${btnClassName} `}
        onPress={() => setIsOpen((prevState) => !prevState)} // Toggle dropdown
      >
        <Text className={`text-sm text-grey-5 ${textClassName}`}>
          {selectedValue?.name ||
            selectedValue ||
            selectedValue?.categoryName ||
            placeholder}
          {/* Show selected value or placeholder */}
        </Text>
        <MaterialIcons
          name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} // Toggle icon based on open/close state
          size={16}
          color={iconColor || "#999999"} // Grey color for the icon
          className="text-grey-5"
        />
      </TouchableOpacity>

      {/* Dropdown Items */}

      <>
        {isOpen && (
          <ScrollView className={`h-[200px] bg-white rounded-md shadow ${scrollViewClassName}`}>
            {data.map((item, index) => (
              <TouchableOpacity
                key={index.toString()}
                onPress={() => {
                  setSelectedValue(item);
                  handleSelect(item);
                }}
                className="px-4 py-2 border-0"
              >
                <Text className="text-sm text-grey-8">
                  {item?.name || item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </>
    </View>
  );
}

function DropdownInputView({
  placeholder,
  data,
  onSelect,
  className,
  btnClassName,
  textClassName,
  iconColor,
  open,
}: DropdownInputProps) {
  const [isOpen, setIsOpen] = useState(open || false); // State to track dropdown open/close
  const [selectedValue, setSelectedValue] = useState<string | ICategory | null>(
    null
  ); // State for selected value
  const handleSelect = (value: string | ICategory) => {
    setIsOpen(false);
    onSelect(value);
  };

  return (
    <View className={`absolute z-50  ${className}`}>
      {/* Dropdown Trigger */}
      <TouchableOpacity
        className={`flex-row items-center justify-between border border-grey-5 rounded-lg bg-white px-3 py-2 relative, ${btnClassName} `}
        onPress={() => setIsOpen((prevState) => !prevState)} // Toggle dropdown
      >
        <Text className={`text-sm text-grey-5 ${textClassName}`}>
          {selectedValue?.name ||
            selectedValue ||
            selectedValue?.categoryName ||
            placeholder}
          {/* Show selected value or placeholder */}
        </Text>
        <MaterialIcons
          name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} // Toggle icon based on open/close state
          size={16}
          color={iconColor || "#999999"} // Grey color for the icon
          className="text-grey-5"
        />
      </TouchableOpacity>

      {/* Dropdown Items */}

      <>
        {isOpen && (
          <View className="bg-white rounded-md shadow">
            {data.map((item, index) => (
              <TouchableOpacity
                key={index.toString()}
                onPress={() => {
                  setSelectedValue(item);
                  handleSelect(item);
                }}
                className="px-4 py-2 border-0"
              >
                <Text className="text-sm text-grey-8">
                  {item?.name || item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </>
    </View>
  );
}

export { DropdownInputView };
