import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Modal,
} from "react-native";
import { useVideoPlayer, VideoView, VideoPlayer } from "expo-video";
import { images } from "@/constants/images";
import SellerContact from "../productDetails/SellerContact";
import { useRouter } from "expo-router";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");

interface ReelItemProps {
  item: {
    id: string;
    video_url: string;
    description: string;
    title: string;
    user: {
      name: string;
      avatar: string;
    };
  };
  index: number;
  activeReelIndex: number;
  reelsRef: React.MutableRefObject<View[]>;
  flatlistRef: any;
  user: { avatar: string; id: string; name: string };
}

export default function ReelItem({
  item,
  index,
  activeReelIndex,
  reelsRef,
  flatlistRef,
  user,
}: ReelItemProps) {
  const isActive = activeReelIndex === index;
  const router = useRouter();

  const player = useVideoPlayer(item.video_url, (player: VideoPlayer) => {
    player.loop = true;
    if (isActive) {
      player.play();
    } else {
      player.pause();
      player.currentTime = 0;
    }
  });

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        if (player?.currentTime <= player?.duration) {
          // Do nothing
        } else {
          if (
            flatlistRef.current &&
            activeReelIndex + 1 < reelsRef.current.length
          ) {
            flatlistRef.current.scrollToIndex({
              index: activeReelIndex + 1,
              animated: true,
            });
          }
        }
      }, 250);

      player?.play();
    } else {
      if (interval) clearInterval(interval);
      player?.pause();
      player.currentTime = 0;
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  return (
    <View style={styles.container}>
      <VideoView style={styles.video} player={player} nativeControls={false} />

      {/* User Info */}
      <View style={styles.userInfo} className="w-full  ">
        <TouchableOpacity onPress={() => router.push(`/seller/${user.id}`)}>
          <View className="flex-row items-center gap-3 ">
            <Image
              source={user?.avatar ? { uri: user?.avatar } : images.lataLogoBig}
              className="w-[60px] h-[60px] rounded-full "
            />
            <Text style={styles.username}>{user?.name}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <TouchableOpacity style={styles.userButton}>
          <Text style={styles.username}>{item?.title}</Text>
        </TouchableOpacity>
        <Text style={styles.description}>{item?.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: WINDOW_HEIGHT,
    width: "100%",
  },
  video: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  userInfo: {
    position: "absolute",
    bottom: 150,
    left: 10,
    flexDirection: "column",
  },
  userButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    color: "white",
    fontWeight: 700,
    fontSize: 18,
  },
  descriptionContainer: {
    position: "absolute",
    bottom: 100,
    left: 10,
    right: 10,
  },
  description: {
    color: "white",
    fontSize: 16,
  },
  actionButtons: {
    position: "absolute",
    right: 10,
    bottom: 100,
    alignItems: "center",
  },
  actionButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  actionText: {
    color: "white",
    marginTop: 5,
    fontSize: 12,
  },
});
