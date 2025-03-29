import { Text, View } from "react-native";

interface IProductFeedbackItem {
  description: string;
  rating: number;
  sender: string;
}

export default function ProductFeedbackItem({
  description,
  rating,
  sender,
}: IProductFeedbackItem) {
  const getRating = () => {
    switch (rating) {
      case 1:
        return "Negative";
      case 2:
        return "Neutral";
      case 3:
        return "Positive";
    }
  };

  return (
    <View className={"gap-2 rounded-lg p-2 border border-grey-2"}>
      <Text
        className={`${rating === 1 && "text-danger-100"} ${
          rating === 2 && "text-yellow"
        } ${rating === 3 && "text-green"}`}
      >
        {getRating()}
      </Text>

      <Text className={"text-black font-bold text-xs"}>From: {sender}</Text>

      <Text className={"text-black font-normal text-sm"}>{description}</Text>
    </View>
  );
}
