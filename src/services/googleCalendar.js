// src/services/googleCalendar.js

const ENV_CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY;

const FALLBACK_CALENDAR_ID =
  "8a8b80aefa9fd035a3c91ea2daedd059e8485066d7ec498e6a6d0b9992336953@group.calendar.google.com";

const CALENDAR_ID = (ENV_CALENDAR_ID || FALLBACK_CALENDAR_ID).trim();

const TZ = "America/New_York";

const OPEN_HOCKEY_KEYWORDS = ["open hockey"];

function isAllDay(item) {
  return !!item.start?.date && !item.start?.dateTime;
}

function normalizeForDisplay(dateString) {
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  return isDateOnly ? `${dateString}T12:00:00` : dateString;
}

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: TZ,
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    timeZone: TZ,
  });
}

function getDayOfWeek(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: TZ,
  });
}

function matchesOpenHockey(summary) {
  const s = (summary ?? "").toLowerCase().trim();
  if (!s) return false;
  return OPEN_HOCKEY_KEYWORDS.some((k) => s.includes(k));
}

export async function fetchCalendarEvents() {
  if (!API_KEY) {
    console.error("[Calendar] Missing env var: VITE_GOOGLE_CALENDAR_API_KEY.");
    return [];
  }

  if (!CALENDAR_ID) {
    console.error("[Calendar] Missing calendar id.");
    return [];
  }

  try {
    const now = new Date();
    const daysFromNow = new Date(now);
    daysFromNow.setDate(now.getDate() + 30);

    const params = new URLSearchParams({
      key: API_KEY,
      timeMin: now.toISOString(),
      timeMax: daysFromNow.toISOString(),
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: "100",
      timeZone: TZ,
      fields: "items(status,summary,start(dateTime,date),end(dateTime,date))",
    });

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      CALENDAR_ID
    )}/events?${params.toString()}`;

    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      const text = await response.text();
      let message = text;

      try {
        const json = JSON.parse(text);
        message = json?.error?.message || text;
      } catch {
        // ignore
      }

      console.error("[Calendar] Google Calendar API failed:", {
        status: response.status,
        statusText: response.statusText,
        message,
        calendarId: CALENDAR_ID,
      });

      return [];
    }

    const data = await response.json();
    const items = Array.isArray(data.items) ? data.items : [];
    if (items.length === 0) return [];

    return items
      .filter((item) => item.status !== "cancelled")
      .filter((item) => matchesOpenHockey(item.summary))
      .map((item) => {
        const allDay = isAllDay(item);

        const rawStart = item.start?.dateTime || item.start?.date;
        const rawEnd = item.end?.dateTime || item.end?.date;
        if (!rawStart || !rawEnd) return null;

        const startForDisplay = normalizeForDisplay(rawStart);
        const endForDisplay = normalizeForDisplay(rawEnd);

        return {
          day: getDayOfWeek(startForDisplay),
          date: formatDate(startForDisplay),
          start: allDay ? "All Day" : formatTime(startForDisplay),
          end: allDay ? "" : formatTime(endForDisplay),
          summary: item.summary,
        };
      })
      .filter(Boolean);
  } catch (error) {
    console.error("[Calendar] Error fetching calendar events:", error);
    return [];
  }
}
