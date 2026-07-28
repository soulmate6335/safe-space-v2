const isSupported = () =>
  typeof window !== "undefined" &&
  "Notification" in window;

/**
 * Returns the current notification permission.
 *
 * @returns {"granted" | "denied" | "default" | "unsupported"}
 */
export function getNotificationPermission() {
  if (!isSupported()) {
    return "unsupported";
  }

  return Notification.permission;
}

/**
 * Requests notification permission.
 *
 * NOTE:
 * This must be called from a user interaction
 * (button click, tap, etc.).
 *
 * @returns {Promise<"granted" | "denied" | "default" | "unsupported">}
 */
export async function requestNotificationPermission() {
  if (!isSupported()) {
    return "unsupported";
  }

  if (
    Notification.permission === "granted" ||
    Notification.permission === "denied"
  ) {
    return Notification.permission;
  }

  try {
    return await Notification.requestPermission();
  } catch (error) {
    console.error("Notification permission error:", error);
    return Notification.permission;
  }
}

/**
 * Displays a browser notification for a newly received message.
 *
 * @param {Object} params
 * @param {string} params.conversationCode
 * @param {string} params.message
 * @param {Function} [params.onClick]
 *
 * @returns {Notification|null}
 */
export function showNewMessageNotification({
  conversationCode,
  message,
  onClick,
}) {
  if (!isSupported()) {
    return null;
  }

  if (Notification.permission !== "granted") {
    return null;
  }

  const title = conversationCode
    ? `New message · ${conversationCode}`
    : "New message · Safe Space";

  const body =
    message?.trim()
      ? message.length > 120
        ? `${message.slice(0, 117)}…`
        : message
      : "You received a new message.";

  try {
    const notification = new Notification(title, {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: conversationCode
        ? `safe-space-${conversationCode}`
        : "safe-space-message",
      renotify: true,
      silent: false,
    });

    notification.onclick = () => {
      try {
        if (document.visibilityState === "hidden") {
          window.focus();
        }

        onClick?.();
      } finally {
        notification.close();
      }
    };

    // Automatically dismiss after 8 seconds.
    setTimeout(() => {
      notification.close();
    }, 8000);

    return notification;
  } catch (error) {
    console.error("Failed to display notification:", error);
    return null;
  }
}