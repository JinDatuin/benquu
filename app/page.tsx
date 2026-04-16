import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";

export default async function Home() {
  const token = (await cookies()).get("token")?.value;
  if (token) {
    try {
      await verifyToken(token);
      redirect("/dashboard");
    } catch {}
  }
  redirect("/signin");
}
