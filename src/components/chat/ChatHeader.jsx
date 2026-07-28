import { ArrowLeft } from "lucide-react";
import { formatLastSeen } from "../../utils/lastSeen";

export default function ChatHeader({
  conversationCode,
  status = "open",
  founderOnline = false,
  founderLastSeen = null,
  onBack,
}) {
  const statusText =
  status === "closed"
    ? "Conversation Closed"
    : founderOnline
      ? "Founder is online"
      : formatLastSeen(founderLastSeen);

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-900/90">
      <div className="mx-auto flex h-16 max-w-3xl items-center gap-4 px-4">

        <button
          onClick={onBack}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-700 text-lg font-bold text-white">
          💜

          <span
            className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900 ${
              founderOnline
                ? "bg-emerald-500 animate-pulse"
                : "bg-gray-400"
            }`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-semibold text-gray-900 dark:text-white">
            Safe Space
          </h2>

          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                founderOnline
                  ? "bg-emerald-500 animate-pulse"
                  : "bg-gray-400"
              }`}
            />

            <span className="truncate text-xs text-gray-500 dark:text-gray-400">
              {statusText}
            </span>
          </div>
        </div>

        <div className="hidden rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 sm:block">
          {conversationCode}
        </div>

      </div>
    </header>
  );
}