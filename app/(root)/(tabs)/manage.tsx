import ButtonOutline from "@/components/general/ButtonOutline";
import { FullScreenLoader } from "@/components/general/Loader";
import ErrorCard from "@/components/ui/ErrorCard";
import { showToast } from "@/components/general/Toast";
import { reelService } from "@/services/reel.service";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";

export default function Manage() {
  const [loading, setLoading] = useState(true);
  const [reels, setReels] = useState<
    { id: string; title: string; description: string }[]
  >([]);
  const [error, setError] = useState<string | undefined>(undefined);
  const [deleting, setDeleting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const getUserReels = async () => {
      const reels = await reelService.getUserReels();
      if (reels instanceof Error) {
        setError(reels?.message);
        setLoading(false);
        return;
      }
      setReels(reels);
      setLoading(false);
    };
    getUserReels();
  }, []);

  const handleDelete = async () => {
    if (!selectedId) return;
    setDeleting(true);
    setModalVisible(false);
    const result = await reelService.destroy(selectedId);
    if (result instanceof Error) {
      showToast({ type: "error", text1: "Error", text2: "Failed to delete" });
    } else {
      setReels((prev) => prev.filter((r) => r.id !== selectedId));
    }
    setDeleting(false);
    setSelectedId(null);
  };

  if (loading) return <FullScreenLoader />;
  if (error) return <ErrorCard error={"Server Error. Please try again"} />;

  return (
    <View className="h-full bg-white p-4">
      <Text className="text-lg mb-2">My Reels</Text>
      <FlatList
        ListEmptyComponent={<Text>You have not uploaded any reels</Text>}
        data={reels}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReelCard
            title={item?.title}
            description={item?.description}
            onDelete={() => {
              setSelectedId(item.id);
              setModalVisible(true);
            }}
          />
        )}
      />

      {/* Confirm Delete Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white p-6 rounded-lg w-80">
            <Text className="text-lg font-semibold mb-4">Confirm Delete</Text>
            <Text className="mb-6">
              Are you sure you want to delete this reel?
            </Text>
            <View className="flex-row justify-end gap-4">
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text className="text-gray-500">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <Text className="text-red-500 font-semibold">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function ReelCard({
  title,
  description,
  onDelete,
}: {
  title: string;
  description: string;
  onDelete: () => void;
}) {
  return (
    <View className="border border-gray-200 w-full max-w-[350px] rounded bg-white p-4 mb-4">
      <Ionicons name="videocam-outline" size={100} color="#5113a1" />
      <Text className="mb-1 text-lg font-semibold">Reel Title : {title}</Text>
      <Text>Reel Name : {description}</Text>

      <ButtonOutline
        text="Delete"
        className="border rounded-0 border-red-500 w-[100px] bg-red-500 text-white mt-4"
        onPress={onDelete}
        textStyle="text-white"
      />
    </View>
  );
}
