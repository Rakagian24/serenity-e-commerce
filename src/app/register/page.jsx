"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/login?registered=1");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto">
      <input type="text" placeholder="Name" className="block w-full" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input type="email" placeholder="Email" className="block w-full" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" className="block w-full" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button type="submit" className="mt-4 bg-black text-white px-4 py-2">Register</button>
    </form>
  );
}
