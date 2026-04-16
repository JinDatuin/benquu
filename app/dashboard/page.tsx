'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Navbar from '@/app/components/Navbar';
import MarkdownEditor from '@/app/components/MarkdownEditor';
import { getNotesByUser, createNote, deleteNote } from '@/lib/db';

type Note = {
  id: string;
  title: string;
  content: string;
  created_at: { seconds: number };
};
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
    fetch('/api/auth/me', { credentials: 'include' }).then(async (res) => {
      if (res.status === 401) {
        router.push('/signin');
        return;
      }
      const { id } = await res.json();
      setUserId(id);
      setNotes((await getNotesByUser(id)) as Note[]);
    });
  }, []);

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    await createNote(userId, form.title, form.content || '');
    setForm({ title: '', content: '' });
    setNotes((await getNotesByUser(userId)) as Note[]);
    setView('list');
  }

  async function handleDelete(id: string) {
    if (!userId) return;
    await deleteNote(id, userId);
    setView('list');
    setNotes((await getNotesByUser(userId)) as Note[]);
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Navbar />

      <main className="flex-1 px-6 py-10 w-full max-w-[800px] mx-auto">
        {/* LIST VIEW */}
        {view === 'list' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-medium m-0">Notes</h2>
              <button
                onClick={() => {
                  setForm({ title: '', content: '' });
                  setEditorTab('write');
                  setView('create');
                }}
                className="px-5 py-2 bg-[#1a6fd4] text-white border-0 rounded text-sm font-semibold cursor-pointer"
              >
                + New Note
              </button>
            </div>

            {notes.length === 0 && (
              <p className="text-[#aaa] text-sm">No notes yet. Create your first one!</p>
            )}

            <div className="flex flex-col gap-2.5">
              {notes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => {
                    setSelected(note);
                    setView('open');
                  }}
                  className="border border-[#e5e5e5] rounded-md px-5 py-4 cursor-pointer hover:border-[#1a6fd4] transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <strong className="text-[15px]">{note.title}</strong>
                    <small className="text-[#aaa] text-xs">
                      {new Date(note.created_at.seconds * 1000).toLocaleDateString()}
                    </small>
                  </div>
                  {note.content && (
                    <p className="mt-1.5 text-[13px] text-[#888] whitespace-nowrap overflow-hidden text-ellipsis">
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
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => setView('list')}
                className="bg-transparent border-0 text-[#1a6fd4] cursor-pointer text-sm p-0"
              >
                ← Back
              </button>
              <h2 className="text-[22px] font-medium m-0">New Note</h2>
            </div>

            <form onSubmit={addNote} className="flex flex-col gap-4">
              <input
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                autoFocus
                className="border-0 border-b border-[#e5e5e5] outline-none text-[22px] font-semibold py-2 bg-transparent w-full"
              />

              <MarkdownEditor
                value={form.content}
                onChange={(val) => setForm({ ...form, content: val })}
                tab={editorTab}
                onTabChange={setEditorTab}
                minHeight={300}
              />

              <div className="flex gap-2.5">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1a6fd4] text-white border-0 rounded text-sm font-semibold cursor-pointer"
                >
                  Save Note
                </button>
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className="px-5 py-2.5 bg-white text-[#555] border border-[#ddd] rounded text-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}

        {/* OPEN / READ VIEW */}
        {view === 'open' && selected && (
          <>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setView('list')}
                className="bg-transparent border-0 text-[#1a6fd4] cursor-pointer text-sm p-0"
              >
                ← Back
              </button>
              <button
                onClick={() => handleDelete(selected.id)}
                className="bg-transparent border-0 text-[#e55] cursor-pointer text-[13px] p-0"
              >
                Delete
              </button>
            </div>

            <h1 className="text-[28px] font-bold mb-1.5">{selected.title}</h1>
            <small className="text-[#aaa] text-xs block mb-7">
              {new Date(selected.created_at.seconds * 1000).toLocaleString()}
            </small>

            <div className="border border-[#30363d] rounded-md p-6 bg-[#0d1117] text-[#e6edf3]">
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
