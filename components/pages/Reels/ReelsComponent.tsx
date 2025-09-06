import React, { useState, useRef } from "react";
import { View, Dimensions, FlatList, StyleSheet } from "react-native";
import ReelItem from "./ReelItem";
import { AppContextProps, IReel } from "@/context/AppContext";
import { useApp } from "@/context/AppContext";

const avatar =
  "data:image/jpeg;base64,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";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");

interface Reel {
  id: string;
  videoUrl: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  user: {
    name: string;
    avatar: string;
  };
}

export const DUMMY_REELS: Reel[] = [
  {
    id: "1",
    videoUrl:
      "https://res.cloudinary.com/dx5wmtutn/video/upload/v1742989569/test_nvw4xx.mp4",
    description: "Amazing reel #1",
    likes: 1000,
    comments: 100,
    shares: 50,
    user: {
      name: "Great Egbuna",
      avatar: avatar,
    },
  },

  {
    id: "2",
    videoUrl:
      "https://res.cloudinary.com/dx5wmtutn/video/upload/v1742989569/test_nvw4xx.mp4",
    description: "Amazing reel #1",
    likes: 1000,
    comments: 100,
    shares: 50,
    user: {
      name: "User1",
      avatar: avatar,
    },
  },

  // Add more dummy data as needed
];

export default function ReelsComponent() {
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const { selectedReel } = useApp() as AppContextProps;

  console.log("selectedReel", selectedReel.user);

  const flatListRef = useRef<FlatList>(null);
  const reelsRef = useRef<View[]>([]);

  const onViewableItemsChanged = useRef(({ changed }: any) => {
    changed.forEach((element: any) => {
      const cell = element.item;
      if (element.isViewable) {
        setActiveReelIndex(
          selectedReel?.reels?.findIndex(
            (reel: IReel) => reel.id === cell.id
          ) as number
        );
      }
    });
  });

  const renderItem = ({
    item,
    index,
    user,
  }: {
    item: any;
    index: number;
    user: { avatar: string; id: string; name: string };
  }) => {
    return (
      <ReelItem
        item={item}
        index={index}
        activeReelIndex={activeReelIndex}
        reelsRef={reelsRef}
        flatlistRef={flatListRef}
        user={user}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={selectedReel.reels}
        renderItem={({ item, index }) => (
          <View
            ref={(ref) => {
              if (ref) {
                reelsRef.current![index] = ref;
              }
            }}
          >
            {renderItem({ item, index, user: selectedReel?.user })}
          </View>
        )}
        pagingEnabled
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        snapToInterval={WINDOW_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        initialScrollIndex={0}
        getItemLayout={(data, index) => ({
          length: WINDOW_HEIGHT,
          offset: WINDOW_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
