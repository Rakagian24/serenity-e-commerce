import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { pool } from "./db";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
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
