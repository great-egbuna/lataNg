import { Text, View } from "react-native";

interface Props {
  text_one: string;
  text_two: string;
  text_three: string;
  className?: string;
  textClassName?: string;
}

export default function AnalyticsCard({
  text_one,
  text_two,
  text_three,
  className,
  textClassName,
}: Props) {
  return (
    <View className={"border border-grey-2 mb-3 rounded-lg p-4"}>
      <View
        className={`border border-grey-2  rounded-lg px-6 py-7 bg-purple gap-4 ${className}`}
      >
        <Text className={`font-normal text-sm text-grey-10 ${textClassName}`}>
          {text_one}
        </Text>
        <Text
          className={`font-medium text-sm text-grey-10 text-2xl ${textClassName}`}
        >
          {text_two}
        </Text>
        <Text
          className={`font-normal text-small text-grey-10 ${textClassName} `}
        >
          {text_three}
        </Text>
      </View>
    </View>
  );
}
