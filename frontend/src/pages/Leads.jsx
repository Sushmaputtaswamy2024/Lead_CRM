import { useEffect, useState, useMemo } from "react";
import { fetchLeads } from "../api/leads";
import LeadTable from "../components/LeadTable";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Leads.css";

export default function Leads() {
  const { user } = useAuth();
  const location = useLocation();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showJunk, setShowJunk] = useState(false);

  /* ================= LOAD LEADS ================= */
  useEffect(() => {
    let isMounted = true;

    const loadLeads = async () => {
      if (!user) return;

      try {
        const res = await fetchLeads(user, showJunk);
        const data = res.data.leads || [];

        if (isMounted) {
          setLeads(data);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch (err) {
        console.error("Fetch leads error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadLeads();

    return () => {
      isMounted = false;
    };
  }, [user, showJunk]);

  /* ================= READ DASHBOARD QUERY ================= */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");

    if (status) {
      setStatusFilter(status);
    }
  }, [location.search]);

  /* ================= DERIVED FILTERED DATA ================= */
  const filteredLeads = useMemo(() => {
    let data = [...leads];

    const params = new URLSearchParams(location.search);
    const today = params.get("today");

    if (today === "true") {
      const todayDate = new Date().toISOString().slice(0, 10);
      data = data.filter(
        (lead) =>
          lead.created_at &&
          lead.created_at.slice(0, 10) === todayDate
      );
    }

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

    return data;
  }, [leads, search, statusFilter, sourceFilter, sortOrder, location.search]);

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

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="reset-btn" onClick={resetFilters}>
              Reset
            </button>

            {user?.role === "admin" && (
              <button
                className="junk-btn"
                onClick={() => setShowJunk(!showJunk)}
              >
                {showJunk ? "Active Leads" : "Junk Leads"}
              </button>
            )}
          </div>
        </div>
      </div>

      <LeadTable leads={filteredLeads} />
    </div>
  );
}