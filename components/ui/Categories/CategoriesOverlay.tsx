import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
  ListRenderItemInfo,
} from "react-native";
import { colors } from "@/colors";
import {
  AppContextProps,
  ICategoryWithSubcategories,
} from "@/context/AppContext";
import ButtonSecondary from "@/components/general/ButtonSecondary";
import { ICategoryWithImage } from "@/constants/categories";
import { useApp } from "@/context/AppContext";
import { Image } from "expo-image";
import SubcategoriesOverlay from "./SubcategoriesOverlay";

interface CategoriesOverlayProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
}

const { width } = Dimensions.get("window");

function CategoriesOverlay({
  visible,
  onClose,
  title = "Categories",
}: CategoriesOverlayProps) {
  const {
    categories,
    handleCategorySelect,
    subcategoryOverlayVisible,
    setSubcategoryOverlayVisible,
    selectedCategory,
  } = useApp() as AppContextProps;

  const renderCategoryItem = ({
    item,
  }: ListRenderItemInfo<ICategoryWithImage>) => {
    return (
      <TouchableOpacity
        style={styles.categoryItem}
        onPress={() => handleCategorySelect(item as ICategoryWithSubcategories)}
      >
        <View style={styles.categoryImageContainer}>
          <Image
            source={{ uri: item?.image as any }}
            style={styles.categoryImage}
          />
        </View>
        <Text style={styles.categoryName} numberOfLines={2}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <Text style={styles.subtitle}>All Categories</Text>
  );

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={categories as ICategoryWithImage[]}
              keyExtractor={(item) => item.id}
              renderItem={renderCategoryItem}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
              ListHeaderComponent={renderHeader}
              columnWrapperStyle={styles.columnWrapper}
            />

            <View style={styles.footer}>
              <ButtonSecondary
                text="Done"
                customStyles="bg-purple w-full"
                customTextStyles="text-white font-semibold"
                onPress={onClose}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Subcategories Overlay */}
      <SubcategoriesOverlay
        visible={subcategoryOverlayVisible}
        onClose={() => setSubcategoryOverlayVisible(false)}
        categoryName={selectedCategory?.name || ""}
        categoryId={selectedCategory?.id || ""}
        subcategories={selectedCategory?.subcategories || null}
      />
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    height: "90%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    position: "absolute",
    bottom: 0,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.purple,
  },
  closeButton: {
    fontSize: 20,
    color: colors.purple,
    padding: 5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
  },
  categoriesContainer: {
    paddingBottom: 10,
  },
  columnWrapper: {
    justifyContent: "flex-start",
  },
  categoryItem: {
    width: (width - 60) / 3,
    marginBottom: 20,
    alignItems: "center",
  },
  categoryImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.purple + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryImage: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  categoryName: {
    fontSize: 12,
    textAlign: "center",
    color: "#333",
  },
  footer: {
    marginTop: 10,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
  },
});

export default CategoriesOverlay;
