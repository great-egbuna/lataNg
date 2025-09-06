import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import { notificationService } from "@/services/notification.service";

function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });

  const { user, isLoggedIn } = useAuth() as IAUTH;

  const fetchNotifications = async (page = 1, limit = 1000) => {
    if (!isLoggedIn || !user) return;

    try {
      setLoading(true);
      setError(null);

      const response = await notificationService.getNotifications(page, limit);

      if (response instanceof Error) {
        setError(response?.message);
      }
      setNotifications((prev) =>
        page === 1 ? response.data : [...prev, ...response.data]
      );

      setPagination({
        currentPage: response?.meta?.current_page,
        lastPage: response?.meta?.last_page,
        total: response?.meta?.total,
      });
    } catch (err: any) {
      setError(err?.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const refreshNotifications = () => fetchNotifications(1);

  const loadMoreNotifications = () => {
    if (pagination.currentPage < pagination.lastPage && !loading) {
      fetchNotifications(pagination.currentPage + 1);
    }
  };

  useEffect(() => {
    if (isLoggedIn && user) {
      fetchNotifications();
    }
  }, [isLoggedIn, user]);

  return {
    notifications,
    loading,
    error,
    pagination,
    refreshNotifications,
    loadMoreNotifications,
  };
}

export default useNotifications;
