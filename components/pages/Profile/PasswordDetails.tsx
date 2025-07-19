import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import Input from "@/components/general/Input";

interface PasswordDetailsProps {
  handleChange: (field: string) => (text: string) => void;
  handleBlur: (field: string) => void;
  setFieldValue: (field: string, value: any) => void;
  values?: any;
}

const passwordDetailsFields = [
  {
    label: "Old Password",
    placeholder: "********",
    name: "oldPassword",
    type: "password",
  },
  {
    label: "New Password",
    placeholder: "********",
    name: "newPassword",
    type: "password",
  },
  {
    label: "Confirm New Password",
    placeholder: "********",
    name: "confirmPassword",
    type: "password",
  },
];

export default function PasswordDetails({
  handleChange,
  handleBlur,
  values = {},
  setFieldValue,
}: PasswordDetailsProps) {
  // Track password values locally to compare them
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Track validation error
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordChange = (field: string) => (text: string) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: text,
    }));

    setFieldValue(field, text);

    setPasswordError("");
  };

  // Validate passwords match on blur
  const handlePasswordBlur = (name: string) => {
    // Only validate if both fields have values
    if (passwords.newPassword && passwords.confirmPassword) {
      if (passwords.newPassword !== passwords.confirmPassword) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError("");
      }
    }

    handleBlur(name);
  };

  // Update local state if values are provided externally
  useEffect(() => {
    if (values.oldPassword || values.newPassword || values.confirmPassword) {
      setPasswords({
        oldPassword: values.oldPassword || "",
        newPassword: values.newPassword || "",
        confirmPassword: values.confirmPassword || "",
      });
    }
  }, [values.oldPassword, values.newPassword, values.confirmPassword]);

  // Check if new password fields should be disabled
  const isNewPasswordDisabled =
    !passwords.oldPassword || passwords.oldPassword.length < 8;

  return (
    <View
      className={"p-2 border border-offwhite rounded-[7px] gap-2  flex-1 my-4"}
    >
      <HeaderComponent />

      {passwordDetailsFields.map((item, index) => {
        const isDisabled =
          (item.name === "newPassword" || item.name === "confirmPassword") &&
          isNewPasswordDisabled;

        return (
          <View key={index} className={"flex-1 "}>
            <Text
              className={`text-grey-9 font-normal ${
                isDisabled ? "text-grey-6" : ""
              }`}
            >
              {item.label}
              {item.name === "oldPassword" && (
                <Text className="text-xs text-grey-7">
                  {" "}
                  (min. 8 characters)
                </Text>
              )}
            </Text>

            <Input
              onChangeText={
                item.name === "oldPassword"
                  ? handlePasswordChange("oldPassword")
                  : item.name === "newPassword" ||
                    item.name === "confirmPassword"
                  ? handlePasswordChange(item.name)
                  : handleChange(item.name)
              }
              onBlur={
                item.name === "newPassword" || item.name === "confirmPassword"
                  ? handlePasswordBlur
                  : handleBlur
              }
              value={
                item.name === "oldPassword"
                  ? passwords.oldPassword || ""
                  : item.name === "newPassword" ||
                    item.name === "confirmPassword"
                  ? passwords[item.name as keyof typeof passwords]
                  : values[item.name] || ""
              }
              placeholder={item.placeholder}
              secureTextEntry={true}
              editable={!isDisabled}
              customInputStyles={`rounded-md border px-3 mt-2  ${
                item.name === "confirmPassword" && passwordError
                  ? "border-red-500 mb-1"
                  : ""
              } h-[28px] ${
                isDisabled
                  ? "bg-grey-2 text-grey-6 border-grey-3"
                  : "bg-white border-grey-5"
              }`}
              customStyles="flex-none"
            />

            {/* Old password length message */}
            {item.name === "oldPassword" &&
              passwords.oldPassword.length > 0 &&
              passwords.oldPassword.length < 8 && (
                <Text className="text-red-500 text-xs mt-4">
                  Old password must be at least 8 characters
                </Text>
              )}

            {/* Show error message only after the confirm password field */}
            {item.name === "confirmPassword" && passwordError && (
              <Text className="text-red-500 text-xs mt-4">{passwordError}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const HeaderComponent = () => {
  return (
    <View className={" mt-4"}>
      <Text className={"font-semibold text-xs text-grey-9"}>
        Change Password
      </Text>
    </View>
  );
};
