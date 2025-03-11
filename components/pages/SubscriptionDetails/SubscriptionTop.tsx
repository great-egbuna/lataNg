import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { AppContextProps, useApp } from "@/context/AppContext";
import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function SubscriptionDetailsTop() {
  const { selectedPackage } = useApp() as AppContextProps;

  const [activePackage, setActivePackage] = useState("Free");

  const selectedBenefits = selectedPackage.benefits.find(
    (item: Record<string, any>) => item.package === activePackage,
  );

  return (
    <View>
      <Text
        className={"font-semibold text-grey-8-100 text-sm"}
      >{`Available plans for ${selectedPackage.type} ads`}</Text>

      <ScrollView
        horizontal={true}
        bounces={false}
        showsHorizontalScrollIndicator={false}
      >
        {selectedPackage.benefits.map(
          (item: Record<string, any>, index: number) => {
            return (
              <>
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setActivePackage(item.package);
                  }}
                  className={`${item.package === activePackage ? "bg-purple text-white" : "bg-white border border-purple"} rounded-xl  flex items-center justify-center py-1.5 px-6 mr-3 mt-4 mb-2`}
                >
                  <Text
                    className={`${item.package === activePackage ? "text-white" : "text-purple"} text-base`}
                  >
                    {item.package}
                  </Text>
                </TouchableOpacity>
              </>
            );
          },
        )}
      </ScrollView>

      <View className={"border border-grey-2 rounded-[10px] px-8 py-6 gap-4"}>
        {selectedBenefits.benefit?.map((text: string, index: number) => {
          return <Benefit text={text} key={index} />;
        })}

        <TouchableOpacity
          className={
            "bg-purple py-1.5 flex items-center justify-center rounded-lg"
          }
        >
          <Text className={"text-white text-base font-semibold"}>Active</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Benefit = ({ text }: { text: string }) => {
  return (
    <View className={"flex-row gap-[5px] items-center"}>
      <MaterialIcons name={"cancel"} color={"#db3030"} />
      <Text className={"font-normal text-sm text-grey-6"}>{text}</Text>
    </View>
  );
};
