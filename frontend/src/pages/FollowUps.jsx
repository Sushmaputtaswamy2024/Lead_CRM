import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./FollowUps.css";

export default function FollowUps() {
  const [today, setToday] = useState([]);
  const [pending, setPending] = useState([]);
  const location = useLocation();

  // Refs for smooth scrolling
  const todayRef = useRef(null);
  const pendingRef = useRef(null);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    async function fetchData() {
      try {
        const todayRes = await axios.get(
          "/api/leads/followups/today"
        );

        const pendingRes = await axios.get(
          "/api/leads/followups/pending"
        );

        setToday(todayRes.data.todayFollowUps || []);
        setPending(pendingRes.data.pendingFollowUps || []);
      } catch (err) {
        console.error("Followups fetch error:", err);
      }
    }

    fetchData();
  }, []);

  /* ================= HANDLE DASHBOARD FILTER ================= */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get("filter");

    if (filter === "today" && todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: "smooth" });
    }

    if (filter === "pending" && pendingRef.current) {
      pendingRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.search]);

  const total = today.length + pending.length;

  return (
    <div className="followups-page">
      <h2 className="page-title">Follow Ups</h2>

      {/* ================= SUMMARY CARDS ================= */}
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

      {/* ================= FOLLOWUP GRID ================= */}
      <div className="followup-grid">
        
        {/* TODAY COLUMN */}
        <div className="followup-column" ref={todayRef}>
          <h3>Today Follow Ups</h3>

          {today.length === 0 ? (
            <p className="empty">No follow-ups today.</p>
          ) : (
            today.map((f) => (
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

        {/* PENDING COLUMN */}
        <div className="followup-column" ref={pendingRef}>
          <h3>Pending Follow Ups</h3>

          {pending.length === 0 ? (
            <p className="empty">No pending follow-ups.</p>
          ) : (
            pending.map((f) => (
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
