function TextArea({ value, onChange, placeholder, rows = 6, maxLength, className = "", ...props }) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400 ${className}`}
      {...props}
    />
  );
}

export default TextArea;