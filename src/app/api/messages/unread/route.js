import { pool } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return Response.json({ error: 'Missing userId' }, { status: 400 });
    }

    const [rows] = await pool.query(`
      SELECT COUNT(*) as unread_count
      FROM messages 
      WHERE receiver_id = ? 
      AND timestamp > (
        SELECT COALESCE(last_read_at, '1970-01-01') 
        FROM user_chat_status 
        WHERE user_id = ? 
        LIMIT 1
      )
    `, [userId, userId]);

    return Response.json({ unreadCount: rows[0]?.unread_count || 0 });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return Response.json({ unreadCount: 0 });
  }
}