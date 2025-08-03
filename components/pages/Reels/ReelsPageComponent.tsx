import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { Video } from "expo-av";
import { reelService } from "@/services/reel.service";
import { showToast } from "@/components/general/Toast";
import { useRouter } from "expo-router";

const ReelsPageComponent = () => {
  const router = useRouter();

  const [video, setVideo] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "videos",
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const videoUri = result.assets[0].uri;

        // Get file size using getInfoAsync with size option
        const fileInfo = await FileSystem.getInfoAsync(videoUri, {
          size: true,
        });

        // Check file size (60MB = 60 * 1024 * 1024 bytes)
        if (
          fileInfo.exists &&
          fileInfo.size &&
          fileInfo.size > 60 * 1024 * 1024
        ) {
          Alert.alert("File Too Large", "Please select a video under 60MB");
          return;
        }

        setVideo(videoUri);
        setVideoFile(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking video:", error);
      Alert.alert("Error", "Failed to process video. Please try again.");
    }
  };

  const handleVideoLoad = (status: any) => {
    if (!status.isLoaded) {
      Alert.alert("Error", "Failed to load video");
      return;
    }

    // Check video duration (1 minute = 60 seconds)
    if (status.durationMillis && status.durationMillis > 60 * 1000) {
      Alert.alert("Video Too Long", "Please select a video under 1 minute");
      setVideo(null);
    }
  };

  const handleCreateReel = async () => {
    setLoading(true);
    if (!video || !title.trim() || !videoFile) {
      Alert.alert(
        "Missing Information",
        "Please select a video and enter a title"
      );
      setLoading(false);
    }

    const formData = new FormData();
    formData.append("file", {
      uri: videoFile.uri,
      name: videoFile.fileName,
      type: videoFile.mimeType,
    } as any);
    formData.append("title", title);
    formData.append("description", description);

    const res = await reelService.createReel(formData);

    if (res instanceof Error) {
      showToast({
        type: "error",
        text1: "Error",
        text2: res.message,
      });
      setLoading(false);
      return;
    }

    showToast({
      type: "success",
      text1: "Success",
      text2: "Your reel has been created successfully!",
    });

    router.push("/");
    return;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Reel</Text>
        <Text style={styles.subtitle}>Share your moments with the world</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.videoContainer, !video && styles.videoPlaceholder]}
          onPress={pickVideo}
        >
          {video ? (
            <View style={styles.videoWrapper}>
              <Video
                source={{ uri: video }}
                style={styles.videoPreview}
                onLoad={handleVideoLoad}
              />
              <Image
                source={{ uri: video }}
                style={styles.videoPreview}
                resizeMode="cover"
              />
            </View>
          ) : (
            <View style={styles.uploadContent}>
              <Ionicons name="videocam-outline" size={40} color="#5113a1" />
              <Text style={styles.uploadText}>Select Video</Text>
              <Text style={styles.uploadSubtext}>
                Tap to choose a video file
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a catchy title"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us about your reel"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              placeholderTextColor="#666"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.createButton,
              (!video || !title.trim()) && styles.createButtonDisabled,
            ]}
            onPress={handleCreateReel}
            disabled={!video || !title.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="add-circle-outline" size={20} color="#fff" />
                <Text style={styles.createButtonText}>Create Reel</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  videoContainer: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    marginBottom: 20,
  },
  videoWrapper: {
    flex: 1,
  },
  videoPlaceholder: {
    borderWidth: 2,
    borderColor: "#5113a1",
    borderStyle: "dashed",
  },
  videoPreview: {
    width: "100%",
    height: "100%",
  },
  uploadContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#5113a1",
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 18,
    color: "#666",
    marginTop: 4,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5113a1",
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    gap: 8,
  },
  createButtonDisabled: {
    backgroundColor: "#ccc",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default ReelsPageComponent;
