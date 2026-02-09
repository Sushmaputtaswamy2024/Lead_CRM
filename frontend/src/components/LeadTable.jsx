import { useNavigate } from "react-router-dom";

export default function LeadTable({ leads }) {
  const navigate = useNavigate();

  console.log("Leads in table:", leads); // 🔴 IMPORTANT

  if (!leads || leads.length === 0) {
    return <p>No leads found.</p>;
  }

  return (
    <table border="1" width="100%" cellPadding="8">
      <thead>
        <tr>
          <th>Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr key={lead.id}>
            <td
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => navigate(`/leads/${lead.id}`)}
            >
              {lead.name}
            </td>
            <td>{lead.phone}</td>
            <td>{lead.email || "-"}</td>
            <td>{lead.status}</td>
            <td>
              <button onClick={() => navigate(`/leads/${lead.id}`)}>
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
