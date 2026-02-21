import { useEffect, useState } from "react";
import api from "../api/client";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LeadDetails.css";

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [lead, setLead] = useState(null);
  const [followUps, setFollowUps] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const followupsPerPage = 5;

  useEffect(() => {
    let activeSessionId = null;

    const fetchDataAndStartSession = async () => {
      try {
        const leadRes = await api.get(
          `/leads/${id}`
        );
        setLead(leadRes.data.lead);

        const followRes = await api.get(
          `/leads/${id}/followups`
        );
        setFollowUps(followRes.data.followUps || []);

        if (user?.email) {
          const sessionRes = await api.post(
            "/reports/start-session",
            {
              lead_id: id,
              user_email: user.email,
              user_role: user.role,
            }
          );

          activeSessionId = sessionRes.data.sessionId;
        }
      } catch (err) {
        console.error("Lead details error:", err);
      }
    };

    fetchDataAndStartSession();

    return () => {
      if (activeSessionId) {
        api.post("/reports/end-session", {
          session_id: activeSessionId,
        });
      }
    };
  }, [id, user]);

  if (!lead) return <p>Loading...</p>;

  const todayDate = new Date().toISOString().slice(0, 10);

  const todayCount = followUps.filter(
    (f) => f.next_followup && f.next_followup.slice(0, 10) === todayDate
  ).length;

  const pendingCount = followUps.filter(
    (f) => f.next_followup && f.next_followup.slice(0, 10) < todayDate
  ).length;

  const totalCount = followUps.length;

  const indexOfLast = currentPage * followupsPerPage;
  const indexOfFirst = indexOfLast - followupsPerPage;
  const currentFollowUps = followUps.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(followUps.length / followupsPerPage);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN");
  };

  const designCount = lead.designs_sent ?? 0;

  return (
    <div className="lead-details-page">

      <div className="details-header">
        <h2>Lead Details</h2>

        <button
          className="edit-btn"
          onClick={() => navigate(`/leads/edit/${lead.id}`)}
        >
          Edit Lead
        </button>
      </div>

      <div className="lead-info">

        <p><b>Name:</b> {lead.name}</p>
        <p><b>Phone:</b> {lead.phone}</p>
        <p><b>WhatsApp:</b> {lead.whatsapp}</p>
        <p><b>Email:</b> {lead.email || "-"}</p>
        <p><b>City:</b> {lead.city || "-"}</p>
        <p><b>Status:</b> {lead.status}</p>
        <p><b>Call Status:</b> {lead.call_status || "-"}</p>
        <p><b>Building Type:</b> {lead.building_type || "-"}</p>
        <p><b>Floors:</b> {lead.floors || "-"}</p>
        <p><b>Measurement:</b> {lead.measurement || "-"}</p>
        <p><b>Sqft:</b> {lead.sqft || "-"}</p>
        <p><b>Budget:</b> {lead.budget || "-"}</p>
        <p><b>Assigned To:</b> {lead.assigned_to || "-"}</p>
        <p><b>Quotation Sent:</b> {lead.quotation_sent || "-"}</p>

        {/* ⭐ DESIGNS SENT VISUAL BADGE */}
        <p>
          <b>Designs Sent:</b>{" "}
          <span
            className={
              designCount > 0
                ? "design-count-badge active"
                : "design-count-badge zero"
            }
          >
            {designCount}
          </span>
        </p>

        <p><b>Project Start:</b> {formatDate(lead.project_start)}</p>
        <p><b>Snooze Until:</b> {formatDate(lead.snooze_until)}</p>
        <p><b>Description:</b> {lead.description || "-"}</p>
      </div>

      <h3>Follow Ups</h3>

      <div className="followup-summary">
        <div className="summary-card today">
          <p>Today</p>
          <h1>{todayCount}</h1>
        </div>

        <div className="summary-card pending">
          <p>Pending</p>
          <h1>{pendingCount}</h1>
        </div>

        <div className="summary-card total">
          <p>Total</p>
          <h1>{totalCount}</h1>
        </div>
      </div>

      {totalCount === 0 && (
        <p className="empty">No follow-ups for this lead.</p>
      )}

      {currentFollowUps.map((f) => (
        <div key={f.id} className="followup-item">
          <p><b>Note:</b> {f.note}</p>
          <p><b>Status:</b> {f.status}</p>
          <p><b>Next Followup:</b> {formatDate(f.next_followup)}</p>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
