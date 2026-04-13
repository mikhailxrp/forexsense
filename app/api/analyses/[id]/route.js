import pool from '@/lib/db';

export async function GET(request, context) {
  try {
    const params = await Promise.resolve(context.params);
    const id = params?.id;

    if (id === undefined || id === null || id === '') {
      return Response.json(
        { success: false, error: 'Invalid analysis id' },
        { status: 400 }
      );
    }

    const [[analysis]] = await pool.query('SELECT * FROM analyses WHERE id = ?', [
      id
    ]);

    if (!analysis) {
      return Response.json(
        { success: false, error: 'Analysis not found' },
        { status: 404 }
      );
    }

    const [news] = await pool.query(
      'SELECT * FROM news_items WHERE analysis_id = ? ORDER BY published_at DESC',
      [id]
    );

    const [events] = await pool.query(
      'SELECT * FROM key_events WHERE analysis_id = ? ORDER BY event_time ASC',
      [id]
    );

    return Response.json({
      success: true,
      data: {
        ...analysis,
        news,
        key_events: events.map((e) => ({
          time: formatTime(e.event_time),
          event: e.event_name,
          currency: e.currency,
          impact: e.impact
        }))
      }
    });
  } catch (error) {
    console.error('Analysis by ID error:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch analysis' },
      { status: 500 }
    );
  }
}

/** MySQL TIME → "HH:MM" for UI */
function formatTime(value) {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'string') {
    return value.slice(0, 5);
  }
  if (value instanceof Date) {
    const h = String(value.getUTCHours()).padStart(2, '0');
    const m = String(value.getUTCMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }
  return String(value);
}
