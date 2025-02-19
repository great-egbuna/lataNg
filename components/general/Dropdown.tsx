import React, { useState } from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface DropdownInputProps {
  placeholder: string;
  data: string[];
  onSelect: (value: string) => void;
  className?: string;
}

export default function DropdownInput({
  placeholder,
  data,
  onSelect,
  className,
}: DropdownInputProps) {
  const [isOpen, setIsOpen] = useState(false); // State to track dropdown open/close
  const [selectedValue, setSelectedValue] = useState<string | null>(null); // State for selected value

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
    onSelect(value);
  };

  return (
    <View className={`flex-1 relative ${className}  `}>
      {/* Dropdown Trigger */}
      <TouchableOpacity
        className="flex-row items-center justify-between border border-grey-5 rounded-lg bg-white px-3 py-3"
        onPress={() => setIsOpen((prevState) => !prevState)} // Toggle dropdown
      >
        <Text className="text-sm text-grey-5">
          {selectedValue || placeholder}{" "}
          {/* Show selected value or placeholder */}
        </Text>
        <MaterialIcons
          name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} // Toggle icon based on open/close state
          size={16}
          color={"#999999"} // Grey color for the icon
          className="text-grey-5"
        />
      </TouchableOpacity>

      {/* Dropdown Items */}
      {isOpen && (
        <View className="absolute top-full left-0 right-0  rounded-lg border border-grey-5 bg-white shadow-lg max-h-40 z-10 mt-1">
          <ScrollView>
            {data.map((item, index) => (
              <TouchableOpacity
                key={index.toString()}
                onPress={() => handleSelect(item)}
                className="px-4 py-2 border-0"
              >
                <Text className="text-sm text-grey-8">{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
