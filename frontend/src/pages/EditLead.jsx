import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditLead() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    source: "",
    status: ""
  });

  // Load lead by ID
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/leads/${id}`)
      .then((res) => setForm(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/leads/${id}`, form);
      alert("Lead updated successfully");
      navigate("/leads");
    } catch (err) {
      console.error(err);
      alert("Error updating lead");
    }
  };

  return (
    <div>
      <h2>Edit Lead</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="source"
          value={form.source}
          onChange={handleChange}
        />
        <br /><br />

        <select name="status" value={form.status} onChange={handleChange}>
          <option>New</option>
          <option>Contacted</option>
          <option>Interested</option>
          <option>Converted</option>
        </select>
        <br /><br />

        <button type="submit">Update Lead</button>
      </form>
    </div>
  );
}
