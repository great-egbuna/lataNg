import { Switch, Text, TouchableOpacity, View } from "react-native";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";

const notificationSettings = [
  { label: "New Features and updates", name: "feature" },
  { label: "Your Subscription", name: "subscription" },
  { label: "Feedback", name: "feedback" },
  { label: "SMS Info Notification", name: "sms" },
];

interface SettingsProps {
  handleChange?: (field: string, value: boolean) => void;
  values?: Record<string, boolean>;
}

export default function ProfileSettings({
  handleChange,
  values,
}: SettingsProps) {
  const { user } = useAuth() as IAUTH;

  const userSettings = user?.settings[0]?.columnValue;

  const [settings, setSettings] = useState({
    feature: false,
    subscription: false,
    feedback: false,
    sms: false,
  });

  useEffect(() => {
    if (values) {
      setSettings((prev) => ({
        ...prev,
        ...values,
      }));
    }
  }, [values]);

  const toggleSetting = (name: string, value: boolean) => {
    setSettings({ ...settings, [name]: value });
    if (handleChange) {
      handleChange(name, value);
    }
  };

  return (
    <View className={"p-2 border border-offwhite rounded-[7px] flex-1"}>
      <Text className={"font-semibold text-lg text-grey-9"}>
        Notification Settings
      </Text>

      <Text className={"font-normal text-base tracking-[-0.72px]"}>
        You will get an email notification for options you toggle on.
      </Text>

      {notificationSettings.map(
        (item: { label: string; name: string }, index) => {
          return (
            <TouchableOpacity
              key={index}
              className={"flex-row items-center justify-between mt-3"}
              onPress={() =>
                toggleSetting(
                  item.name,
                  !settings[item.name as keyof typeof settings]
                )
              }
            >
              <Text
                className={`font-normal text-lg text-grey-8 ${
                  item.label.includes("SMS") &&
                  "font-semibold text-lg text-grey-9"
                }`}
              >
                {item.label}
              </Text>
              <Switch
                value={settings[item.name as keyof typeof settings]}
                onValueChange={(value) => toggleSetting(item.name, value)}
                thumbColor={
                  settings[item.name as keyof typeof settings]
                    ? "#5113a1"
                    : "#f4f3f4"
                }
                trackColor={{ false: "#767577", true: "#5113a1" }}
                ios_backgroundColor="#767577"
              />
            </TouchableOpacity>
          );
        }
      )}
    </View>
  );
}
