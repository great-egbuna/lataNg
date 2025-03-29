import { useState } from "react";
import Overlay from "@/components/general/Overlay";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { AppContextProps, useApp } from "@/context/AppContext";
import { feedbackService } from "@/services/feedback.service";
import { showToast } from "@/components/general/Toast";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import { colors } from "@/colors";

export default function FeedbackModal() {
  const {
    feedbackOpen,
    setFeedbackOpen,
    feedbackProductId,
    feedbackProductName,
  } = useApp() as AppContextProps;

  const { user } = useAuth() as IAUTH;
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productName = feedbackProductName || "this product";

  const handleRatingSelect = (value: number) => {
    setRating(value);
  };

  const handleCancel = () => {
    // Reset form and close modal
    setDescription("");
    setRating(null);
    setFeedbackOpen(false);
  };

  const handleSubmit = async () => {
    if (rating === null) {
      showToast({
        type: "error",
        text1: "Error",
        text2: "Please select a rating (Positive, Neutral, or Negative)",
      });
      return;
    }

    if (!description.trim()) {
      showToast({
        type: "error",
        text1: "Error",
        text2: "Please provide feedback description",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await feedbackService.createFeedback({
        type: "PRODUCT",
        productId: feedbackProductId,
        description,
        rating,
        sender: user?.name || "Anonymous",
        userId: user?.id,
      });

      if (result.success) {
        showToast({
          type: "success",
          text1: "Success",
          text2: "Your feedback has been submitted",
        });
        handleCancel(); // Reset and close
      } else {
        if (result.isOwnProduct) {
          showToast({
            type: "error",
            text1: "Error",
            text2: "You cannot give feedback to your own product",
          });
        } else {
          showToast({
            type: "error",
            text1: "Error",
            text2: result.message || "Failed to submit feedback",
          });
        }
      }
    } catch (error) {
      showToast({
        type: "error",
        text1: "Error",
        text2: "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!feedbackOpen) return null;

  return (
    <Overlay>
      <View
        className={"relative bg-white w-full self-start rounded-[7px] p-5 mb-7"}
      >
        <TouchableOpacity
          className={"self-end"}
          onPress={handleCancel}
          disabled={isSubmitting}
        >
          <FontAwesome5 name={"times"} size={20} />
        </TouchableOpacity>

        <View className={"gap-3"}>
          <Text className={"text-black font-normal text-sm"}>
            Leave a feedback for {productName}
          </Text>

          <Text className={"text-black font-normal text-xs"}>
            How was your experience?
          </Text>

          <View className={"flex-row gap-3"}>
            <TouchableOpacity
              className={`w-[83px] h-9 border rounded-[10px] items-center justify-center border-green ${
                rating === 3 ? "bg-green/10" : ""
              }`}
              onPress={() => handleRatingSelect(3)}
              disabled={isSubmitting}
            >
              <Text className={"text-green"}>Positive</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`w-[83px] h-9 border rounded-[10px] items-center justify-center border-yellow ${
                rating === 2 ? "bg-yellow/10" : ""
              }`}
              onPress={() => handleRatingSelect(2)}
              disabled={isSubmitting}
            >
              <Text className={"text-yellow"}>Neutral</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`w-[83px] h-9 border rounded-[10px] items-center justify-center border-danger-100 ${
                rating === 1 ? "bg-danger-100/10" : ""
              }`}
              onPress={() => handleRatingSelect(1)}
              disabled={isSubmitting}
            >
              <Text className={"text-danger-100"}>Negative</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className={"gap-3 mt-5"}>
          <TextInput
            className={
              "border border-grey-5 h-[150px] placeholder:justify-start p-2 rounded-md"
            }
            multiline={true}
            placeholder={"Type your message"}
            value={description}
            onChangeText={setDescription}
            editable={!isSubmitting}
          />

          <View className={"flex-row justify-end"}>
            <TouchableOpacity
              className={"w-[102px] bg-white h-8 items-center justify-center"}
              onPress={handleCancel}
              disabled={isSubmitting}
            >
              <Text className={"font-semibold text-base text-purple"}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={
                "w-[168px] bg-purple h-8 items-center justify-center rounded-xl"
              }
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className={"font-semibold text-white"}>
                  Send Feedback
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Overlay>
  );
}
