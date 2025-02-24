import { Switch, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";

const notificationSettings = [
  { label: "New Features and updates", name: "newFeatures" },
  { label: "Your Subscription", name: "subscriptions" },
  { label: "Messages", name: "messages" },
  { label: "Feedback", name: "feedback" },
  { label: "SMS Info Notification", name: "sms" },
];

export default function ProfileSettings() {
  const [settings, setSettings] = useState({
    newFeatures: false,
    subscriptions: false,
    messages: false,
    feedback: false,
    sms: false,
  });
  return (
    <View className={"p-6 border border-offwhite rounded-[7px] gap-3  flex-1"}>
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
              className={"flex-row items-center justify-between"}
            >
              <Text
                className={`font-normal text-xs text-grey-8 ${item.label.includes("SMS") && "font-semibold text-sm text-grey-9"}`}
              >
                {item.label}
              </Text>
              <Switch
                //@ts-ignore
                value={settings[item.name]}
                onValueChange={(e) => {
                  setSettings({ ...settings, [item.name]: e });
                }}
                thumbColor={false ? "#A020F0" : "#f4f3f4"}
                trackColor={{ false: "#767577", true: "#A020F0" }}
              />
            </TouchableOpacity>
          );
        },
      )}
    </View>
  );
}
