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
    <View className={`gap-1 rounded-lg p-2 border border-grey-2`}>
      <View className="flex-row">
        <View
          className={`${rating === 1 && "bg-danger-100"} ${
            rating === 2 && "bg-yellow"
          } ${rating === 3 && "bg-green"} rounded-lg py-1 px-2`}
        >
          <Text className={`text-white`}>{getRating()}</Text>
        </View>
      </View>

      <Text className={"text-black font-bold "}>{sender}</Text>

      <Text className={"text-black font-normal "}>{description}</Text>
    </View>
  );
}
