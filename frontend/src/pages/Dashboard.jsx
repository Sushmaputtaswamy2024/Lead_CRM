import { useEffect, useState, useRef } from "react";
import api from "../api/client";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    totalLeads: 0,
    interested: 0,
    converted: 0,
    todayLeads: 0,
    todayFollowUps: 0,
    pendingFollowUps: 0,
  });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  /* ================= LOAD DASHBOARD SUMMARY ================= */
  useEffect(() => {
    let isMounted = true;

    const loadSummary = async () => {
      try {
        const res = await api.get("/api/leads/dashboard-summary");

        if (isMounted && res.data) {
          setSummary({
            totalLeads: res.data.totalLeads || 0,
            interested: res.data.interested || 0,
            converted: res.data.converted || 0,
            todayLeads: res.data.todayLeads || 0,
            todayFollowUps: res.data.todayFollowUps || 0,
            pendingFollowUps: res.data.pendingFollowUps || 0,
          });
        }
      } catch (err) {
        console.error("Dashboard summary error:", err);
      }
    };

    loadSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ================= CALCULATIONS ================= */
  const conversionRate =
    summary.totalLeads > 0
      ? Math.round((summary.converted / summary.totalLeads) * 100)
      : 0;

  const interestedRate =
    summary.totalLeads > 0
      ? Math.round((summary.interested / summary.totalLeads) * 100)
      : 0;

  /* ================= FILE IMPORT ================= */
  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/api/leads/upload-justdial", formData);

      alert("JustDial leads imported successfully 🚀");

      // Reload summary after upload
      const res = await api.get("/api/leads/dashboard-summary");
      setSummary(res.data);

      navigate("/leads");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed ❌");
    }
  };

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <div className="dashboard-header">
        <h2 className="page-title">Dashboard Overview</h2>

        <button className="import-btn" onClick={handleImportClick}>
          Import JustDial PDF
        </button>

        <input
          type="file"
          accept="pdf,.xlsx,.xls"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      {/* KPI CARDS */}
      <div className="dashboard-cards">
        <div
          className="dash-card blue clickable-card"
          onClick={() => navigate("/leads")}
        >
          <p>Total Leads</p>
          <h1>{summary.totalLeads}</h1>
        </div>

        <div
          className="dash-card orange clickable-card"
          onClick={() => navigate("/leads?status=Interested")}
        >
          <p>Interested</p>
          <h1>{summary.interested}</h1>
        </div>

        <div
          className="dash-card purple clickable-card"
          onClick={() => navigate("/leads?status=Converted")}
        >
          <p>Converted</p>
          <h1>{summary.converted}</h1>
        </div>

        <div
          className="dash-card green clickable-card"
          onClick={() => navigate("/leads?today=true")}
        >
          <p>Today Leads</p>
          <h1>{summary.todayLeads}</h1>
        </div>

        <div
          className="dash-card teal clickable-card"
          onClick={() => navigate("/follow-ups?filter=today")}
        >
          <p>Today Follow-Ups</p>
          <h1>{summary.todayFollowUps}</h1>
        </div>

        <div
          className="dash-card red clickable-card"
          onClick={() => navigate("/follow-ups?filter=pending")}
        >
          <p>Pending Follow-Ups</p>
          <h1>{summary.pendingFollowUps}</h1>
        </div>
      </div>

      {/* LOWER GRID */}
      <div className="dashboard-grid-3">
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
                {summary.totalLeads - summary.converted}
              </strong>
            </li>
          </ul>
        </div>

        <div className="dashboard-panel">
          <h3>Follow-Up Health</h3>
          <div className="health-item">
            <span>Today Follow-Ups</span>
            <strong>{summary.todayFollowUps}</strong>
          </div>
          <div className="health-item">
            <span>Pending Follow-Ups</span>
            <strong className="danger">
              {summary.pendingFollowUps}
            </strong>
          </div>
        </div>

        <div className="dashboard-panel">
          <h3>System Snapshot</h3>
          <div className="snapshot">
            <p>
              Total Active Leads: <strong>{summary.totalLeads}</strong>
            </p>
            <p>
              Converted Leads: <strong>{summary.converted}</strong>
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