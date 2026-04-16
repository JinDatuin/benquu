'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Navbar from '@/app/components/Navbar';
import MarkdownEditor from '@/app/components/MarkdownEditor';
import { getNotesByUser, createNote, deleteNote } from '@/lib/db';

type Note = { id: string; title: string; content: string; created_at: { seconds: number } };
type View = 'list' | 'create' | 'open';

export default function Dashboard() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [view, setView] = useState<View>('list');
  const [form, setForm] = useState({ title: '', content: '' });
  const [selected, setSelected] = useState<Note | null>(null);
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' }).then(async res => {
      if (res.status === 401) { router.push('/signin'); return; }
      const { id } = await res.json();
      setUserId(id);
      setNotes(await getNotesByUser(id) as Note[]);
    });
  }, []);

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    await createNote(userId, form.title, form.content || '');
    setForm({ title: '', content: '' });
    setNotes(await getNotesByUser(userId) as Note[]);
    setView('list');
  }

  async function handleDelete(id: string) {
    if (!userId) return;
    await deleteNote(id, userId);
    setView('list');
    setNotes(await getNotesByUser(userId) as Note[]);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', backgroundColor: '#fff' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '40px 24px', maxWidth: '800px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>

        {/* LIST VIEW */}
        {view === 'list' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 500, margin: 0 }}>Notes</h2>
              <button
                onClick={() => { setForm({ title: '', content: '' }); setEditorTab('write'); setView('create'); }}
                style={{ padding: '9px 20px', backgroundColor: '#1a6fd4', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
              >
                + New Note
              </button>
            </div>

            {notes.length === 0 && <p style={{ color: '#aaa', fontSize: '14px' }}>No notes yet. Create your first one!</p>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {notes.map(note => (
                <div
                  key={note.id}
                  onClick={() => { setSelected(note); setView('open'); }}
                  style={{ border: '1px solid #e5e5e5', borderRadius: '6px', padding: '16px 20px', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#1a6fd4')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e5e5')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '15px' }}>{note.title}</strong>
                    <small style={{ color: '#aaa', fontSize: '12px' }}>{new Date(note.created_at.seconds * 1000).toLocaleDateString()}</small>
                  </div>
                  {note.content && (
                    <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {note.content.replace(/[#*`_>~\-\[\]]/g, '').slice(0, 120)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* CREATE VIEW */}
        {view === 'create' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', color: '#1a6fd4', cursor: 'pointer', fontSize: '14px', padding: 0 }}>← Back</button>
              <h2 style={{ fontSize: '22px', fontWeight: 500, margin: 0 }}>New Note</h2>
            </div>

            <form onSubmit={addNote} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                placeholder="Title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
                autoFocus
                style={{ border: 'none', borderBottom: '1px solid #e5e5e5', outline: 'none', fontSize: '22px', fontWeight: 600, padding: '8px 0', backgroundColor: 'transparent', width: '100%', boxSizing: 'border-box' }}
              />

              <MarkdownEditor
                value={form.content}
                onChange={val => setForm({ ...form, content: val })}
                tab={editorTab}
                onTabChange={setEditorTab}
                minHeight={300}
              />

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ padding: '10px 24px', backgroundColor: '#1a6fd4', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  Save Note
                </button>
                <button type="button" onClick={() => setView('list')} style={{ padding: '10px 20px', backgroundColor: '#fff', color: '#555', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}

        {/* OPEN / READ VIEW */}
        {view === 'open' && selected && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', color: '#1a6fd4', cursor: 'pointer', fontSize: '14px', padding: 0 }}>← Back</button>
              <button onClick={() => handleDelete(selected.id)} style={{ background: 'none', border: 'none', color: '#e55', cursor: 'pointer', fontSize: '13px', padding: 0 }}>Delete</button>
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 6px' }}>{selected.title}</h1>
            <small style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '28px' }}>
              {new Date(selected.created_at.seconds * 1000).toLocaleString()}
            </small>

            <div style={{ border: '1px solid #30363d', borderRadius: '6px', padding: '24px', backgroundColor: '#0d1117', color: '#e6edf3' }}>
              <div className="md-preview">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{selected.content}</ReactMarkdown>
              </div>
            </div>

            <style>{`
              .md-preview h1 { font-size: 1.8em; font-weight: 700; border-bottom: 1px solid #30363d; padding-bottom: 0.3em; margin: 0.6em 0 0.4em; }
              .md-preview h2 { font-size: 1.4em; font-weight: 600; border-bottom: 1px solid #30363d; padding-bottom: 0.2em; margin: 0.8em 0 0.4em; }
              .md-preview h3 { font-size: 1.15em; font-weight: 600; margin: 0.8em 0 0.3em; }
              .md-preview p { margin: 0.5em 0; }
              .md-preview ul, .md-preview ol { padding-left: 1.6em; margin: 0.5em 0; }
              .md-preview li { margin: 0.2em 0; }
              .md-preview blockquote { border-left: 3px solid #3d444d; margin: 0.8em 0; padding: 0.4em 1em; color: #8b949e; }
              .md-preview code { background: #21262d; border-radius: 3px; padding: 0.15em 0.4em; font-size: 0.88em; font-family: monospace; color: #f78166; }
              .md-preview pre { background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 16px; overflow-x: auto; margin: 0.8em 0; }
              .md-preview pre code { background: none; color: #e6edf3; padding: 0; }
              .md-preview table { border-collapse: collapse; width: 100%; margin: 0.8em 0; }
              .md-preview th { background: #161b22; font-weight: 600; }
              .md-preview th, .md-preview td { border: 1px solid #30363d; padding: 8px 12px; }
              .md-preview tr:nth-child(even) td { background: #161b22; }
              .md-preview a { color: #58a6ff; }
              .md-preview hr { border: none; border-top: 1px solid #30363d; margin: 1.2em 0; }
              .md-preview del { color: #8b949e; }
              .md-preview strong { font-weight: 700; }
              .md-preview em { font-style: italic; }
              .md-preview input[type=checkbox] { margin-right: 6px; }
            `}</style>
          </>
        )}

      </main>
    </div>
  );
}
