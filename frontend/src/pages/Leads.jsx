import { useEffect, useState } from "react";
import { fetchLeads } from "../api/leads";
import LeadTable from "../components/LeadTable";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Leads.css";

export default function Leads() {
  const { user } = useAuth();

  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showJunk, setShowJunk] = useState(false);

  const location = useLocation();

  // ================= LOAD LEADS =================
  const loadLeads = async () => {
    if (!user) return;

    try {
      const res = await fetchLeads(user, showJunk);
      const data = res.data.leads || [];
      setLeads(data);
      setFilteredLeads(data);
    } catch (err) {
      console.error("Fetch leads error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [user, showJunk]);

  // ================= READ DASHBOARD QUERY =================
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const status = params.get("status");
    const today = params.get("today");

    if (status) {
      setStatusFilter(status);
    }

    if (today === "true") {
      const todayDate = new Date().toISOString().slice(0, 10);

      const todayLeads = leads.filter(
        (lead) =>
          lead.created_at &&
          lead.created_at.slice(0, 10) === todayDate
      );

      setFilteredLeads(todayLeads);
    }
  }, [location.search, leads]);

  // ================= FILTER + SORT =================
  useEffect(() => {
    let data = [...leads];

    if (search) {
      data = data.filter(
        (lead) =>
          lead.name?.toLowerCase().includes(search.toLowerCase()) ||
          lead.phone?.includes(search) ||
          lead.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter) {
      data = data.filter((lead) => lead.status === statusFilter);
    }

    if (sourceFilter) {
      data = data.filter(
        (lead) =>
          lead.source &&
          lead.source.toLowerCase() === sourceFilter.toLowerCase()
      );
    }

    data.sort((a, b) => {
      if (!a.created_at || !b.created_at) return 0;

      return sortOrder === "newest"
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at);
    });

    setFilteredLeads(data);
  }, [search, statusFilter, sourceFilter, sortOrder, leads]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setSourceFilter("");
    setSortOrder("newest");
  };

  if (loading) return <p className="loading">Loading leads...</p>;

  return (
    <div className="leads-page">
      <div className="leads-header">
        <h2 className="page-title">Leads</h2>

        {/* ADMIN JUNK TOGGLE */}
        {user?.role === "admin" && (
          <button
            onClick={() => setShowJunk(!showJunk)}
            style={{
              background: showJunk ? "#ef4444" : "#6b7280",
              color: "white",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "none",
              marginBottom: "12px",
              cursor: "pointer"
            }}
          >
            {showJunk ? "View Active Leads" : "View Junk Requests"}
          </button>
        )}

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="New">New</option>
            <option value="Interested">Interested</option>
            <option value="Contacted">Contacted</option>
            <option value="Converted">Converted</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option value="">All Sources</option>
            <option value="Meta">Meta</option>
            <option value="Manual">Manual</option>
            <option value="JustDial">JustDial</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          <button className="reset-btn" onClick={resetFilters}>
            Reset
          </button>
        </div>
      </div>

      <LeadTable leads={filteredLeads} />
    </div>
  );
}
