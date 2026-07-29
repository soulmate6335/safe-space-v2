import { ArrowLeft, Copy } from "lucide-react";
import toast from "react-hot-toast";

export default function ChatHeader({
  conversationCode,
  status = "open",
  onBack,
}) {
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(conversationCode);
      toast.success("Conversation code copied.");
    } catch {
      toast.error("Unable to copy conversation code.");
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-violet-100 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto max-w-3xl px-4 py-3">

        <div className="flex items-center gap-3">

          <button
            onClick={onBack}
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-purple-700 text-lg text-white">
            💜
          </div>

          <div className="flex-1">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Safe Space
            </h2>

            <p className="text-sm text-gray-500 dark:text-slate-400">
              {status === "closed"
                ? "Conversation Closed"
                : "Your conversation is secure and anonymous"}
            </p>
          </div>

        </div>

        <div className="mt-4 rounded-2xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-900 dark:bg-slate-800">

          <p className="text-xs uppercase tracking-wider text-gray-500">
            Conversation Code
          </p>

          <div className="mt-2 flex items-center justify-between gap-3">

            <span className="font-mono text-lg font-bold tracking-widest text-violet-700 dark:text-violet-300 break-all">
              {conversationCode}
            </span>

            <button
              onClick={copyCode}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-700"
            >
              <Copy size={18} />
            </button>

          </div>

        </div>

      </div>
    </header>
  );
}