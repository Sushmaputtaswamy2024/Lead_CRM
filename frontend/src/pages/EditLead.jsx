import { useEffect, useState } from "react";
import api from "../api/client";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./EditLead.css";

export default function EditLead() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    date_and_time: "",
    search_category: "",
    area: "",
    status: "New",
    call_status: "",
    building_type: "",
    floors: "",
    measurement: "",
    sqft: "",
    budget: "",
    designs_sent: 0,
    description: "",
    assigned_to: "",
  });

  const [loading, setLoading] = useState(true);

  /* ===========================
     FETCH LEAD DATA (SAFE)
  =========================== */
  useEffect(() => {
    let isMounted = true;

    const fetchLead = async () => {
      try {
        const res = await api.get(`/leads/${id}`);

        if (isMounted && res.data?.lead) {
          setForm({
            ...res.data.lead,
            designs_sent: res.data.lead.designs_sent ?? 0,
          });
        }
      } catch (err) {
        console.error("Fetch lead error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLead();

    return () => {
      isMounted = false;
    };
  }, [id]);

  /* ===========================
     HANDLE INPUT CHANGE
  =========================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "designs_sent" ? Number(value) : value,
    }));
  };

  /* ===========================
     MARK AS UNWANTED
  =========================== */
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

  /* ===========================
     SUBMIT UPDATE
  =========================== */
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
          <input value={form.name} disabled />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input value={form.phone} disabled />
        </div>

        {/* EDITABLE FIELDS */}
        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>City</label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Date & Time</label>
          <input
            name="date_and_time"
            value={form.date_and_time}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Search Category</label>
          <input
            name="search_category"
            value={form.search_category}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Area</label>
          <input
            name="area"
            value={form.area}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="New">New</option>
            <option value="Interested">Interested</option>
            <option value="Contacted">Contacted</option>
            <option value="Converted">Converted</option>
          </select>
        </div>

        <div className="form-group">
          <label>Call Status</label>
          <input
            name="call_status"
            value={form.call_status}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Building Type</label>
          <input
            name="building_type"
            value={form.building_type}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Floors</label>
          <input
            name="floors"
            value={form.floors}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Measurement</label>
          <input
            name="measurement"
            value={form.measurement}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Square Feet</label>
          <input
            name="sqft"
            value={form.sqft}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Budget</label>
          <input
            name="budget"
            value={form.budget}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Designs Sent</label>
          <select
            name="designs_sent"
            value={form.designs_sent}
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
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Assigned To</label>
          <input
            name="assigned_to"
            value={form.assigned_to}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">
            Save Changes
          </button>

          {(user?.role === "bda1" || user?.role === "bda2") && (
            <button
              type="button"
              onClick={handleMarkUnwanted}
              style={{
                background: "#f97316",
                color: "white",
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
              }}
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