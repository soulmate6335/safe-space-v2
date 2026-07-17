function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm transition-all duration-300 dark:border-slate-700 dark:bg-slate-900/90 ${className}`}>
      {children}
    </div>
  );
}

export default Card;