import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./LeadTable.css";

export default function LeadTable({ leads }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!leads || leads.length === 0) {
    return <p className="empty">No leads found.</p>;
  }

  const handleReassign = async (leadId) => {
    const newAssignee = prompt(
      "Enter email to reassign (vindiainfrasec@bda1 or vindiainfrasec@bda2):"
    );

    if (!newAssignee) return;

    try {
      await axios.put(`/api/leads/${leadId}/reassign`, {
        assigned_to: newAssignee,
      });

      alert("Lead reassigned successfully ✅");
      window.location.reload();
    } catch (err) {
      console.error("Reassign error:", err);
      alert("Reassign failed ❌");
    }
  };

  const handlePermanentDelete = async (leadId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this lead?"
    );

    if (!confirmDelete) return;

    try {
      await axios.put(
        `/api/leads/${leadId}/permanent-delete`
      );

      alert("Lead permanently deleted 🗑");
      window.location.reload();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed ❌");
    }
  };

  return (
    <div className="lead-table-wrapper">
      <table className="lead-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Status</th>
            <th>Source</th>
            <th>Designs Sent</th> {/* ✅ NEW COLUMN */}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td
                className="clickable"
                onClick={() => navigate(`/leads/${lead.id}`)}
              >
                {lead.name}

                {user?.role !== "admin" &&
                  lead.assigned_to === user.email && (
                    <span className="badge-assigned">
                      Assigned to You
                    </span>
                  )}

                {user?.role !== "admin" && !lead.assigned_to && (
                  <span className="badge-unassigned">
                    Unassigned
                  </span>
                )}
              </td>

              <td>{lead.phone}</td>
              <td>{lead.email || "-"}</td>

              <td>
                {lead.status === "JUNK_REQUESTED" ? (
                  <span style={{ color: "#ef4444", fontWeight: "600" }}>
                    Junk Requested
                  </span>
                ) : (
                  lead.status
                )}
              </td>

              <td>
                <span
                  className={`source-badge ${
                    lead.source?.toLowerCase() || ""
                  }`}
                >
                  {lead.source}
                </span>
              </td>

              {/* ✅ DESIGNS SENT COLUMN */}
              <td>
                <span
                  className={
                    lead.designs_sent > 0
                      ? "design-badge active"
                      : "design-badge zero"
                  }
                >
                  {lead.designs_sent ?? 0}
                </span>
              </td>

              <td>
                <div className="action-buttons">
                  <button
                    className="view-btn"
                    onClick={() => navigate(`/leads/${lead.id}`)}
                  >
                    View
                  </button>

                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/leads/edit/${lead.id}`)}
                  >
                    Edit
                  </button>

                  {/* ADMIN JUNK ACTIONS */}
                  {user?.role === "admin" &&
                    lead.status === "JUNK_REQUESTED" && (
                      <>
                        <button
                          style={{
                            background: "#2563eb",
                            color: "white",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "none",
                            cursor: "pointer",
                          }}
                          onClick={() => handleReassign(lead.id)}
                        >
                          Reassign
                        </button>

                        <button
                          style={{
                            background: "#ef4444",
                            color: "white",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "none",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handlePermanentDelete(lead.id)
                          }
                        >
                          Delete
                        </button>
                      </>
                    )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
