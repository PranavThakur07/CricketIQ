const API_BASE = "http://127.0.0.1:8000/api";

/**
 * Fetches the connection status of the external live cricket API.
 */
export async function fetchLiveStatus() {
  try {
    const res = await fetch(`${API_BASE}/live/status`);
    if (!res.ok) throw new Error("Network response was not ok");
    return await res.json();
  } catch (err) {
    console.warn("Unable to reach backend live status endpoint. Falling back to default 'not_configured'.");
    return {
      status: "not_configured",
      provider_name: "None",
      display_message: "⚠ Live Provider Not Configured"
    };
  }
}

/**
 * Lists active live matches from the configured cricket API.
 */
export async function fetchLiveMatches() {
  const res = await fetch(`${API_BASE}/live/matches`);
  if (!res.ok) throw new Error("Failed to fetch live matches");
  return await res.json();
}

/**
 * Fetches detailed scorecard and overs for an active live match.
 */
export async function fetchLiveMatchDetail(matchId) {
  const res = await fetch(`${API_BASE}/live/matches/${matchId}`);
  if (!res.ok) throw new Error("Failed to fetch live match details");
  return await res.json();
}

/**
 * Sends a tactical query to one of three specialized War Room agents.
 */
export async function askWarRoom(agentType, question, matchId, isLive = false) {
  const res = await fetch(`${API_BASE}/war-room/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      agent_type: agentType,
      question: question,
      match_id: matchId,
      is_live: isLive
    })
  });
  if (!res.ok) throw new Error("Failed to query War Room Agent");
  return await res.json();
}

/**
 * Triggers the editorial compiler to generate a tactical Match Intelligence Report.
 */
export async function generateMatchReport(matchId, isLive = false) {
  const res = await fetch(`${API_BASE}/war-room/match-report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      match_id: matchId,
      is_live: isLive
    })
  });
  if (!res.ok) throw new Error("Failed to generate Match Report");
  return await res.json();
}
