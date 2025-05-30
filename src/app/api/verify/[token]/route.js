import { pool } from "@/lib/db";

export async function GET(req, { params }) {
  const token = params.token;
  const [rows] = await pool.query("SELECT * FROM verification_tokens WHERE token = ?", [token]);
  const record = rows[0];

  if (!record) return new Response("Token tidak valid", { status: 400 });

  // Tandai sebagai terverifikasi
  await pool.query("UPDATE users SET email_verified = 1 WHERE email = ?", [record.identifier]);
  await pool.query("DELETE FROM verification_tokens WHERE token = ?", [token]);

  return new Response("Email berhasil diverifikasi. Silakan login.", {
    status: 200,
    headers: {
      Location: "/login?verified=1",
    },
  });
}
