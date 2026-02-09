import { useEffect, useState } from "react";
import { fetchLeads } from "../api/leads";
import LeadTable from "../components/LeadTable";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads()
      .then((res) => {
        console.log("API response:", res.data);   // 🔴 IMPORTANT
        setLeads(res.data.leads);                // MUST be .leads
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch leads error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading leads...</p>;

  return (
    <div>
      <h2>Leads</h2>
      <LeadTable leads={leads} />
    </div>
  );
}
