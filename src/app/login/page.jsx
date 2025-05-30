"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto p-4">
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="block w-full mb-2" />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="block w-full mb-2" />
      <button type="submit" className="bg-black text-white px-4 py-2 w-full">Login</button>
      <button
        type="button"
        onClick={() => signIn("google")}
        className="bg-red-500 text-white px-4 py-2 w-full mt-2"
      >
        Login dengan Google
      </button>
    </form>
  );
}
