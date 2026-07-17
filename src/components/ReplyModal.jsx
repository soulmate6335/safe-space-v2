import { useState } from "react";
import Button from "./ui/Button";

function ReplyModal({ message, onClose, onReply }) {
  const [reply, setReply] = useState(message?.admin_reply || "");
  const alreadyReplied = Boolean(message?.admin_reply);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="border-b border-gray-200 p-6 dark:border-slate-700">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Anonymous Message</h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                Conversation: <span className="font-mono font-semibold text-violet-600 dark:text-violet-400">{message?.conversation_code}</span>
              </p>
              <p className="mt-1 text-sm text-gray-400 dark:text-slate-500">
                {message?.created_at ? new Date(message.created_at).toLocaleString() : "Unknown date"}
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Close reply modal"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400">Message</p>
          <div className="rounded-2xl bg-violet-50 p-5 leading-8 text-gray-700 dark:bg-violet-950/30 dark:text-slate-300">
            {message?.text}
          </div>
        </div>

        <div className="px-6 pb-6">
          <label className="mb-3 block text-sm font-semibold text-gray-700 dark:text-slate-300">
            {alreadyReplied ? "Your Reply" : "Write a Compassionate Reply"}
          </label>

          <textarea
            rows={7}
            disabled={alreadyReplied}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write a thoughtful and compassionate response..."
            className="w-full rounded-2xl border border-gray-300 p-4 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 disabled:bg-gray-100 disabled:text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-violet-400 dark:focus:ring-violet-950"
          />

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" className="sm:w-auto" onClick={onClose}>
              {alreadyReplied ? "Close" : "Cancel"}
            </Button>

            {!alreadyReplied && (
              <Button variant="primary" className="sm:w-auto" onClick={() => onReply(reply)} disabled={!reply.trim()}>
                Send Reply
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReplyModal;