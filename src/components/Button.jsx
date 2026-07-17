import { theme } from "../styles/theme";

function Button({
  children,
  onClick,
  disabled = false,
  type = "button",
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        width: "100%",
        padding: "15px",
        border: "none",
        borderRadius: theme.radius.xl,
        background: disabled
          ? "#ccc"
          : `linear-gradient(135deg, ${theme.colors.primary}, #C9A4D9)`,

        color: "#fff",
        fontSize: "16px",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: ".25s",
      }}
    >
      {children}
    </button>
  );
}

export default Button;