import React from "react";

export default function InternalUseBanner() {
  return (
    <div
      style={{
        border: "1.5px solid #dc2626",
        background: "#fef2f2",
        color: "#b91c1c",
        padding: "10px 16px",
        fontSize: "15px",
        fontWeight: 400,
        boxSizing: "border-box",
        textAlign: "left",
        borderRadius: "8px 8px 0 0",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
        lineHeight: 1.5,
        width: "100%",
        marginBottom: "0", // Since the chat box may have its own border-radius.
      }}
      aria-label="Internal use only warning"
    >
      <strong>INTERNAL USE ONLY:</strong> Not to be shared outside of Guardant.
    </div>
  );
}