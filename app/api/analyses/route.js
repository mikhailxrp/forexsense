import pool from '@/lib/db';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pair = searchParams.get('pair');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const limitRaw = parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT), 10);
    const offsetRaw = parseInt(searchParams.get('offset') || '0', 10);
    const limit = Number.isFinite(limitRaw)
      ? Math.min(Math.max(limitRaw, 1), MAX_LIMIT)
      : DEFAULT_LIMIT;
    const offset = Number.isFinite(offsetRaw) && offsetRaw >= 0 ? offsetRaw : 0;

    const where = [];
    const params = [];

    if (pair) {
      where.push('pair = ?');
      params.push(pair);
    }
    if (from) {
      where.push('analysis_date >= ?');
      params.push(from);
    }
    if (to) {
      where.push('analysis_date <= ?');
      params.push(to);
    }

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    const [rows] = await pool.query(
      `SELECT id, pair, sentiment, signal_strength, analysis_date, created_at
       FROM analyses
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const [[countRow]] = await pool.query(
      `SELECT COUNT(*) AS total FROM analyses ${whereClause}`,
      params
    );

    const total = countRow?.total ?? 0;

    return Response.json({
      success: true,
      data: rows,
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('Analyses API error:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch analyses' },
      { status: 500 }
    );
  }
}
