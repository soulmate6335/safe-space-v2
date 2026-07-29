import { useEffect, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";

function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Write your message...",
  onTyping,
}) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "0px";
    textareaRef.current.style.height = `${Math.min(
      textareaRef.current.scrollHeight,
      180
    )}px`;
  }, [message]);

  async function handleSend() {
    const text = message.trim();

    if (!text || disabled) return;

    setMessage("");

    await onSend(text);

    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "56px";
      }
    });
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
    <div className="flex items-end gap-3 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">

      <textarea
        ref={textareaRef}
        rows={1}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className="
          max-h-[180px]
          min-h-[56px]
          flex-1
          resize-none
          overflow-y-auto
          rounded-2xl
          border
          border-slate-200
          bg-slate-50
          px-4
          py-4
          text-[15px]
          leading-6
          outline-none
          transition
          focus:border-violet-500
          focus:bg-white
          focus:ring-4
          focus:ring-violet-100
          dark:border-slate-700
          dark:bg-slate-800
          dark:text-white
          dark:focus:bg-slate-800
          dark:focus:ring-violet-900/40
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      />

      <button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="
          flex
          h-14
          w-14
          shrink-0
          items-center
          justify-center
          rounded-2xl
          bg-gradient-to-r
          from-violet-600
          to-purple-700
          text-white
          shadow-lg
          shadow-violet-300/30
          transition-all
          duration-200
          hover:scale-105
          hover:shadow-xl
          active:scale-95
          disabled:cursor-not-allowed
          disabled:scale-100
          disabled:opacity-50
          dark:shadow-violet-900/30
        "
      >
        {disabled ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <SendHorizontal size={22} />
        )}
      </button>

    </div>
  );
}

export default ChatInput;