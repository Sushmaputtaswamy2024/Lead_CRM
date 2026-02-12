import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

export default function Dashboard() {
  const [summary, setSummary] = useState({});

  useEffect(() => {
    axios
      .get("http://13.233.XXX.XXX:5000/api/leads/dashboard-summary")
      .then(res => setSummary(res.data))
      .catch(console.error);
  }, []);

  const conversionRate =
    summary.totalLeads > 0
      ? Math.round((summary.converted / summary.totalLeads) * 100)
      : 0;

  const interestedRate =
    summary.totalLeads > 0
      ? Math.round((summary.interested / summary.totalLeads) * 100)
      : 0;

  return (
    <div className="dashboard-page">
      <h2 className="page-title">Dashboard Overview</h2>

      {/* ================= KPI CARDS ================= */}
      <div className="dashboard-cards">
        <div className="dash-card blue">
          <p>Total Leads</p>
          <h1>{summary.totalLeads || 0}</h1>
        </div>

        <div className="dash-card green">
          <p>Today Leads</p>
          <h1>{summary.todayLeads || 0}</h1>
        </div>

        <div className="dash-card orange">
          <p>Interested</p>
          <h1>{summary.interested || 0}</h1>
        </div>

        <div className="dash-card purple">
          <p>Converted</p>
          <h1>{summary.converted || 0}</h1>
        </div>

        <div className="dash-card teal">
          <p>Today Follow-Ups</p>
          <h1>{summary.todayFollowUps || 0}</h1>
        </div>

        <div className="dash-card red">
          <p>Pending Follow-Ups</p>
          <h1>{summary.pendingFollowUps || 0}</h1>
        </div>
      </div>

      {/* ================= LOWER GRID ================= */}
      <div className="dashboard-grid-3">

        {/* PERFORMANCE PANEL */}
        <div className="dashboard-panel">
          <h3>Performance Insights</h3>
          <ul className="stats-list">
            <li>
              <span>Conversion Rate</span>
              <strong>{conversionRate}%</strong>
            </li>
            <li>
              <span>Interested Ratio</span>
              <strong>{interestedRate}%</strong>
            </li>
            <li>
              <span>Pending Leads</span>
              <strong>
                {(summary.totalLeads || 0) - (summary.converted || 0)}
              </strong>
            </li>
          </ul>
        </div>

        {/* FOLLOW-UP HEALTH */}
        <div className="dashboard-panel">
          <h3>Follow-Up Health</h3>
          <div className="health-item">
            <span>Today Follow-Ups</span>
            <strong>{summary.todayFollowUps || 0}</strong>
          </div>
          <div className="health-item">
            <span>Pending Follow-Ups</span>
            <strong className="danger">
              {summary.pendingFollowUps || 0}
            </strong>
          </div>
        </div>

        {/* SYSTEM STATUS */}
        <div className="dashboard-panel">
          <h3>System Snapshot</h3>
          <div className="snapshot">
            <p>
              Total Active Leads:{" "}
              <strong>{summary.totalLeads || 0}</strong>
            </p>
            <p>
              Converted Leads:{" "}
              <strong>{summary.converted || 0}</strong>
            </p>
            <p>
              Engagement Level:{" "}
              <strong>
                {conversionRate > 30 ? "Strong" : "Moderate"}
              </strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
