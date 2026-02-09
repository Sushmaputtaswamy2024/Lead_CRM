import { useEffect, useState } from "react";
import {
  fetchTodayFollowUps,
  fetchPendingFollowUps,
  fetchFollowUpsByLead // ✅ IMPORT FIX
} from "../api/leads";
import "./FollowUps.css";

export default function FollowUps({ leadId }) {
  const [today, setToday] = useState([]);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    if (leadId) {
      // ✅ Lead-specific followups
      fetchFollowUpsByLead(leadId)
        .then(res => {
          const followUps = res.data.followUps || [];
          setToday(followUps);
          setPending([]); // lead page doesn't need pending split
        })
        .catch(console.error);
    } else {
      // ✅ Global Follow Ups page
      fetchTodayFollowUps()
        .then(res => setToday(res.data.followUps || []))
        .catch(console.error);

      fetchPendingFollowUps()
        .then(res => setPending(res.data.pendingFollowUps || []))
        .catch(console.error);
    }
  }, [leadId]);

  const total = today.length + pending.length;

  return (
    <div className="followups-page">
      <h2 className="page-title">Follow Ups</h2>

      {/* SUMMARY */}
      <div className="followup-summary">
        <div className="summary-card today">
          <p>Today</p>
          <h1>{today.length}</h1>
        </div>

        <div className="summary-card pending">
          <p>Pending</p>
          <h1>{pending.length}</h1>
        </div>

        <div className="summary-card total">
          <p>Total</p>
          <h1>{total}</h1>
        </div>
      </div>

      {/* GRID */}
      <div className="followup-grid">
        <div className="followup-column">
          <h3>Follow Ups</h3>

          {today.length === 0 ? (
            <p className="empty">No follow-ups.</p>
          ) : (
            today.map(f => (
              <div key={f.id || f.followup_id} className="task-card">
                <div className="task-info">
                  <h4>{f.name}</h4>
                  <p>{f.phone}</p>
                  <p className="note">{f.note}</p>
                </div>
                <span className="badge badge-today">Follow Up</span>
              </div>
            ))
          )}
        </div>

        {!leadId && (
          <div className="followup-column">
            <h3>Pending Follow Ups</h3>

            {pending.length === 0 ? (
              <p className="empty">No pending follow-ups.</p>
            ) : (
              pending.map(f => (
                <div key={f.followup_id} className="task-card">
                  <div className="task-info">
                    <h4>{f.name}</h4>
                    <p>{f.phone}</p>
                    <p className="note">{f.note}</p>
                  </div>
                  <span className="badge badge-pending">Pending</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
