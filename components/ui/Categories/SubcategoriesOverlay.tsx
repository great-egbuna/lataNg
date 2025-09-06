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
import { ICategory, AppContextProps, IProduct } from "@/context/AppContext";
import ButtonSecondary from "@/components/general/ButtonSecondary";
import { useApp } from "@/context/AppContext";

interface SubcategoriesOverlayProps {
  visible: boolean;
  onClose: () => void;
  subcategories: { name: string; id: string }[] | null;
  categoryName: string;
  categoryId: string;
}

function SubcategoriesOverlay({
  visible,
  onClose,
  subcategories,
  categoryName,
}: SubcategoriesOverlayProps) {
  const { setSpecificCategoryProducts, unlimitedCategories } =
    useApp() as AppContextProps;

  const handleSelect = async (subcategoryId: string) => {
    let otherProducts = [];
    const subProducts = unlimitedCategories?.filter?.(
      (product: IProduct) =>
        product.subCategoryId === subcategoryId ||
        (product.subCategoryId?.includes("yatch") &&
          subcategoryId.includes("Yatch"))
    );

    // return something most of the time
    if (subProducts?.length === 0) {
      otherProducts = unlimitedCategories?.filter?.(
        (product: IProduct) => product.subCategoryId === "Others"
      );
    }

    const products = subProducts.length > 0 ? subProducts : otherProducts;

    setSpecificCategoryProducts(products);
    /*  router.push(`/`); */

    onClose();
  };

  const renderSubcategoryItem = ({ item }: ListRenderItemInfo<ICategory>) => (
    <TouchableOpacity
      style={styles.subcategoryItem}
      onPress={() => handleSelect(item.name)}
    >
      <Text style={styles.subcategoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{categoryName}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          {subcategories && subcategories.length > 0 ? (
            <FlatList
              data={subcategories}
              keyExtractor={(item) => item.id}
              renderItem={renderSubcategoryItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.subcategoriesContainer}
              ListHeaderComponent={
                <Text style={styles.subtitle}>Subcategories</Text>
              }
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No subcategories found</Text>
            </View>
          )}

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
  subcategoriesContainer: {
    paddingBottom: 10,
  },
  subcategoryItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  subcategoryName: {
    fontSize: 14,
    color: "#333",
  },
  footer: {
    marginTop: 10,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
  },
});

export default SubcategoriesOverlay;
