// Cloudflare Pages Function: GET /api/surveys
// Uses D1 database (env.DB binding from wrangler.toml)

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT s.id, s.title, s.description,
        COALESCE(json_group_array(json_object(
          'id', q.id,
          'question', q.question,
          'type', q.type,
          'options', q.options
        )), '[]') as questions
      FROM surveys s
      LEFT JOIN questions q ON q.survey_id = s.id
      GROUP BY s.id
    `).all();

    const surveys = (results || []).map((r) => {
      let questions = [];
      try {
        questions = JSON.parse(r.questions || '[]')
          .filter((q) => q && q.id !== null)
          .map((q) => ({
            ...q,
            options:
              typeof q.options === 'string' && q.options?.trim()?.startsWith('[')
                ? JSON.parse(q.options)
                : Array.isArray(q.options)
                ? q.options
                : []
          }));
      } catch (_) {
        questions = [];
      }
      return {
        id: r.id,
        _id: r.id, // Frontend may use either id or _id
        title: r.title,
        description: r.description,
        questions
      };
    });

    return new Response(JSON.stringify(surveys), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'שגיאה בטעינת סקרים', details: err.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
