import { useEffect, useState } from "react";
import axios from "axios";
import "./FollowUps.css";

export default function FollowUps() {
  const [today, setToday] = useState([]);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const todayRes = await axios.get(
          "http://13.233.XXX.XXX:5000/api/leads/followups/today"
        );

        const pendingRes = await axios.get(
          "http://13.233.XXX.XXX:5000/api/leads/followups/pending"
        );

        setToday(todayRes.data.todayFollowUps || []);
        setPending(pendingRes.data.pendingFollowUps || []);
      } catch (err) {
        console.error("Followups fetch error:", err);
      }
    }

    fetchData();
  }, []);

  const total = today.length + pending.length;

  return (
    <div className="followups-page">
      <h2 className="page-title">Follow Ups</h2>

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

      <div className="followup-grid">
        <div className="followup-column">
          <h3>Today Follow Ups</h3>

          {today.length === 0 ? (
            <p className="empty">No follow-ups today.</p>
          ) : (
            today.map(f => (
              <div key={f.id} className="task-card">
                <div>
                  <h4>{f.name}</h4>
                  <p>{f.phone}</p>
                  <p>{f.note}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="followup-column">
          <h3>Pending Follow Ups</h3>

          {pending.length === 0 ? (
            <p className="empty">No pending follow-ups.</p>
          ) : (
            pending.map(f => (
              <div key={f.id} className="task-card">
                <div>
                  <h4>{f.name}</h4>
                  <p>{f.phone}</p>
                  <p>{f.note}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
