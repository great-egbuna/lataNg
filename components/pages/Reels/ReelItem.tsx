import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useVideoPlayer, VideoView, VideoPlayer } from "expo-video";
import { Ionicons } from "@expo/vector-icons";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");

interface ReelItemProps {
  item: {
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
  };
  index: number;
  activeReelIndex: number;
}

export default function ReelItem({
  item,
  index,
  activeReelIndex,
}: ReelItemProps) {
  const isActive = activeReelIndex === index;

  const player = useVideoPlayer(item.videoUrl, (player: VideoPlayer) => {
    player.loop = true;
    if (isActive) {
      player.play();
    } else {
      player.pause();
      player.currentTime = 0;
    }
  });

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
      player.currentTime = 0;
    }
  }, [isActive]);

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        contentFit="cover"
        nativeControls={false}
      />

      {/* User Info */}
      <View style={styles.userInfo}>
        <TouchableOpacity style={styles.userButton}>
          <Text style={styles.username}>{item.user.name}</Text>
        </TouchableOpacity>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart" size={28} color="white" />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble" size={28} color="white" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social" size={28} color="white" />
          <Text style={styles.actionText}>{item.shares}</Text>
        </TouchableOpacity>
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
    flexDirection: "row",
    alignItems: "center",
  },
  userButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  descriptionContainer: {
    position: "absolute",
    bottom: 100,
    left: 10,
    right: 10,
  },
  description: {
    color: "white",
    fontSize: 14,
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
