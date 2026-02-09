import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import FollowUps from "./FollowUps"; 
import { fetchLeadTimeline } from "../api/leads";
import "./LeadDetails.css"; // Import CSS for styling
export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState([]);


  useEffect(() => {
    fetchLeadTimeline(id)
  .then(res => setTimeline(res.data.timeline || []))
  .catch(console.error);

    axios
      .get(`http://localhost:5000/api/leads/${id}`)
      .then((res) => {
        console.log("Lead details response:", res.data); // 🔴 debug
        setLead(res.data.lead); // ✅ IMPORTANT
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading lead", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading lead...</p>;
  if (!lead) return <p>Lead not found.</p>;

return (
  <div className="lead-details-page">
    <button className="lead-back-btn" onClick={() => navigate("/leads")}>
  ⬅ Back
</button>


    <div className="lead-info-card">
  <h2>Lead Details</h2>

  <div className="lead-info-grid">
    <div className="lead-info"><b>Name:</b> {lead.name}</div>
    <div className="lead-info"><b>Phone:</b> {lead.phone}</div>
    <div className="lead-info"><b>Email:</b> {lead.email || "-"}</div>
    <div className="lead-info"><b>Status:</b> {lead.status}</div>
    <div className="lead-info"><b>Source:</b> {lead.source}</div>
    <div className="lead-info"><b>Assigned To:</b> {lead.assigned_to || "-"}</div>
  </div>
</div>


    <div className="timeline-section">
      <h3>Activity Timeline</h3>

      {timeline.length === 0 ? (
        <p className="empty">No activity yet.</p>
      ) : (
        <div className="timeline">
          {timeline.map((item, i) => (
            <div key={i} className="timeline-item">
              <span className={`dot ${item.type}`} />
              <div>
                <p className="time">
                  {new Date(item.time).toLocaleString()}
                </p>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    <div className="followups-wrapper">
      <FollowUps leadId={lead.id} />
    </div>
  </div>
);

}
