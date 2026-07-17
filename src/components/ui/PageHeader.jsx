function PageHeader({
  title,
  subtitle,
  icon = "🌸",
}) {
  return (
    <div className="mb-10 text-center">

      <div className="mb-5 text-5xl sm:text-6xl">
        {icon}
      </div>

      <h1 className="
        text-3xl
        font-bold
        text-gray-900
        sm:text-4xl

        dark:text-white
      ">
        {title}
      </h1>

      {subtitle && (
        <p
          className="
            mx-auto
            mt-4
            max-w-2xl
            text-base
            leading-7
            text-gray-500
            sm:text-lg
            sm:leading-8

            dark:text-slate-300
          "
        >
          {subtitle}
        </p>
      )}

    </div>
  );
}

export default PageHeader;