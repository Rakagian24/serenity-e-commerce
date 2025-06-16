import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import axios from "axios";
import { pool } from "./db";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        const captchaToken = credentials?.captcha;
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;

        if (!captchaToken) {
          console.error("Captcha token missing.");
          throw new Error("Missing reCAPTCHA token.");
        }

        try {
          const params = new URLSearchParams();
          params.append("secret", secretKey);
          params.append("response", captchaToken);

          const { data } = await axios.post(
            "https://www.google.com/recaptcha/api/siteverify",
            params,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          if (!data.success) {
            console.error("reCAPTCHA verification failed:", data);
            throw new Error("reCAPTCHA verification failed");
          }
        } catch (error) {
          console.error("reCAPTCHA error:", error);
          throw new Error("Failed to verify reCAPTCHA");
        }

        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [credentials.email]);
        const user = rows[0];
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
},
      async authorize(credentials) {
        const captchaToken = credentials.captcha;
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;

        try {
          const params = new URLSearchParams();
          params.append("secret", secretKey);
          params.append("response", captchaToken);

          const { data } = await axios.post(
            "https://www.google.com/recaptcha/api/siteverify",
            params,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          if (!data.success) {
            console.error("reCAPTCHA verification failed:", data);
            throw new Error("reCAPTCHA verification failed");
          }
        } catch (error) {
          console.error("reCAPTCHA error:", error);
          throw new Error("Failed to verify reCAPTCHA");
        }

        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [credentials.email]);
        const user = rows[0];
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [profile.email]);
        if (existing.length === 0) {
          const [result] = await pool.query(
            "INSERT INTO users (name, email, image, role) VALUES (?, ?, ?, ?)",
            [profile.name, profile.email, profile.picture, "customer"]
          );
          token.id = result.insertId;
        } else {
          token.id = existing[0].id;
        }
        token.role = "customer";
      }

      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
