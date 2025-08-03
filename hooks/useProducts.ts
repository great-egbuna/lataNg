import { useState, useEffect, useCallback } from "react";
import { productService } from "../services/product.service";
import { IAUTH } from "@/interfaces/context/auth";
import { useAuth } from "@/context/AuthContext";

export function useSavedProducts(
  productId?: string | number,
  initialPage: number = 1,
  initialLimit: number = 10
) {
  const { isLoggedIn, user } = useAuth() as IAUTH;
  const [savedProducts, setSavedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [savingProducts, setSavingProducts] = useState<Set<string | number>>(
    new Set()
  );
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    lastPage: 1,
    total: 0,
    isEmpty: true,
  });

  const fetchSavedProducts = async (
    page: number = initialPage,
    limit: number = initialLimit
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await productService.getSavedProducts(page, limit);

      setSavedProducts(
        page === 1 ? response.data : [...savedProducts, ...response.data]
      );
      setPagination({
        currentPage: response.meta.current_page,
        lastPage: response.meta.last_page,
        total: response.meta.total,
        isEmpty: response.isEmpty,
      });

      if (productId) {
        const isProductSaved = response?.data?.some(
          (item: any) =>
            item.productId === productId ||
            (item.product && item.product.id === productId)
        );
        if (isProductSaved) {
          setSavingProducts((prev) => {
            const newSet = new Set(prev);
            newSet.add(productId);
            return newSet;
          });
        } else {
          setSavingProducts((prev) => {
            const newSet = new Set(prev);
            newSet.delete(productId);
            return newSet;
          });
        }
      }
    } catch (error: any) {
      setError(error.message || "Failed to fetch saved products");
    } finally {
      setLoading(false);
    }
  };

  const refreshSavedProducts = async () =>
    await fetchSavedProducts(1, initialLimit);

  const loadMoreSavedProducts = () => {
    if (pagination.currentPage < pagination.lastPage && !loading) {
      fetchSavedProducts(pagination.currentPage + 1, initialLimit);
    }
  };

  const checkIfProductIsSaved = (checkProductId: string | number): boolean => {
    if (savingProducts?.has(checkProductId)) {
      return true;
    }

    const isSaved = savedProducts?.some(
      (item) =>
        item.productId === checkProductId ||
        (item.product && item.product.id === checkProductId)
    );
    return isSaved;
  };

  const toggleSaveProduct = async (
    toggleProductId: string | number
  ): Promise<boolean> => {
    const currentlySaved = checkIfProductIsSaved(toggleProductId);

    try {
      if (currentlySaved) {
        setSavedProducts((prev) => {
          const newSavedProduct = prev.filter(
            (item) =>
              item.productId !== toggleProductId &&
              (!item.product || item.product.id !== toggleProductId)
          );

          return newSavedProduct;
        });

        if (savingProducts.has(toggleProductId)) {
          setSavingProducts((prev) => {
            const newSet = new Set(prev);
            newSet.delete(toggleProductId);
            return newSet;
          });
        }

        await productService.unsaveProduct(toggleProductId);
        return false;
      } else {
        setSavingProducts((prev) => {
          const newSet = new Set(prev);
          newSet.add(toggleProductId);
          return newSet;
        });

        await productService.saveProduct(toggleProductId);

        await refreshSavedProducts();

        setSavingProducts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(toggleProductId);
          return newSet;
        });

        return true;
      }
    } catch (error: any) {
      setError(error.message || "Failed to toggle saved status");

      if (!currentlySaved) {
        setSavingProducts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(toggleProductId);
          return newSet;
        });
      } else {
        refreshSavedProducts();
      }

      return currentlySaved;
    }
  };

  useEffect(() => {
    if (isLoggedIn && user) {
      fetchSavedProducts();
    }
  }, []);

  return {
    savedProducts,
    loading,
    error,
    pagination,
    refreshSavedProducts,
    loadMoreSavedProducts,
    checkIfProductIsSaved,
    toggleSaveProduct,
  };
}
