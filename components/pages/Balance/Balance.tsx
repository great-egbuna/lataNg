import { Text, TouchableOpacity, View } from "react-native";

export default function BalanceComponent() {
  return (
    <View className={"border border-grey-2 rounded-[10px]  gap-6 p-6"}>
      <View className={"gap-2"}>
        <Text className={"font-semibold text-grey-9 text-sm"}>My Balance</Text>
        <Text className={"font-normal text-grey-8-100 text-small"}>
          You can use your balance to pay for subscription packages
        </Text>
      </View>

      <View
        className={
          "bg-purple-2 w-[114px] h-[85px] rounded-[5px] justify-center gap-3 px-6"
        }
      >
        <Text className={"font-normal text-tiny text-grey-8-100"}>
          Available balance
        </Text>
        <Text className={"font-semibold text-grey-10 text-base"}>#0</Text>
      </View>

      <TouchableOpacity
        className={
          "bg-purple w-[174px] h-[32px] items-center  justify-center rounded-lg "
        }
      >
        <Text className={"text-white  font-semibold text-base"}>Recharge</Text>
      </TouchableOpacity>
    </View>
  );
}
