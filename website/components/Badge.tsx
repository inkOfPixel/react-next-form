import React from "react";

export interface BadgeProps {
  color: string;
}

export default function Badge({
  children,
  color,
}: React.PropsWithChildren<BadgeProps>) {
  return (
    <span
      style={{
        backgroundColor: color,
        borderRadius: "100px",
        color: "#fff",
        padding: "0.2rem 0.6rem",
        lineHeight: "100%",
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}
