// Cloudflare Pages Function: GET /api/surveys/:id/results
// Aggregates responses and returns percentages and seat allocation (120 seats, 3.25% threshold)

const PARTIES = [
  'הליכוד',
  'יש עתיד',
  'המחנה הממלכתי',
  'ש"ס',
  'יהדות התורה',
  'עוצמה יהודית',
  'הציונות הדתית',
  'ישראל ביתנו',
  'העבודה',
  'מרצ',
  'חד"ש-תע"ל',
  'רע"ם',
  'בל"ד'
];

const TOTAL_SEATS = 120;
const THRESHOLD = 0.0325; // 3.25%

function allocateSeatsHare(voteShares) {
  // voteShares: [{ name, votes }]
  const totalValidVotes = voteShares.reduce((sum, p) => sum + p.votes, 0);
  if (totalValidVotes === 0) {
    return voteShares.map((p) => ({ ...p, seats: 0, percent: 0 }));
  }
  const quotaSeats = voteShares.map((p) => {
    const percent = p.votes / totalValidVotes;
    const exactSeats = percent * TOTAL_SEATS;
    return { ...p, percent, exactSeats, base: Math.floor(exactSeats), remainder: exactSeats - Math.floor(exactSeats) };
  });
  let allocated = quotaSeats.reduce((s, p) => s + p.base, 0);
  const remaining = TOTAL_SEATS - allocated;
  // Distribute remaining seats by largest remainders
  quotaSeats.sort((a, b) => b.remainder - a.remainder);
  for (let i = 0; i < remaining; i++) {
    quotaSeats[i % quotaSeats.length].base += 1;
  }
  // Return sorted by seats desc then name
  return quotaSeats
    .map((p) => ({ name: p.name, votes: p.votes, seats: p.base, percent: p.percent }))
    .sort((a, b) => b.seats - a.seats || b.percent - a.percent || a.name.localeCompare(b.name));
}

export async function onRequestGet({ params, env }) {
  const surveyId = params.id;
  try {
    // Ensure survey exists
    const survey = await env.DB.prepare(`SELECT id, title FROM surveys WHERE id = ?`).bind(surveyId).first();
    if (!survey) {
      return new Response(JSON.stringify({ error: 'סקר לא נמצא' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch all responses (answers JSON array). We assume the first question is the party selection.
    const { results } = await env.DB.prepare(`SELECT answers FROM responses WHERE survey_id = ?`).bind(surveyId).all();

    const counts = new Map(PARTIES.map((p) => [p, 0]));
    let totalVotes = 0;
    for (const r of results || []) {
      try {
        const arr = JSON.parse(r.answers || '[]');
        const choice = arr[0];
        if (typeof choice === 'string' && counts.has(choice)) {
          counts.set(choice, counts.get(choice) + 1);
          totalVotes += 1;
        }
      } catch (_) {
        // ignore malformed rows
      }
    }

    // Apply threshold and compute shares
    const partiesRaw = Array.from(counts.entries()).map(([name, votes]) => ({ name, votes }));
    const validForThreshold = partiesRaw.filter((p) => totalVotes > 0 && p.votes / totalVotes >= THRESHOLD);
    const filteredTotalVotes = validForThreshold.reduce((s, p) => s + p.votes, 0);

    const shares = (validForThreshold.length ? validForThreshold : partiesRaw).map((p) => ({
      name: p.name,
      votes: p.votes,
      percent: filteredTotalVotes > 0 ? p.votes / filteredTotalVotes : 0
    }));

    const seats = allocateSeatsHare(shares.map((p) => ({ name: p.name, votes: p.votes })));

    const data = seats.map((s) => ({
      party: s.name,
      votes: s.votes,
      percent: +(s.percent * 100).toFixed(2),
      seats: s.seats
    }));

    return new Response(
      JSON.stringify({
        survey: { id: survey.id, title: survey.title },
        totalVotes,
        thresholdPercent: THRESHOLD * 100,
        results: data
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: 'שגיאה בחישוב תוצאות', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
