import pool from '@/lib/db';

export async function GET() {
  try {
    await pool.query('SELECT 1');
    return Response.json({ status: 'ok', database: 'connected' }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ status: 'error', message }, { status: 500 });
  }
}
