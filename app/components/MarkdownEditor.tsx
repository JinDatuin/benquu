"use client";
import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  value: string;
  onChange: (val: string) => void;
  tab: "write" | "preview";
  onTabChange: (tab: "write" | "preview") => void;
  placeholder?: string;
  minHeight?: number;
};

type ToolbarAction = {
  label: string;
  title: string;
  action: (selected: string) => { text: string; offset: number };
};

const actions: (ToolbarAction | "sep")[] = [
  {
    label: "H",
    title: "Heading",
    action: (s) => ({ text: s ? `## ${s}` : "## Heading", offset: 3 }),
  },
  {
    label: "B",
    title: "Bold",
    action: (s) => ({ text: `**${s || "bold"}**`, offset: 2 }),
  },
  {
    label: "I",
    title: "Italic",
    action: (s) => ({ text: `*${s || "italic"}*`, offset: 1 }),
  },
  {
    label: "≡",
    title: "Quote",
    action: (s) => ({ text: `> ${s || "quote"}`, offset: 2 }),
  },
  {
    label: "<>",
    title: "Code",
    action: (s) => ({
      text: s?.includes("\n")
        ? `\`\`\`\n${s || "code"}\n\`\`\``
        : `\`${s || "code"}\``,
      offset: 1,
    }),
  },
  {
    label: "🔗",
    title: "Link",
    action: (s) => ({ text: `[${s || "text"}](url)`, offset: 1 }),
  },
  "sep",
  {
    label: "1.",
    title: "Ordered list",
    action: (s) => ({ text: `1. ${s || "item"}`, offset: 3 }),
  },
  {
    label: "•",
    title: "Unordered list",
    action: (s) => ({ text: `- ${s || "item"}`, offset: 2 }),
  },
  {
    label: "☑",
    title: "Task list",
    action: (s) => ({ text: `- [ ] ${s || "task"}`, offset: 6 }),
  },
  "sep",
  {
    label: "—",
    title: "Horizontal rule",
    action: () => ({ text: "\n---\n", offset: 5 }),
  },
  {
    label: "~~",
    title: "Strikethrough",
    action: (s) => ({ text: `~~${s || "text"}~~`, offset: 2 }),
  },
];

export default function MarkdownEditor({
  value,
  onChange,
  tab,
  onTabChange,
  placeholder = "Add your note here...",
  minHeight = 260,
}: Props) {
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
      const pos =
        start +
        offset +
        (selected ? selected.length : text.length - offset * 2);
      el.setSelectionRange(
        selected ? start + offset : start + offset,
        selected
          ? start + offset + selected.length
          : start + text.length - offset,
      );
    }, 0);
  }

  return (
    <div className="border border-[#30363d] rounded-md overflow-hidden bg-[#0d1117] font-sans">
      {/* Tab bar + toolbar */}
      <div className="flex items-center justify-between border-b border-[#30363d] px-3 bg-[#161b22] flex-wrap gap-1">
        {/* Tabs */}
        <div className="flex">
          {(["write", "preview"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onTabChange(t)}
              className={`px-4 py-2 bg-transparent border-0 cursor-pointer text-[13px] font-medium capitalize border-b-2 ${
                tab === t ? "text-[#e6edf3] border-[#f78166]" : "text-[#8b949e] border-transparent"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        {tab === "write" && (
          <div className="flex items-center gap-0.5 py-1 flex-wrap">
            {actions.map((a, i) =>
              a === "sep" ? (
                <div key={i} className="w-px h-[18px] bg-[#30363d] mx-1" />
              ) : (
                <button
                  key={i}
                  type="button"
                  title={a.title}
                  onClick={() => applyAction(a)}
                  className="w-7 h-7 bg-transparent border-0 cursor-pointer text-[#8b949e] text-[13px] font-bold rounded flex items-center justify-center hover:bg-[#21262d] hover:text-[#e6edf3]"
                >
                  {a.label}
                </button>
              ),
            )}
          </div>
        )}
      </div>

      {/* Write pane */}
      {tab === "write" && (
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight: `${minHeight}px` }}
          className="w-full px-4 py-3.5 bg-[#0d1117] text-[#e6edf3] border-0 outline-none text-sm font-mono leading-[1.7] resize-y"
        />
      )}

      {/* Preview pane */}
      {tab === "preview" && (
        <div
          style={{ minHeight: `${minHeight}px` }}
          className="px-4 py-3.5 bg-[#0d1117] text-[#e6edf3]"
        >
          {value ? (
            <div className="md-preview">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-[#484f58] text-sm">Nothing to preview.</p>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-5 px-3.5 py-2 border-t border-[#30363d] bg-[#161b22]">
        <span className="text-xs text-[#8b949e] flex items-center gap-1.5">
          <span className="border border-[#8b949e] rounded px-1 py-px text-[10px] font-bold">M↓</span>
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
