import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addLead } from "../api/leads";
import "./AddLead.css";

export default function AddLead() {
  const navigate = useNavigate();

  const [sameWhatsapp, setSameWhatsapp] = useState(true);

  const [reminder, setReminder] = useState({
    value: "",
    unit: "hours",
  });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    email: "",
    city: "",
    source: "manual",
    status: "New",

    call_status: "",
    building_type: "",
    floors: "",
    measurement: "",
    sqft: "",
    budget: "",
    description: "",

    assigned_to: "",
    quotation_sent: "No",
    designs_sent: "0", // ✅ NEW FIELD

    project_start: "",
    snooze_until: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "phone" && sameWhatsapp && { whatsapp: value }),
    }));
  };

  const calculateSnooze = () => {
    if (!reminder.value) return "";

    const now = new Date();
    const val = parseInt(reminder.value);

    if (reminder.unit === "hours") now.setHours(now.getHours() + val);
    if (reminder.unit === "days") now.setDate(now.getDate() + val);
    if (reminder.unit === "months") now.setMonth(now.getMonth() + val);

    return now.toISOString().split("T")[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const snoozeDate = calculateSnooze();

    try {
      await addLead({
        ...form,
        designs_sent: Number(form.designs_sent), // ensure number
        snooze_until: snoozeDate,
      });

      alert("Lead added successfully");
      navigate("/leads");
    } catch (err) {
      console.error(err);
      alert("Failed to add lead");
    }
  };

  return (
    <div className="add-lead-page">
      <h2>Add Lead</h2>

      <form className="add-lead-grid" onSubmit={handleSubmit}>
        {/* LEFT SECTION */}
        <div className="card animate">
          <h3>Lead Details</h3>

          <input name="name" placeholder="Name" onChange={handleChange} required />
          <input name="phone" placeholder="Phone" onChange={handleChange} required />

          <label className="checkbox">
            <input
              type="checkbox"
              checked={sameWhatsapp}
              onChange={() => setSameWhatsapp(!sameWhatsapp)}
            />
            WhatsApp same as phone
          </label>

          {!sameWhatsapp && (
            <input
              name="whatsapp"
              placeholder="WhatsApp Number"
              onChange={handleChange}
            />
          )}

          <input name="email" placeholder="Email" onChange={handleChange} />
          <input name="city" placeholder="City" onChange={handleChange} />

          <select name="call_status" onChange={handleChange}>
            <option value="">Call Status</option>
            <option>Connected</option>
            <option>Not Connected</option>
            <option>Switch Off</option>
          </select>

          <select name="building_type" onChange={handleChange}>
            <option value="">Building Type</option>
            <option>Residential</option>
            <option>Commercial</option>
            <option>Interior Decorators</option>
            <option>Architects</option>
            <option>False Ceiling</option>
            <option>Builders</option>
            <option>Interior Designers</option>
            <option>Building Contractors</option>
          </select>

          <select name="floors" onChange={handleChange}>
            <option value="">Floors</option>
            <option>G</option>
            <option>G+1</option>
            <option>G+2</option>
            <option>G+3</option>
          </select>

          <input name="measurement" placeholder="Measurement" onChange={handleChange} />
          <input name="sqft" placeholder="Square Feet" onChange={handleChange} />
          <input name="budget" placeholder="Budget" onChange={handleChange} />

          <textarea
            name="description"
            placeholder="Description / Requirements"
            rows="4"
            onChange={handleChange}
          />

          {/* 🔔 Snoozer */}
          <h4>Reminder / Snooze</h4>
          <div className="reminder-row">
            <input
              type="number"
              placeholder="Value"
              value={reminder.value}
              onChange={(e) =>
                setReminder({ ...reminder, value: e.target.value })
              }
            />

            <select
              value={reminder.unit}
              onChange={(e) =>
                setReminder({ ...reminder, unit: e.target.value })
              }
            >
              <option value="hours">Hours</option>
              <option value="days">Days</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="card assignment-card animate">
          <h3>Assignment</h3>

          <select name="assigned_to" onChange={handleChange}>
            <option value="">Assign To</option>
            <option value="vindiainfrasec@bda1">BDA 1</option>
            <option value="vindiainfrasec@bda2">BDA 2</option>
          </select>

          <div className="radio-group">
            <p>Quotation Sent</p>
            <label>
              <input
                type="radio"
                name="quotation_sent"
                value="Yes"
                onChange={handleChange}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="quotation_sent"
                value="No"
                defaultChecked
              />
              No
            </label>
          </div>

          {/* ✅ NEW DESIGNS SENT DROPDOWN */}
          <div className="designs-section">
            <p>Designs Sent</p>
            <select name="designs_sent" value={form.designs_sent} onChange={handleChange}>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5+</option>
            </select>
          </div>

          <button className="primary-btn" type="submit">
            Save Lead
          </button>
        </div>
      </form>
    </div>
  );
}
