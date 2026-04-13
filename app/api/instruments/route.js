import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(
      `SELECT id, symbol, base, quote
       FROM instruments
       WHERE is_active = 1
       ORDER BY sort_order ASC`
    );
    return Response.json({ success: true, data: rows }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
