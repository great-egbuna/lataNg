import { useState, useEffect } from "react";
import { feedbackService } from "@/services/feedback.service";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";

export function useFeedbacks(params: {
  type: "SUPPORT" | "PRODUCT";
  tab?: "sent" | "received";
  initialPage?: number;
  limit?: number;
}) {
  const {
    type = "PRODUCT",
    tab = "received",
    initialPage = 1,
    limit = 10,
  } = params;
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    lastPage: 1,
    total: 0,
    isEmpty: true,
    totalReceived: 0,
    totalSent: 0,
  });

  const { isLoggedIn } = useAuth() as IAUTH;

  const fetchFeedbacks = async (page = initialPage) => {
    if (!isLoggedIn) {
      setLoading(false);
      setError("You must be logged in to view feedbacks");
      return;
    }

    if (!type) {
      setLoading(false);
      setError("Feedback type is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await feedbackService.getFeedbacks({
        page,
        limit,
        type,
        tab,
      });

      if (response instanceof Error) {
        setError(response.message);
        return;
      }

      setFeedbacks((prev) =>
        page === 1 ? response.data : [...prev, ...response.data]
      );

      setPagination({
        currentPage: response.meta.current_page,
        lastPage: response.meta.last_page,
        total: response.meta.total,
        isEmpty: response.isEmpty,
        totalReceived: response.totalReceived || 0,
        totalSent: response.totalSent || 0,
      });
    } catch (err: any) {
      setError(err.message || "Failed to fetch feedbacks");
    } finally {
      setLoading(false);
    }
  };

  const refreshFeedbacks = () => fetchFeedbacks(1);

  const loadMoreFeedbacks = () => {
    if (pagination.currentPage < pagination.lastPage && !loading) {
      fetchFeedbacks(pagination.currentPage + 1);
    }
  };

  // Change tab (sent/received) for PRODUCT type feedbacks
  const changeTab = async (newTab: "sent" | "received") => {
    if (tab !== newTab) {
      setFeedbacks([]);
      await fetchFeedbacks(1);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchFeedbacks();
    })();
  }, [type, tab]);

  return {
    feedbacks,
    loading,
    error,
    pagination,
    refreshFeedbacks,
    loadMoreFeedbacks,
    changeTab,
  };
}


