import React from "react";
import { useNavigate } from "react-router-dom";

export default function ChecklistCard({ checklist, onDelete }) {
  const navigate = useNavigate();

  const cardStyle = {
    backgroundColor: "#fff",
    padding: "16px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const buttonStyle = {
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginLeft: "6px",
  };

  return (
    <div style={cardStyle}>
      <div>
        <h3 style={{ margin: 0 }}>{checklist.name}</h3>
      </div>
      <div>
        <button
          onClick={() => navigate(`/checklist/${checklist.id}`)}
          style={{ ...buttonStyle, backgroundColor: "#007bff", color: "#fff" }}
        >
          Detail
        </button>
        <button
          onClick={() => onDelete(checklist.id)}
          style={{ ...buttonStyle, backgroundColor: "#dc3545", color: "#fff" }}
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
