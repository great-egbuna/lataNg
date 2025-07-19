import { View, Text } from "react-native";
import ProductFeedbackItem from "./ProductFeedbackItem";
import { useEffect, useState } from "react";
import { feedbackService } from "@/services/feedback.service";

interface IProductFeedback {
  productId: string;
}

export default function ProductFeedback(props: IProductFeedback) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await feedbackService.getProductFeedback(props?.productId);
      if (res instanceof Error) {
        setError(res?.message);
        setLoading(false);
        return;
      }
      setFeedbacks(res?.data);
      setLoading(false);
      setError(undefined);
    })();
  }, []);

  if (loading) return null;

  if (error)
    return (
      <View className={"gap-1"}>
        <Text className={"text-black font-bold text-xl"}>Feedbacks</Text>
        <Text className="text-grey-6 text-lg">
          Could not fetch product feedback
        </Text>
      </View>
    );

  if (feedbacks?.length === 0)
    return (
      <View className={"gap-1"}>
        <Text className={"text-black font-bold text-xl tracking-[-0.72px]"}>
          Feedbacks
        </Text>
        <Text className="text-grey-6 text-lg tracking-[-0.72px]">
          No feedbacks for this product{" "}
        </Text>
      </View>
    );
  return (
    <View className={"gap-2"}>
      <View className={"flex-row items-center justify-between"}>
        <Text className={"text-black font-bold text-xl tracking-[-0.72px]"}>
          Feedbacks
        </Text>
      </View>

      <View>
        {feedbacks?.map((feedback, index) => (
          <ProductFeedbackItem
            key={index}
            description={feedback?.description}
            rating={feedback?.rating}
            sender={feedback?.sender}
          />
        ))}
      </View>
    </View>
  );
}
