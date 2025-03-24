export const truncateString = (text: string) => {
  const truncatedString = text?.length > 15 ? `${text?.slice(0, 15)}...` : text;

  return truncatedString;
};

export const objectToFormData = (obj: Record<string, any>) => {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return formData;
};

export const formatRelativeTime = (createdAt: string) => {
  if (!createdAt) return "";

  const now = new Date();
  const created = new Date(createdAt);
  const diffInSeconds = Math.floor((now.getTime() - created.getTime() ) / 1000);

  // Handle invalid dates
  if (isNaN(diffInSeconds) || diffInSeconds < 0) {
    return "";
  }

  // Less than a minute
  if (diffInSeconds < 60) {
    return "just now";
  }

  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  // Less than a week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  // Less than a month (approximately)
  if (diffInSeconds < 2629746) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }

  // Less than a year
  if (diffInSeconds < 31556952) {
    const months = Math.floor(diffInSeconds / 2629746);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }

  // More than a year
  const years = Math.floor(diffInSeconds / 31556952);
  return `${years} ${years === 1 ? "year" : "years"} ago`;
}
