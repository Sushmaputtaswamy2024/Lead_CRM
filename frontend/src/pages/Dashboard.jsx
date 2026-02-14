import { useRef, useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [summary, setSummary] = useState({});
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/leads/dashboard-summary")
      .then((res) => setSummary(res.data))
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

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        "http://localhost:5000/api/leads/upload-justdial",
        formData,
      );

      alert("JustDial leads imported successfully 🚀");
      window.location.href = "/leads";

      const res = await axios.get(
        "http://localhost:5000/api/leads/dashboard-summary",
      );
      setSummary(res.data);
    } catch (err) {
      console.error(err);
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
          <h1>{summary.totalLeads || 0}</h1>
        </div>

        <div
          className="dash-card orange clickable-card"
          onClick={() => navigate("/leads?status=Interested")}
        >
          <p>Interested</p>
          <h1>{summary.interested || 0}</h1>
        </div>

        <div
          className="dash-card purple clickable-card"
          onClick={() => navigate("/leads?status=Converted")}
        >
          <p>Converted</p>
          <h1>{summary.converted || 0}</h1>
        </div>

        <div
          className="dash-card green clickable-card"
          onClick={() => navigate("/leads?today=true")}
        >
          <p>Today Leads</p>
          <h1>{summary.todayLeads || 0}</h1>
        </div>

        <div
          className="dash-card teal clickable"
          onClick={() => navigate("/follow-ups?filter=today")}
        >
          <p>Today Follow-Ups</p>
          <h1>{summary.todayFollowUps || 0}</h1>
        </div>

        <div
          className="dash-card red clickable"
          onClick={() => navigate("/follow-ups?filter=pending")}
        >
          <p>Pending Follow-Ups</p>
          <h1>{summary.pendingFollowUps || 0}</h1>
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
                {(summary.totalLeads || 0) - (summary.converted || 0)}
              </strong>
            </li>
          </ul>
        </div>

        <div className="dashboard-panel">
          <h3>Follow-Up Health</h3>
          <div className="health-item">
            <span>Today Follow-Ups</span>
            <strong>{summary.todayFollowUps || 0}</strong>
          </div>
          <div className="health-item">
            <span>Pending Follow-Ups</span>
            <strong className="danger">{summary.pendingFollowUps || 0}</strong>
          </div>
        </div>

        <div className="dashboard-panel">
          <h3>System Snapshot</h3>
          <div className="snapshot">
            <p>
              Total Active Leads: <strong>{summary.totalLeads || 0}</strong>
            </p>
            <p>
              Converted Leads: <strong>{summary.converted || 0}</strong>
            </p>
            <p>
              Engagement Level:{" "}
              <strong>{conversionRate > 30 ? "Strong" : "Moderate"}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
