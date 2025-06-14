import { pool } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT 
        u.id, 
        u.name, 
        u.email,
        (SELECT COUNT(*) FROM messages WHERE sender_id = u.id) as message_count,
        (SELECT MAX(timestamp) FROM messages WHERE sender_id = u.id OR receiver_id = u.id) as last_message_time
      FROM messages m
      JOIN users u ON u.id = m.sender_id
      WHERE u.role = 'customer'
      ORDER BY last_message_time DESC
    `);

    return Response.json(rows);
  } catch (error) {
    console.error('Error fetching senders:', error);
    return Response.json({ 
      error: 'Failed to fetch senders' 
    }, { status: 500 });
  }
}