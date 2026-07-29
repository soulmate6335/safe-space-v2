import { useEffect } from "react";
import toast from "react-hot-toast";

export default function ConversationCodeModal({
  open,
  conversationCode,
  onContinue,
}) {
  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === "Escape") return;
    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  if (!open) return null;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(conversationCode);
      toast.success("Conversation code copied.");
    } catch {
      toast.error("Unable to copy conversation code.");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-6 py-8 text-center text-white">
          <div className="mb-4 text-5xl">💜</div>

          <h2 className="text-2xl font-bold">
            Message Sent Successfully
          </h2>

          <p className="mt-3 text-sm text-violet-100">
            Save your conversation code. You'll need it whenever you want to check for replies.
          </p>
        </div>

        <div className="px-6 py-8">
          <div className="rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50 p-5 text-center dark:border-violet-700 dark:bg-slate-800">
            <p className="mb-3 text-xs uppercase tracking-widest text-gray-500">
              Conversation Code
            </p>

            <h3 className="break-all font-mono text-3xl font-bold tracking-wider text-violet-700 dark:text-violet-300">
              {conversationCode}
            </h3>
          </div>

          <button
            onClick={copyCode}
            className="mt-6 w-full rounded-xl border border-violet-200 bg-violet-50 px-5 py-3 font-semibold text-violet-700 transition hover:bg-violet-100"
          >
            📋 Copy Code
          </button>

          <button
            onClick={onContinue}
            className="mt-3 w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 px-5 py-3 font-semibold text-white transition hover:opacity-95"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}