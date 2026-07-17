function EmptyState({ title, description, icon = "📭" }) {
  return (
    <div className="py-16 text-center">
      <div className="mb-5 text-6xl">{icon}</div>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h2>
      <p className="mt-3 leading-7 text-gray-500 dark:text-slate-400">{description}</p>
    </div>
  );
}

export default EmptyState;