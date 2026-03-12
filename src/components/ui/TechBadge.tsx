interface TechBadgeProps {
  name: string;
  small?: boolean;
}

export default function TechBadge({ name, small }: TechBadgeProps) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: small ? "3px 10px" : "4px 12px",
        borderRadius: "999px",
        border: "1px solid var(--border)",
        color: "var(--text-secondary)",
        fontSize: small ? "11px" : "12px",
        fontFamily: "var(--font-mono)",
        background: "var(--bg-tertiary)",
        whiteSpace: "nowrap",
      }}
    >
      {name}
    </span>
  );
}
