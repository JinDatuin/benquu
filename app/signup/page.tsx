"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) window.location.href = "/dashboard";
    else setError((await res.json()).error);
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="flex flex-col items-center mt-4">
        <div className="w-full max-w-[500px] border border-gray-200 rounded-lg px-12 pt-12 pb-10 bg-white">
          <h1 className="text-center text-[40px] font-normal mb-2">Sign up</h1>
          <p className="text-center text-[#444] text-sm mb-10">Sign up to continue</p>

          <form onSubmit={handleSubmit}>
            {["name", "email", "password"].map((field) => (
              <div key={field} className="mb-7">
                <input
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  type={field === "email" ? "email" : field === "password" ? "password" : "text"}
                  value={form[field as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  required
                  className="w-full border-0 border-b border-[#aaa] outline-none text-[15px] py-2 text-[#333] bg-transparent"
                />
              </div>
            ))}

            {error && <p className="text-red-500 text-[13px] mb-3">{error}</p>}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#1a6fd4] text-white border-0 rounded font-semibold text-base cursor-pointer mb-4"
            >
              Sign up
            </button>

            <label className="flex items-center gap-2 text-sm cursor-pointer mb-7">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-[#1a6fd4] w-4 h-4"
              />
              Remember me
            </label>
          </form>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[11px] tracking-wider text-[#888] font-semibold">ACCESS QUICKLY</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="flex gap-3 justify-center">
            {["Google", "Linkedin", "SSO"].map((provider) => (
              <button
                key={provider}
                className="flex-1 py-2.5 border border-gray-200 rounded bg-white text-[#1a6fd4] font-semibold text-sm cursor-pointer"
              >
                {provider}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-sm text-[#555]">
          Already have an account?{" "}
          <Link href="/signin" className="text-[#1a6fd4] no-underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
