import { useEffect, useState, useRef } from "react";
import api from "../api/client";
import { useLocation } from "react-router-dom";
import "./FollowUps.css";

export default function FollowUps() {
  const [today, setToday] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const todayRef = useRef(null);
  const pendingRef = useRef(null);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const todayRes = await api.get("/api/leads/followups/today");
        const pendingRes = await api.get("/api/leads/followups/pending");

        if (isMounted) {
          setToday(todayRes.data.todayFollowUps || []);
          setPending(pendingRes.data.pendingFollowUps || []);
        }
      } catch (err) {
        console.error("Followups fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
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

  if (loading) return <p className="loading">Loading follow-ups...</p>;

  return (
    <div className="followups-page">
      <h2 className="page-title">Follow Ups</h2>

      {/* SUMMARY CARDS */}
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
        {/* TODAY */}
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

        {/* PENDING */}
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