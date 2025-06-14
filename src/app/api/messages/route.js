import { pool } from "@/lib/db";

export async function POST(req) {
  try {
    const { senderId, receiverId, message } = await req.json();

    const [result] = await pool.query(`
      INSERT INTO messages (sender_id, receiver_id, message)
      VALUES (?, ?, ?)
    `, [senderId, receiverId, message]);

    return Response.json({ 
      success: true, 
      messageId: result.insertId 
    });
  } catch (error) {
    console.error('Error saving message:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to save message' 
    }, { status: 500 });
  }
}