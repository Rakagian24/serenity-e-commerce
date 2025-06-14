import { pool } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const senderId = searchParams.get('senderId');
    const receiverId = searchParams.get('receiverId');

    if (!senderId || !receiverId) {
      return Response.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const [rows] = await pool.query(`
      SELECT 
        id,
        sender_id as senderId, 
        receiver_id as receiverId, 
        message, 
        timestamp
      FROM messages 
      WHERE (sender_id = ? AND receiver_id = ?) 
      OR (sender_id = ? AND receiver_id = ?)
      ORDER BY timestamp ASC
      LIMIT 100
    `, [senderId, receiverId, receiverId, senderId]);

    return Response.json(rows);
  } catch (error) {
    console.error('Error fetching message history:', error);
    return Response.json({ 
      error: 'Failed to fetch messages' 
    }, { status: 500 });
  }
}