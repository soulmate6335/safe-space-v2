function StatCard({
  title,
  value,
  color = "violet",
}) {
  const colors = {
    violet: "from-violet-600 to-purple-700",
    amber: "from-amber-500 to-orange-500",
    green: "from-emerald-500 to-green-600",
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white/95 p-4 shadow-sm backdrop-blur-sm sm:p-6 dark:border-slate-700 dark:bg-slate-900/90">
      <div className={`mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r ${colors[color]} text-base font-semibold text-white shadow-lg sm:h-12 sm:w-12 sm:text-lg`}>
        {value}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
        {value}
      </h2>

      <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-slate-400">
        {title}
      </p>
    </div>
  );
}

export default StatCard;