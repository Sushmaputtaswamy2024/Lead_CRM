import { useEffect, useState } from "react";
import api from "../api/client";
import { useParams, useNavigate } from "react-router-dom";
import "./EditLead.css";
import { useAuth } from "../context/AuthContext";

export default function EditLead() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const res = await api.get(`/leads/${id}`);
        setForm(res.data.lead);
      } catch (err) {
        console.error("Fetch lead error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleMarkUnwanted = async () => {
    try {
      await api.put(`/leads/${id}/request-junk`);
      alert("Lead sent to Admin for review");
      navigate("/leads");
    } catch (err) {
      console.error("Junk request failed:", err);
      alert("Failed to mark as unwanted");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/leads/${id}`, form);
      alert("Lead updated successfully ✅");
      navigate(`/leads/${id}`);
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed ❌");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="edit-lead-page">
      <h2>Edit Lead</h2>

      <form onSubmit={handleSubmit} className="edit-form">

        {/* FIXED FIELDS */}
        <div className="form-group">
          <label>Name</label>
          <input value={form.name || ""} disabled />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input value={form.phone || ""} disabled />
        </div>

        {/* EDITABLE FIELDS */}
        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            value={form.email || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>City</label>
          <input
            name="city"
            value={form.city || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Date & Time</label>
          <input
            name="date_and_time"
            value={form.date_and_time || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Search Category</label>
          <input
            name="search_category"
            value={form.search_category || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Area</label>
          <input
            name="area"
            value={form.area || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={form.status || ""}
            onChange={handleChange}
          >
            <option>New</option>
            <option>Interested</option>
            <option>Contacted</option>
            <option>Converted</option>
          </select>
        </div>

        <div className="form-group">
          <label>Call Status</label>
          <input
            name="call_status"
            value={form.call_status || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Building Type</label>
          <input
            name="building_type"
            value={form.building_type || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Floors</label>
          <input
            name="floors"
            value={form.floors || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Measurement</label>
          <input
            name="measurement"
            value={form.measurement || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Square Feet</label>
          <input
            name="sqft"
            value={form.sqft || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Budget</label>
          <input
            name="budget"
            value={form.budget || ""}
            onChange={handleChange}
          />
        </div>

        {/* ✅ NEW FIELD ADDED HERE */}
        <div className="form-group">
          <label>Designs Sent</label>
          <select
            name="designs_sent"
            value={form.designs_sent || 0}
            onChange={handleChange}
          >
            {[...Array(11).keys()].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Assigned To</label>
          <input
            name="assigned_to"
            value={form.assigned_to || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">
            Save Changes
          </button>

          {(user.role === "bda1" || user.role === "bda2") && (
            <button
              type="button"
              style={{
                background: "#f97316",
                color: "white",
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
              }}
              onClick={handleMarkUnwanted}
            >
              Mark as Unwanted
            </button>
          )}

          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
