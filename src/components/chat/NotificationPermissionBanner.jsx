import { useEffect, useState } from "react";

import {
  getNotificationPermission,
  requestNotificationPermission,
} from "../../services/notificationService";

const DISMISSED_KEY =
  "safe-space-notification-prompt-dismissed";

export default function NotificationPermissionBanner() {
  const [visible, setVisible] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const permission = getNotificationPermission();

    const dismissed =
      window.localStorage.getItem(DISMISSED_KEY) ===
      "true";

    if (
      permission === "default" &&
      !dismissed
    ) {
      setVisible(true);
    }
  }, []);

  const hideBanner = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        DISMISSED_KEY,
        "true"
      );
    }

    setVisible(false);
  };

  const handleEnable = async () => {
    try {
      setRequesting(true);

      await requestNotificationPermission();
    } catch (error) {
      console.error(
        "Failed to request notification permission:",
        error
      );
    } finally {
      setRequesting(false);
      hideBanner();
    }
  };

  const handleDismiss = () => {
    hideBanner();
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="mx-auto mt-4 flex w-full max-w-2xl items-center justify-between gap-4 rounded-2xl border border-purple-200 bg-purple-50 px-4 py-3 shadow-sm dark:border-purple-500/20 dark:bg-purple-500/10">
      <div className="flex-1">
        <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
          Enable browser notifications
        </p>

        <p className="mt-1 text-xs text-purple-700 dark:text-purple-300">
          We'll notify you whenever the founder replies,
          even if this tab isn't open.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={handleDismiss}
          className="rounded-full px-3 py-2 text-xs font-medium text-purple-700 transition hover:bg-purple-100 dark:text-purple-300 dark:hover:bg-purple-500/20"
          aria-label="Dismiss notification prompt"
        >
          Not now
        </button>

        <button
          type="button"
          onClick={handleEnable}
          disabled={requesting}
          className="rounded-full bg-purple-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Enable browser notifications"
        >
          {requesting ? "Enabling..." : "Enable"}
        </button>
      </div>
    </div>
  );
}