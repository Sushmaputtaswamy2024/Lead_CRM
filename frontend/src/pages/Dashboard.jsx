import { useEffect, useState } from "react";
import "./Dashboard.css";
import { fetchLeads } from "../api/leads";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetchLeads()
      .then((res) => setLeads(res.data.leads || []))
      .catch(console.error);
  }, []);

  const totalLeads = leads.length;

  const todayLeads = leads.filter(
    (l) =>
      new Date(l.created_at).toDateString() === new Date().toDateString()
  ).length;

  const interested = leads.filter((l) => l.status === "Interested").length;
  const converted = leads.filter((l) => l.status === "Converted").length;

  const now = new Date();
  const todayStr = now.toDateString();

  const todayReminders = leads.filter(
    (l) =>
      l.snooze_until &&
      new Date(l.snooze_until).toDateString() === todayStr
  );

  const overdueReminders = leads.filter(
    (l) =>
      l.snooze_until &&
      new Date(l.snooze_until) < now &&
      new Date(l.snooze_until).toDateString() !== todayStr
  );

  const upcomingReminders = leads.filter(
    (l) => l.snooze_until && new Date(l.snooze_until) > now
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* SUMMARY CARDS */}
        <div className="dashboard-cards">
          <div className="dash-card blue">
            <p>Total Leads</p>
            <h1>{totalLeads}</h1>
          </div>

          <div className="dash-card green">
            <p>Today Leads</p>
            <h1>{todayLeads}</h1>
          </div>

          <div className="dash-card orange">
            <p>Interested</p>
            <h1>{interested}</h1>
          </div>

          <div className="dash-card purple">
            <p>Converted</p>
            <h1>{converted}</h1>
          </div>
        </div>

        {/* LOWER GRID */}
        <div className="dashboard-grid-3">
          {/* RECENT LEADS */}
          <div className="dashboard-panel">
            <h3>Recent Leads</h3>

            {leads.slice(0, 5).length === 0 ? (
              <p className="empty">No leads found.</p>
            ) : (
              leads.slice(0, 5).map((lead) => (
                <div key={lead.id} className="recent-lead">
                  <div>
                    <strong>{lead.name}</strong>
                    <p>{lead.phone}</p>
                  </div>
                  <span className={`status ${lead.status?.toLowerCase()}`}>
                    {lead.status}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* REMINDERS */}
          <div className="dashboard-panel">
            <h3>Reminders</h3>

            <h4 className="reminder-title today">Today</h4>
            {todayReminders.length === 0 ? (
              <p className="empty">No reminders today.</p>
            ) : (
              todayReminders.map((lead) => (
                <div key={lead.id} className="reminder-item">
                  <div>
                    <strong>{lead.name}</strong>
                    <p>{lead.phone}</p>
                  </div>
                  <span className="reminder-badge today">Today</span>
                </div>
              ))
            )}

            <h4 className="reminder-title overdue">Overdue</h4>
            {overdueReminders.length === 0 ? (
              <p className="empty">No overdue reminders.</p>
            ) : (
              overdueReminders.map((lead) => (
                <div key={lead.id} className="reminder-item">
                  <div>
                    <strong>{lead.name}</strong>
                    <p>{lead.phone}</p>
                  </div>
                  <span className="reminder-badge overdue">Overdue</span>
                </div>
              ))
            )}

            <h4 className="reminder-title upcoming">Upcoming</h4>
            {upcomingReminders.length === 0 ? (
              <p className="empty">No upcoming reminders.</p>
            ) : (
              upcomingReminders.slice(0, 5).map((lead) => (
                <div key={lead.id} className="reminder-item">
                  <div>
                    <strong>{lead.name}</strong>
                    <p>{lead.phone}</p>
                  </div>
                  <span className="reminder-badge upcoming">
                    {new Date(lead.snooze_until).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* QUICK INSIGHTS */}
          <div className="dashboard-panel">
            <h3>Quick Insights</h3>
            <ul className="stats-list">
              <li>
                <span>Conversion Rate</span>
                <strong>
                  {totalLeads === 0
                    ? "0%"
                    : Math.round((converted / totalLeads) * 100) + "%"}
                </strong>
              </li>
              <li>
                <span>Interested Ratio</span>
                <strong>
                  {totalLeads === 0
                    ? "0%"
                    : Math.round((interested / totalLeads) * 100) + "%"}
                </strong>
              </li>
              <li>
                <span>Pending Leads</span>
                <strong>{totalLeads - converted}</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
