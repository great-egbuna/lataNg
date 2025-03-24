import { Switch, Text, TouchableOpacity, View } from "react-native";
import { useState, useEffect } from "react";

const notificationSettings = [
  { label: "New Features and updates", name: "features" },
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
  const [settings, setSettings] = useState({
    features: false,
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
    <View className={"p-6 border border-offwhite rounded-[7px] gap-3 flex-1"}>
      <Text className={"font-semibold text-xs text-grey-9"}>
        Notification Settings
      </Text>

      <Text className={"font-normal text-xs text-grey-8"}>
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
                className={`font-normal text-xs text-grey-8 ${
                  item.label.includes("SMS") &&
                  "font-semibold text-sm text-grey-9"
                }`}
              >
                {item.label}
              </Text>
              <Switch
                value={settings[item.name as keyof typeof settings]}
                onValueChange={(value) => toggleSetting(item.name, value)}
                thumbColor={
                  settings[item.name as keyof typeof settings]
                    ? "#A020F0"
                    : "#f4f3f4"
                }
                trackColor={{ false: "#767577", true: "#E0CCF9" }}
                ios_backgroundColor="#767577"
              />
            </TouchableOpacity>
          );
        }
      )}
    </View>
  );
}
