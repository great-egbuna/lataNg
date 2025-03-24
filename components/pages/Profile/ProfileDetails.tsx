import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Input from "@/components/general/Input";
import { IAUTH } from "@/interfaces/context/auth";
import { useAuth } from "@/context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { useProfileUpdate } from "@/hooks/useUser";

interface ProfileDetailsProps {
  handleChange: (field: string) => (text: string) => void;
  handleBlur: (field: string) => void;
  setFieldValue: (field: string, value: any) => void;
  values?: any;
}

const profileDetailsFields = [
  {
    name: "name",
    label: "Name",
    placeholder: "Enter your name",
    type: "text",
  },

  {
    name: "phoneNumber",
    label: "Phone Number",
    placeholder: "Enter your phone number",
    type: "text",
  },
  {
    name: "address",
    label: "Address",
    placeholder: "Enter your address",
    type: "text",
  },
  {
    name: "aboutBusiness",
    label: "About Business",
    placeholder: "Tell us about your business",
    type: "textarea",
  },
];

export default function ProfileDetails({
  handleChange,
  handleBlur,
  setFieldValue,
  values = {},
}: ProfileDetailsProps) {
  const { user } = useAuth() as IAUTH;
  const { error } = useProfileUpdate();

  const [profileImage, setProfileImage] = useState<any | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(user?.avatar);
  const [uploading, setUploading] = useState(false);
  const [fieldValues, setFieldValues] = useState({
    name: user?.name || "",
    address: user?.address || "",
    aboutBusiness: user?.aboutBusiness || "",
    phoneNumber: user?.phoneNumber || "",
  });

  useEffect(() => {
    if (user && setFieldValue) {
      setFieldValue("name", user.name || "");
      setFieldValue("address", user.address || "");
      setFieldValue("aboutBusiness", user.aboutBusiness || "");
      setFieldValue("phoneNumber", user.phoneNumber || "");
    }
  }, [user, setFieldValue]);
  const handleImageUpload = async () => {
    setUploading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0]);
      setImagePreview(result.assets[0].uri);
      setUploading(false);
      setFieldValue("file", {
        uri: result.assets[0].uri,
        name: result.assets[0].fileName,
        type: result.assets[0].mimeType,
      });

      console.log("image uri", result.assets[0].uri);
    } else {
      alert("You did not select any image");
      setUploading(false);
    }
  };

  const getFieldValue = (fieldName: string) => {
    return (
      (values && values[fieldName]) ||
      fieldValues[fieldName as keyof typeof fieldValues] ||
      ""
    );
  };

  // HeaderComponent as originally defined
  const HeaderComponent = () => {
    return (
      <View className={" mt-4"}>
        <Text className={"font-semibold text-xs text-grey-9"}>
          Profile Details
        </Text>

        <TouchableOpacity
          className={
            "w-[60px] h-[60px] rounded-full bg-purple-3 items-center justify-center mt-4"
          }
          onPress={handleImageUpload}
        >
          {imagePreview ? (
            <Image
              source={{ uri: imagePreview }}
              className="w-[60px] h-[60px] rounded-full"
              resizeMode="cover"
            />
          ) : (
            <Ionicons name={"image"} size={24} color="#8055E5" />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className={"p-6 border border-offwhite rounded-[7px] gap-3 flex-1"}>
      {/* HeaderComponent */}
      <HeaderComponent />

      {/* Form Fields */}
      {profileDetailsFields.map((item, index) => {
        return (
          <View key={index} className={"flex-1 mb-2"}>
            <Text className={"text-grey-9 font-normal"}>{item.label}</Text>

            <Input
              value={getFieldValue(item.name)}
              onChangeText={handleChange(item.name)}
              onBlur={() => handleBlur(item.name)}
              placeholder={item.placeholder}
              customInputStyles={`rounded-md bg-white border border-grey-5 px-3 ${
                item.type === "textarea"
                  ? "py-3 mt-[8px] mb-6 min-h-[90px]"
                  : "py-0.5 mt-[8px] mb-4 h-[28px]"
              }`}
              customStyles="flex-none"
              multiline={item.type === "textarea"}
            />
          </View>
        );
      })}

      {/* Error display */}
      {error && (
        <View className="mb-2">
          <Text className="text-red-500 text-sm">{error.message}</Text>
        </View>
      )}
    </View>
  );
}
