import { useEffect, useState } from "react";
import {
  fetchTodayFollowUps,
  fetchPendingFollowUps
} from "../api/leads";
import "./FollowUps.css";

export default function FollowUps() {
  const [today, setToday] = useState([]);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    fetchTodayFollowUps()
      .then(res => setToday(res.data.followUps || []))
      .catch(console.error);

    fetchPendingFollowUps()
      .then(res => setPending(res.data.pendingFollowUps || []))
      .catch(console.error);
  }, []);

  const total = today.length + pending.length;

  return (
    <div className="followups-page">
      <h2 className="page-title">Follow Ups</h2>

      {/* ===== SUMMARY CARDS ===== */}
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

      {/* ===== FOLLOW UPS GRID ===== */}
      <div className="followup-grid">
        {/* TODAY COLUMN */}
        <div className="followup-column">
          <h3>Today Follow Ups</h3>

          {today.length === 0 ? (
            <p className="empty">No follow-ups today.</p>
          ) : (
            today.map(f => (
              <div key={f.followup_id} className="task-card">
                <div className="task-info">
                  <h4>{f.name}</h4>
                  <p>{f.phone}</p>
                  <p className="note">{f.note}</p>
                </div>
                <span className="badge badge-today">Today</span>
              </div>
            ))
          )}
        </div>

        {/* PENDING COLUMN */}
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
      </div>
    </div>
  );
}
