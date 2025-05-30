import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req) {
  const { name, email, password } = await req.json();

  const [exist] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
  if (exist.length > 0) return new Response("Email already exists", { status: 400 });

  const hashed = await bcrypt.hash(password, 10);
  await pool.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashed]);

  // Email notification (optional: using Mailtrap / SMTP)
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "68739b7d92813d",
      pass: "95c9b08693bf26",
    },
  });

  await transporter.sendMail({
    from: '"Serenity App" <no-reply@serenity.com>',
    to: email,
    subject: "Registrasi Berhasil",
    html: `<p>Halo ${name},<br>Terima kasih telah mendaftar di Serenity!</p>`,
  });

  const token = crypto.randomBytes(32).toString("hex");
  await pool.query("INSERT INTO verification_tokens (identifier, token, expires) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 DAY))", [email, token]);

  await transporter.sendMail({
    from: '"Serenity App" <no-reply@serenity.com>',
    to: email,
    subject: "Verifikasi Email Anda",
    html: `<p>Halo ${name}, klik link berikut untuk verifikasi akun kamu:</p>
           <a href="${process.env.NEXTAUTH_URL}/api/verify/${token}">Verifikasi Email</a>`,
  });

  return new Response("Success", { status: 200 });
}
