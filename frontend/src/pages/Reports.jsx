import { useEffect, useState } from "react";
import axios from "axios";
import "./Reports.css";
import { fetchTimePerLead, fetchUserPerformance } from "../api/reports";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#f97316", "#8b5cf6"];

export default function Reports() {
  const [timePerLead, setTimePerLead] = useState([]);
  const [userPerformance, setUserPerformance] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/reports/activity-logs")
      .then(res => setActivityLogs(res.data.data || []))
      .catch(console.error);

    fetchTimePerLead()
      .then(res => setTimePerLead(res.data.data || []))
      .catch(console.error);

    fetchUserPerformance()
      .then(res => setUserPerformance(res.data.data || []))
      .catch(console.error);
  }, []);

  /* ================= METRICS ================= */

  const totalLeads = timePerLead.length;

  const avgMinutes =
    totalLeads === 0
      ? 0
      : Math.round(
          timePerLead.reduce(
            (sum, l) => sum + Number(l.total_minutes || 0),
            0
          ) / totalLeads
        );

  const longPending = timePerLead.filter(
    l => Number(l.total_minutes) > 60 * 24 * 3
  );

  const pieData = userPerformance.map(u => ({
    user_email: u.user_email,
    total_minutes: Number(u.total_minutes)
  }));

  /* ================= EXPORT HANDLERS ================= */

  const downloadFile = async (url, filename) => {
  try {
    const response = await axios.get(url, {
      responseType: "blob"
    });

    const blob = new Blob([response.data]);
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  } catch (error) {
    console.error("Download error:", error);
  }
};

const downloadAllLeads = () => {
  downloadFile(
    "http://localhost:5000/api/leads/export",
    "All_Leads.xlsx"
  );
};

const downloadInterestedLeads = () => {
  downloadFile(
    "http://localhost:5000/api/leads/export?status=Interested",
    "Interested_Leads.xlsx"
  );
};

const downloadReports = () => {
  downloadFile(
    "http://localhost:5000/api/reports/export",
    "Full_Report.xlsx"
  );
};


  return (
    <div className="reports-page">
      <h2>Reports & Analytics</h2>

      {/* ================= EXPORT BUTTONS ================= */}
      <div className="export-buttons">
        <button onClick={downloadAllLeads}>
          Download All Leads Excel
        </button>

        <button onClick={downloadInterestedLeads}>
          Download Interested Leads
        </button>

        <button onClick={downloadReports}>
          Download Full Report
        </button>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="report-cards">
        <div className="report-card blue">
          <p>Total Leads</p>
          <h1>{totalLeads}</h1>
        </div>

        <div className="report-card green">
          <p>Avg Handling Time</p>
          <h1>{avgMinutes} min</h1>
        </div>

        <div className="report-card red">
          <p>High Risk Leads</p>
          <h1>{longPending.length}</h1>
        </div>
      </div>

      {/* ================= CHART GRID ================= */}
      <div className="report-grid">

        {/* BAR CHART */}
        <div className="report-panel">
          <h3>Time Spent Per Lead</h3>

          {timePerLead.length === 0 ? (
            <p className="empty">No activity data</p>
          ) : (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={timePerLead}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total_minutes" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* PIE CHART */}
        <div className="report-panel">
          <h3>User Performance</h3>

          {pieData.length === 0 ? (
            <p className="empty">No user activity</p>
          ) : (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="total_minutes"
                    nameKey="user_email"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label
                  >
                    {pieData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* ================= ACTIVITY LOG TABLE ================= */}
      <div className="report-panel">
        <h3>Lead Activity Logs</h3>

        {activityLogs.length === 0 ? (
          <p className="empty">No activity logs</p>
        ) : (
          <table className="report-table">
            <thead>
              <tr>
                <th>Lead</th>
                <th>User</th>
                <th>Role</th>
                <th>Start</th>
                <th>End</th>
                <th>Duration (min)</th>
              </tr>
            </thead>
            <tbody>
              {activityLogs.map((log, i) => (
                <tr key={i}>
                  <td>{log.name}</td>
                  <td>{log.user_email}</td>
                  <td>{log.user_role}</td>
                  <td>{log.start_time}</td>
                  <td>{log.end_time || "-"}</td>
                  <td>{log.duration_minutes || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= HIGH RISK ================= */}
      <div className="report-panel">
        <h3>High Risk Leads (3+ days)</h3>

        {longPending.length === 0 ? (
          <p className="empty">No risky leads 🎉</p>
        ) : (
          longPending.map(l => (
            <div key={l.lead_id} className="pending-item">
              <strong>{l.name}</strong>
              <span>{l.phone}</span>
              <span className="badge danger">High Risk</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
