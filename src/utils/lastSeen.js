export function formatLastSeen(dateString) {
  if (!dateString) return "Offline";

  const date = new Date(dateString);
  const diff = Date.now() - date.getTime();

  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) {
    return "Last seen just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `Last seen ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `Last seen ${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === yesterday.toDateString()) {
    return `Last seen yesterday at ${date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  }

  return `Last seen ${date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  })} at ${date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}