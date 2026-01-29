// Cloudflare Pages Function: GET /api/surveys/:id
// Uses D1 database

export async function onRequestGet({ params, env }) {
  const id = params.id;
  try {
    const survey = await env.DB.prepare(`SELECT * FROM surveys WHERE id = ?`).bind(id).first();
    
    if (!survey) {
      return new Response(JSON.stringify({ error: 'סקר לא נמצא' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { results: questions } = await env.DB.prepare(`
      SELECT id, question, type, options FROM questions WHERE survey_id = ?
    `).bind(id).all();
    
    const result = {
      ...survey,
      _id: survey.id,
      questions: questions.map(q => ({
        ...q,
        options: q.options ? JSON.parse(q.options) : []
      }))
    };
    
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'שגיאה באחזור סקר', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}