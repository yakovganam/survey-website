// Cloudflare Pages Function: POST /api/surveys/:id/responses
// Uses D1 database

export async function onRequestPost({ request, params, env }) {
  const surveyId = params.id;
  try {
    const body = await request.json();
    const answers = body?.answers;
    
    if (!Array.isArray(answers)) {
      return new Response(JSON.stringify({ error: 'answers חייב להיות מערך' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Verify survey exists
    const survey = await env.DB.prepare(`SELECT id FROM surveys WHERE id = ?`).bind(surveyId).first();
    if (!survey) {
      return new Response(JSON.stringify({ error: 'סקר לא נמצא' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get question count
    const { count } = await env.DB.prepare(`SELECT COUNT(*) as count FROM questions WHERE survey_id = ?`).bind(surveyId).first();
    
    if (answers.length !== count) {
      return new Response(JSON.stringify({ error: 'מספר התשובות לא תואם למספר השאלות' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Insert response
    const result = await env.DB.prepare(`
      INSERT INTO responses (survey_id, answers, submitted_at)
      VALUES (?, ?, datetime('now'))
    `).bind(surveyId, JSON.stringify(answers)).run();
    
    return new Response(JSON.stringify({ message: 'התשובות נשלחו בהצלחה', id: result.lastRowId }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'שגיאה בשליחת תשובות', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}