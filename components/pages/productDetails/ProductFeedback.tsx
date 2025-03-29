import { View, Text } from "react-native";

import { FlatList } from "react-native";
import ProductFeedbackItem from "./ProductFeedbackItem";

interface IProductFeedback {
  feedbacks: any[];
}

export default function ProductFeedback({ feedbacks }: IProductFeedback) {
  return (
    <View className={"gap-2"}>
      <View className={"flex-row items-center justify-between"}>
        <Text className={"text-black font-bold text-base"}>Feedbacks</Text>
      </View>

      {feedbacks.map((feedback, index) => (
        <ProductFeedbackItem
          key={index}
          description={feedback.description}
          rating={feedback.rating}
          sender={feedback.sender}
        />
      ))}
    </View>
  );
}
