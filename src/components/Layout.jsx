import ThemeToggle from "./ThemeToggle";

function Layout({ children }) {
  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-violet-50
        via-white
        to-purple-100

        dark:from-slate-950
        dark:via-slate-900
        dark:to-slate-800

        transition-colors
        duration-300

        px-3
        py-4
        sm:px-4
        md:px-8
        md:py-8
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-6xl

          rounded-3xl

          bg-white
          dark:bg-slate-900

          border
          border-gray-100
          dark:border-slate-700

          shadow-xl

          p-4
          sm:p-6
          md:p-10
        "
      >
        {/* Theme Toggle */}
        <div className="mb-6 flex justify-end">
          <ThemeToggle />
        </div>

        {children}
      </div>
    </div>
  );
}

export default Layout;