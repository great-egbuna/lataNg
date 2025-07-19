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
    <View>
      <View
        className={`border border-grey-2  rounded-lg px-6 py-4 bg-purple gap-2 ${className}`}
      >
        <Text className={`font-normal text-base text-grey-10 ${textClassName}`}>
          {text_one}
        </Text>
        <Text
          className={`font-bold text-lg text-grey-10 text-2xl ${textClassName}`}
        >
          {text_two}
        </Text>
        <Text className={`font-normal text-sm text-gray-500 ${textClassName} `}>
          {text_three}
        </Text>
      </View>
    </View>
  );
}
