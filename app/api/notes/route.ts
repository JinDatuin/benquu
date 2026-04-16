import { NextRequest, NextResponse } from 'next/server';
import { getNotesByUser, createNote, deleteNote } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

async function getUser(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const notes = await getNotesByUser(user.id);
    return NextResponse.json(notes);
  } catch (e) {
    console.error('GET /api/notes error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { title, content } = await req.json();
    if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 });
    const id = await createNote(user.id, title, content || '');
    return NextResponse.json({ id, title, content });
  } catch (e) {
    console.error('POST /api/notes error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await req.json();
    await deleteNote(id, user.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('DELETE /api/notes error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
