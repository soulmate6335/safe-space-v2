function Modal({
  children,
  onClose,
}) {
  return (
    <div
      className="
        fixed
        inset-0
        bg-black/40
        flex
        items-center
        justify-center
        z-50
        p-4
      "
    >
      <div
        className="
          bg-white
          rounded-2xl
          shadow-2xl
          max-w-xl
          w-full
          p-6
          relative
        "
      >
        <button
          onClick={onClose}
          className="
            absolute
            top-4
            right-4
            text-gray-500
            hover:text-black
          "
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}

export default Modal;