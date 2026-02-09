import { useEffect, useState } from "react";
import {
  fetchTodayFollowUps,
  fetchPendingFollowUps,
} from "../api/leads";

export default function Reports() {
  const [today, setToday] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadReports = async () => {
      try {
        const todayRes = await fetchTodayFollowUps();
        const pendingRes = await fetchPendingFollowUps();

        if (isMounted) {
          setToday(todayRes.data || []);
          setPending(pendingRes.data || []);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    loadReports();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <p>Loading reports...</p>;

  return (
    <div>
      <h2>Reports</h2>

      {/* TODAY FOLLOW UPS */}
      <h3>Today Follow Ups</h3>

      {today.length === 0 ? (
        <p>No follow-ups scheduled for today.</p>
      ) : (
        <table border="1" width="100%">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Phone</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {today.map((f) => (
              <tr key={f.id}>
                <td>{f.name}</td>
                <td>{f.phone}</td>
                <td>{f.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br />

      {/* PENDING FOLLOW UPS */}
      <h3>Pending Follow Ups</h3>

      {pending.length === 0 ? (
        <p>No pending follow-ups.</p>
      ) : (
        <table border="1" width="100%">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Follow-up Date</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.phone}</td>
                <td>{p.email}</td>
                <td>{p.followup_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
