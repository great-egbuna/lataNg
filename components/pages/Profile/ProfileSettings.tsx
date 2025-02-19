import { Text, TouchableOpacity, View } from "react-native";

const notificationSettings = [
  "New Features and updates",
  "Your Subscription",
  "Messages",
  "Feedback",
  "SMS Info Notification",
];

export default function ProfileSettings() {
  return (
    <View className={"p-6 border border-offwhite rounded-[7px] gap-3  flex-1"}>
      <Text className={"font-semibold text-xs text-grey-9"}>
        Notification Settings
      </Text>

      <Text className={"font-normal text-xs text-grey-8"}>
        You will get an email notification for options you toggle on.
      </Text>

      {notificationSettings.map((item) => {
        return (
          <TouchableOpacity>
            <Text
              className={`font-normal text-xs text-grey-8 ${item.includes("SMS") && "font-semibold text-sm text-grey-9"}`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
