'use client';
import { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = {
  value: string;
  onChange: (val: string) => void;
  tab: 'write' | 'preview';
  onTabChange: (tab: 'write' | 'preview') => void;
  placeholder?: string;
  minHeight?: number;
};

type ToolbarAction = {
  label: string;
  title: string;
  action: (selected: string) => { text: string; offset: number };
};

const actions: (ToolbarAction | 'sep')[] = [
  { label: 'H', title: 'Heading', action: (s) => ({ text: s ? `## ${s}` : '## Heading', offset: 3 }) },
  { label: 'B', title: 'Bold', action: (s) => ({ text: `**${s || 'bold'}**`, offset: 2 }) },
  { label: 'I', title: 'Italic', action: (s) => ({ text: `*${s || 'italic'}*`, offset: 1 }) },
  { label: '≡', title: 'Quote', action: (s) => ({ text: `> ${s || 'quote'}`, offset: 2 }) },
  { label: '<>', title: 'Code', action: (s) => ({ text: s?.includes('\n') ? `\`\`\`\n${s || 'code'}\n\`\`\`` : `\`${s || 'code'}\``, offset: 1 }) },
  { label: '🔗', title: 'Link', action: (s) => ({ text: `[${s || 'text'}](url)`, offset: 1 }) },
  'sep',
  { label: '1.', title: 'Ordered list', action: (s) => ({ text: `1. ${s || 'item'}`, offset: 3 }) },
  { label: '•', title: 'Unordered list', action: (s) => ({ text: `- ${s || 'item'}`, offset: 2 }) },
  { label: '☑', title: 'Task list', action: (s) => ({ text: `- [ ] ${s || 'task'}`, offset: 6 }) },
  'sep',
  { label: '—', title: 'Horizontal rule', action: () => ({ text: '\n---\n', offset: 5 }) },
  { label: '~~', title: 'Strikethrough', action: (s) => ({ text: `~~${s || 'text'}~~`, offset: 2 }) },
];

export default function MarkdownEditor({ value, onChange, tab, onTabChange, placeholder = 'Add your note here...', minHeight = 260 }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function applyAction(action: ToolbarAction) {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);
    const { text, offset } = action.action(selected);
    const next = value.slice(0, start) + text + value.slice(end);
    onChange(next);
    setTimeout(() => {
      el.focus();
      const pos = start + offset + (selected ? selected.length : text.length - offset * 2);
      el.setSelectionRange(selected ? start + offset : start + offset, selected ? start + offset + selected.length : start + text.length - offset);
    }, 0);
  }

  return (
    <div style={{ border: '1px solid #30363d', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#0d1117', fontFamily: 'sans-serif' }}>
      {/* Tab bar + toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #30363d', padding: '0 12px', backgroundColor: '#161b22', flexWrap: 'wrap', gap: '4px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex' }}>
          {(['write', 'preview'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => onTabChange(t)}
              style={{
                padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: 500, color: tab === t ? '#e6edf3' : '#8b949e',
                borderBottom: tab === t ? '2px solid #f78166' : '2px solid transparent',
                textTransform: 'capitalize',
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        {tab === 'write' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '4px 0', flexWrap: 'wrap' }}>
            {actions.map((a, i) =>
              a === 'sep' ? (
                <div key={i} style={{ width: '1px', height: '18px', backgroundColor: '#30363d', margin: '0 4px' }} />
              ) : (
                <button
                  key={i}
                  type="button"
                  title={a.title}
                  onClick={() => applyAction(a)}
                  style={{
                    width: '28px', height: '28px', background: 'none', border: 'none', cursor: 'pointer',
                    color: '#8b949e', fontSize: '13px', fontWeight: 700, borderRadius: '4px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#21262d'; e.currentTarget.style.color = '#e6edf3'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8b949e'; }}
                >
                  {a.label}
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* Write pane */}
      {tab === 'write' && (
        <textarea
          ref={ref}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%', minHeight: `${minHeight}px`, padding: '14px 16px',
            backgroundColor: '#0d1117', color: '#e6edf3', border: 'none', outline: 'none',
            fontSize: '14px', fontFamily: 'monospace', lineHeight: '1.7', resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
      )}

      {/* Preview pane */}
      {tab === 'preview' && (
        <div style={{ minHeight: `${minHeight}px`, padding: '14px 16px', backgroundColor: '#0d1117', color: '#e6edf3' }}>
          {value ? (
            <div className="md-preview">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            </div>
          ) : (
            <p style={{ color: '#484f58', fontSize: '14px' }}>Nothing to preview.</p>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '8px 14px', borderTop: '1px solid #30363d', backgroundColor: '#161b22' }}>
        <span style={{ fontSize: '12px', color: '#8b949e', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ border: '1px solid #8b949e', borderRadius: '3px', padding: '1px 4px', fontSize: '10px', fontWeight: 700 }}>M↓</span>
          Markdown is supported
        </span>
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
    </div>
  );
}
