import { useState, useEffect } from "react";
import { fetchCalendarEvents } from "../services/googleCalendar";

function getOrdinalSuffix(day) {
  const mod100 = day % 100;
  if (mod100 >= 11 && mod100 <= 13) return "th";
  const mod10 = day % 10;
  if (mod10 === 1) return "st";
  if (mod10 === 2) return "nd";
  if (mod10 === 3) return "rd";
  return "th";
}

function parseDateStringToDate(value) {
  if (!value) return null;
  const s = value.trim();
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const d = new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2]));
    if (!Number.isNaN(d.getTime())) return d;
  }
  const d2 = new Date(s);
  if (!Number.isNaN(d2.getTime())) return d2;
  return null;
}

function formatSessionTitle(summary) {
  if (!summary) return summary;
  const s = summary.trim().toLowerCase();
  if (s === "open hockey") return "Open Hockey (All-Ages)";
  if (s === "adult open hockey") return "Adult Open Hockey (18+)";
  return summary;
}

function formatLongOrdinalDate(value) {
  const d = parseDateStringToDate(value);
  if (!d) return value;
  const dayNum = d.getDate();
  const suffix = getOrdinalSuffix(dayNum);
  const monthName = d.toLocaleString("en-US", { month: "long" });
  return `${monthName} ${dayNum}${suffix}, ${d.getFullYear()}`;
}

export function ScheduleTable() {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const events = await fetchCalendarEvents();
        setScheduleData(
          events.map((e) => ({ day: e.day, date: e.date, start: e.start, end: e.end, summary: e.summary }))
        );
        setError(null);
      } catch (err) {
        console.error("Failed to load calendar events:", err);
        setError("Failed to load schedule.");
        setScheduleData([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) {
    return <div className="schedule-loading">Loading schedule...</div>;
  }

  return (
    <div className="schedule-table-container">
      {error ? (
        <div className="schedule-error">{error}</div>
      ) : null}

      <div className="schedule-scroll">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Session</th>
              <th>Day</th>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
            </tr>
          </thead>
          <tbody>
            {scheduleData.length > 0 ? (
              scheduleData.map((item, index) => (
                <tr key={index}>
                  <td className="schedule-day">{formatSessionTitle(item.summary)}</td>
                  <td>{item.day}</td>
                  <td>{formatLongOrdinalDate(item.date)}</td>
                  <td>{item.start}</td>
                  <td>{item.end}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="schedule-empty">
                  No upcoming sessions scheduled
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
