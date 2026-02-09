import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { addFollowUp } from "../api/leads";

export default function AddFollowUp() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    followup_date: "",
    note: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addFollowUp(id, data);
    alert("Follow-up added");
    navigate("/follow-ups");
  };

  return (
    <div>
      <h2>Add Follow-up</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="date"
          required
          onChange={(e) =>
            setData({ ...data, followup_date: e.target.value })
          }
        />
        <br /><br />

        <textarea
          placeholder="Note"
          onChange={(e) =>
            setData({ ...data, note: e.target.value })
          }
        />
        <br /><br />

        <button>Add</button>
      </form>
    </div>
  );
}
