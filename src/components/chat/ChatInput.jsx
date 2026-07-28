import { useState } from "react";

function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Write your message...",
  onTyping,
}) {
  const [message, setMessage] = useState("");

  async function handleSend() {
    const text = message.trim();

    if (!text || disabled) return;

    setMessage("");

    await onSend(text);
  }

  function handleChange(e) {
    setMessage(e.target.value);

    if (onTyping) {
      onTyping(e.target.value);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex items-end gap-3">
      <textarea
        rows={2}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className="
          flex-1
          rounded-2xl
          border
          border-gray-300
          p-4
          resize-none
          outline-none
          dark:bg-slate-800
          dark:border-slate-700
          dark:text-white
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      />

      <button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="
          px-6
          py-3
          rounded-2xl
          bg-violet-600
          text-white
          hover:bg-violet-700
          transition
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        {disabled ? "..." : "Send"}
      </button>
    </div>
  );
}

export default ChatInput;