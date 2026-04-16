import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

async function getUserByEmail(email: string) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const res = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: 'users' }],
        where: { fieldFilter: { field: { fieldPath: 'email' }, op: 'EQUAL', value: { stringValue: email } } },
        limit: 1,
      },
    }),
  });
  const data = await res.json();
  const doc = data[0]?.document;
  if (!doc) return null;
  return {
    id: doc.name.split('/').pop() as string,
    email: doc.fields.email.stringValue,
    password: doc.fields.password.stringValue,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const user = await getUserByEmail(email);
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = await signToken({ id: user.id, email: user.email });
    const res = NextResponse.json({ ok: true });
    res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7, sameSite: 'lax' });
    return res;
  } catch (e) {
    console.error('signin error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
