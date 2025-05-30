import { pool } from "@/lib/db";

export async function POST(req) {
  const { senderId, receiverId, message } = await req.json();

  await pool.query(`
    INSERT INTO messages (sender_id, receiver_id, message)
    VALUES (?, ?, ?)
  `, [senderId, receiverId, message]);

  return Response.json({ success: true });
}
