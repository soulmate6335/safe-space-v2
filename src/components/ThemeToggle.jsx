import { useTheme } from "../hooks/useTheme";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="
        rounded-xl
        border
        border-gray-300
        bg-white
        px-4
        py-2
        text-sm
        shadow-sm
        dark:border-slate-600
        dark:bg-slate-800
        dark:text-white
      "
    >
      <option value="light">☀️ Light</option>
      <option value="dark">🌙 Dark</option>
      <option value="system">💻 System</option>
    </select>
  );
}

export default ThemeToggle;