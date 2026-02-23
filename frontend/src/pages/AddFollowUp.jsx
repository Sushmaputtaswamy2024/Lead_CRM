import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { addFollowUp } from "../api/leads";

export default function AddFollowUp() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    next_followup: "",
    note: "",
    status: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.note) {
      alert("Note is required");
      return;
    }

    try {
      await addFollowUp(id, data);
      alert("Follow-up added successfully ✅");
      navigate("/follow-ups");
    } catch (err) {
      console.error("Add followup error:", err);
      alert("Failed to add follow-up ❌");
    }
  };

  return (
    <div className="add-followup-page">
      <h2>Add Follow-up</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="date"
          required
          value={data.next_followup}
          onChange={(e) =>
            setData({ ...data, next_followup: e.target.value })
          }
        />

        <br /><br />

        <textarea
          placeholder="Note"
          value={data.note}
          onChange={(e) =>
            setData({ ...data, note: e.target.value })
          }
        />

        <br /><br />

        <select
          value={data.status}
          onChange={(e) =>
            setData({ ...data, status: e.target.value })
          }
        >
          <option value="">Update Status (Optional)</option>
          <option value="Interested">Interested</option>
          <option value="Contacted">Contacted</option>
          <option value="Converted">Converted</option>
        </select>

        <br /><br />

        <button type="submit">Add Follow-up</button>
      </form>
    </div>
  );
}