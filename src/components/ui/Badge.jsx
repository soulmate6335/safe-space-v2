function Badge({ status }) {
  const styles = {
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
    replied: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {status === "pending" ? "🟡 Pending" : "✅ Replied"}
    </span>
  );
}

export default Badge;