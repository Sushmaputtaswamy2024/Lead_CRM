import { useEffect, useState } from "react";
import { fetchLeads } from "../api/leads";
import LeadTable from "../components/LeadTable";
import "./Leads.css";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads()
      .then((res) => {
        setLeads(res.data.leads);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch leads error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading leads...</p>;

  return (
    <div className="leads-page">
      <h2 className="page-title">Leads</h2>

      <div className="table-wrapper">
        <LeadTable leads={leads} />
      </div>
    </div>
  );
}
