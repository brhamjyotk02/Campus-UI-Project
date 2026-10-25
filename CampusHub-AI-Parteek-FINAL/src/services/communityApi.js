import { addDays, toISO } from "../utils/dates";

const LATENCY_MS = 700; // small delay so the loading state is visible in a demo

async function getJson(path, shouldFail) {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));
  if (shouldFail) {
    throw new Error("We couldn’t reach the campus server. Check your connection and try again.");
  }
  const res = await fetch(path);
  if (!res.ok) throw new Error(`The server answered with an error (${res.status}).`);
  return res.json();
}

// One call loads everything this module needs.
// `shouldFail` lets the demo toggle force the error + retry state.
export async function fetchCommunityData(shouldFail = false) {
  const [clubs, events, profile] = await Promise.all([
    getJson("/data/clubs.json", shouldFail),
    getJson("/data/events.json", shouldFail),
    getJson("/data/profile.json", shouldFail),
  ]);

  // events.json stores "days from today" so demo events are always upcoming.
  const datedEvents = events.map((e) => ({ ...e, date: toISO(addDays(e.offsetDays)) }));
  return { clubs, events: datedEvents, profile };
}
