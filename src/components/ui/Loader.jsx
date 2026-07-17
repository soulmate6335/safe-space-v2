function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center gap-5 py-12">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600"></div>
      <p className="text-gray-500 dark:text-slate-400">{text}</p>
    </div>
  );
}

export default Loader;