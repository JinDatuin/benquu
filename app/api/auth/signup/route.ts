import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

async function getUserByEmail(email: string) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: "users" }],
          where: {
            fieldFilter: {
              field: { fieldPath: "email" },
              op: "EQUAL",
              value: { stringValue: email },
            },
          },
          limit: 1,
        },
      }),
    },
  );
  const data = await res.json();
  return data[0]?.document ?? null;
}

async function createUser(name: string, email: string, password: string) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          name: { stringValue: name },
          email: { stringValue: email },
          password: { stringValue: password },
        },
      }),
    },
  );
  const data = await res.json();
  return data.name?.split("/").pop() as string;
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password)
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 },
      );

    const existing = await getUserByEmail(email);
    if (existing)
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 },
      );

    const hashed = await bcrypt.hash(password, 10);
    const id = await createUser(name, email, hashed);
    const token = await signToken({ id, email });

    const res = NextResponse.json({ ok: true });
    res.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });
    return res;
  } catch (e) {
    console.error("signup error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
