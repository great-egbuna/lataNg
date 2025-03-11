import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Input from "@/components/general/Input";

interface Props {
  handleChange?: (text: string) => void;
  handleBlur?: (text: string) => void;
  value?: string;
  placeholder?: string;
}

const profileDetailsFields = [
  {
    label: "Full Name",
    placeholder: "Jane",
    name: "fullName",
    type: "text",
  },
  {
    label: "Email",
    placeholder: "janedoe@gmail.com",
    name: "email",
    type: "text",
  },
  {
    label: "Phone Number",
    placeholder: "08034567890",
    name: "phoneNumber",
    type: "text",
  },
  {
    label: "Location",
    placeholder: "Ikeja",
    name: "location",
    type: "text",
  },

  {
    label: "About Business",
    placeholder: "About Business",
    name: "about",
    type: "textarea",
  },
  {
    label: "Business Address",
    placeholder: "Business Address",
    name: "address",
    type: "textarea",
  },
];

export default function ProfileDetails({
  handleChange,
  handleBlur,
  value,
}: Props) {
  return (
    <View className={"p-6 border border-offwhite rounded-[7px] gap-3  flex-1 "}>
      <HeaderComponent />

      {profileDetailsFields.map((item, index) => {
        return (
          <View key={index} className={"flex-1"}>
            <Text className={"text-grey-9 font-normal"}>{item.label}</Text>

            <Input
              onChangeText={() => handleChange!(item.name)}
              onBlur={() => handleBlur!(item.name)}
              value={value}
              placeholder={item.placeholder}
              customInputStyles={`rounded-md bg-white border border-grey-5  px-3 py-3 mt-[8px] mb-6 ${
                item.type === "textarea" && "min-h-[50px]"
              }`}
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
        Profile Details
      </Text>

      <TouchableOpacity
        className={
          "w-[60px] h-[60px] rounded-full bg-purple-3 items-center justify-center mt-4"
        }
      >
        <Ionicons name={"image"} />
      </TouchableOpacity>
    </View>
  );
};
