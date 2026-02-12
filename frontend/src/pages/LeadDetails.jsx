import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "./LeadDetails.css";

export default function LeadDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [lead, setLead] = useState(null);
  const [followUps, setFollowUps] = useState([]);
  // const [sessionId, setSessionId] = useState(null);
  // const [setSessionId] = useState(null);


  useEffect(() => {
  let activeSessionId = null;

  const fetchDataAndStartSession = async () => {
    try {
      const leadRes = await axios.get(
        `http://13.233.XXX.XXX:5000/api/leads/${id}`
      );
      setLead(leadRes.data.lead);

      const followRes = await axios.get(
        `http://13.233.XXX.XXX:5000/api/leads/${id}/followups`
      );
      setFollowUps(followRes.data.followUps || []);

      if (user?.email) {
        const sessionRes = await axios.post(
          "http://13.233.XXX.XXX:5000/api/reports/start-session",
          {
            lead_id: id,
            user_email: user.email,
            user_role: user.role
          }
        );

        activeSessionId = sessionRes.data.sessionId;
      }
    } catch (err) {
      console.error("Lead details error:", err);
    }
  };

  fetchDataAndStartSession();

  return () => {
    if (activeSessionId) {
      axios.post(
        "http://13.233.XXX.XXX:5000/api/reports/end-session",
        { session_id: activeSessionId }
      );
    }
  };
}, [id, user?.email]);


  if (!lead) return <p>Loading...</p>;

  const todayDate = new Date().toISOString().slice(0, 10);

  const todayCount = followUps.filter(
    f =>
      f.next_followup &&
      f.next_followup.slice(0, 10) === todayDate
  ).length;

  const pendingCount = followUps.filter(
    f =>
      f.next_followup &&
      f.next_followup.slice(0, 10) < todayDate
  ).length;

  const totalCount = followUps.length;

  return (
    <div className="lead-details-page">
      <h2>Lead Details</h2>

      <div className="lead-info">
        <p><b>Name:</b> {lead.name}</p>
        <p><b>Phone:</b> {lead.phone}</p>
        <p><b>Email:</b> {lead.email}</p>
        <p><b>Status:</b> {lead.status}</p>
      </div>

      <h3>Follow Ups</h3>

      <div className="followup-summary">
        <div className="summary-card today">
          <p>Today</p>
          <h1>{todayCount}</h1>
        </div>

        <div className="summary-card pending">
          <p>Pending</p>
          <h1>{pendingCount}</h1>
        </div>

        <div className="summary-card total">
          <p>Total</p>
          <h1>{totalCount}</h1>
        </div>
      </div>

      {totalCount === 0 && (
        <p className="empty">No follow-ups for this lead.</p>
      )}
    </div>
  );
}
