import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Input from "@/components/general/Input";

interface Props {
  handleChange?: (text: string) => void;
  handleBlur?: (text: string) => void;
  value?: string;
  placeholder?: string;
}

const passwordDetailsFields = [
  {
    label: "Old Password",
    placeholder: "********",
    name: "",
    type: "text",
  },
  {
    label: "New Password",
    placeholder: "********",
    name: "password",
    type: "text",
  },
  {
    label: "Confirm New Password",
    placeholder: "********",
    name: "",
    type: "text",
  },
];

export default function PasswordDetails({
  handleChange,
  handleBlur,
  value,
}: Props) {
  return (
    <View
      className={"p-6 border border-offwhite rounded-[7px] gap-3  flex-1  my-4"}
    >
      <HeaderComponent />

      {passwordDetailsFields.map((item, index) => {
        return (
          <View key={index} className={"flex-1"}>
            <Text className={"text-grey-9 font-normal"}>{item.label}</Text>

            <Input
              onChangeText={() => handleChange!(item.name)}
              onBlur={() => handleBlur!(item.name)}
              value={value}
              placeholder={item.placeholder}
              customInputStyles={`rounded-md bg-white border border-grey-5  px-3 py-3 mt-[8px] mb-6 ${item.type === "textarea" && "min-h-[50px]"}`}
              customStyles={{
                flexDirection: "column",
              }}
            />
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
