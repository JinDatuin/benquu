'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  NotebookPen,
  CheckSquare,
  CalendarDays,
  HardDrive,
  LogOut,
  Sun,
  Moon,
  Monitor,
  User,
} from 'lucide-react';
import { useTheme } from './ThemeProvider';

const navItems = [
  { label: 'Notes', href: '/dashboard', icon: NotebookPen },
  { label: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
  { label: 'Schedule', href: '/dashboard/schedule', icon: CalendarDays },
  { label: 'Storage', href: '/dashboard/storage', icon: HardDrive },
];

function getInitials(email: string) {
  const name = email.split('@')[0];
  const parts = name.split(/[._-]/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

function getDisplayName(email: string) {
  const name = email.split('@')[0];
  return name
    .split(/[._-]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' }).then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        setEmail(data.email);
      }
    });
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function signOut() {
    await fetch('/api/auth/signout', { method: 'POST' });
    router.push('/signin');
  }

  const initials = email ? getInitials(email) : '?';
  const displayName = email ? getDisplayName(email) : '';

  return (
    <>
      <header className="flex items-center justify-between px-8 border-b border-[var(--nav-border)] h-14 bg-[var(--nav-bg)] sticky top-0 z-[100]">
        <Link
          href="/dashboard"
          className="no-underline text-inherit border-b-2 border-black pb-0.5"
        >
          <span className="text-sm font-bold tracking-[0.05em]">
            LOGO <span className="underline">COMPANY</span>
          </span>
        </Link>

        <nav className="desktop-nav flex gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-5 py-2 no-underline text-sm inline-block border-b-2 ${
                pathname === item.href
                  ? 'border-[#1a6fd4] text-[#1a6fd4] font-semibold'
                  : 'border-transparent text-[var(--nav-color)] font-normal'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Profile Avatar + Dropdown */}
        <div ref={dropdownRef} className="desktop-nav relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="w-9 h-9 rounded-md border-2 border-white bg-[#1a1a1a] text-white text-[13px] font-bold cursor-pointer flex items-center justify-center tracking-[0.03em]"
          >
            {initials}
          </button>

          {open && (
            <div className="absolute top-[calc(100%+10px)] right-0 w-[220px] bg-[var(--dropdown-bg)] border border-[var(--dropdown-border)] rounded-[10px] pt-3 pb-2 shadow-[0_8px_24px_rgba(0,0,0,0.3)] z-[200]">
              <div className="flex items-center gap-2.5 px-4 pb-3 border-b border-[var(--dropdown-border)]">
                <User size={18} color="var(--dropdown-color)" strokeWidth={1.8} />
                <span className="text-sm font-semibold text-[var(--dropdown-color)]">
                  {displayName}
                </span>
              </div>

              <div className="flex justify-center gap-1.5 px-4 py-3 border-b border-[var(--dropdown-border)]">
                {(
                  [
                    { value: 'light', Icon: Sun },
                    { value: 'dark', Icon: Moon },
                    { value: 'system', Icon: Monitor },
                  ] as const
                ).map(({ value, Icon }) => (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    title={value.charAt(0).toUpperCase() + value.slice(1)}
                    className={`w-10 h-9 rounded-lg border-0 cursor-pointer flex items-center justify-center ${
                      theme === value ? 'bg-[#3a3a3a] text-white' : 'bg-transparent text-[#888]'
                    }`}
                  >
                    <Icon size={16} strokeWidth={1.8} />
                  </button>
                ))}
              </div>

              <button
                onClick={signOut}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 border-0 bg-transparent text-[var(--dropdown-color)] text-sm cursor-pointer text-left hover:bg-[var(--dropdown-hover)]"
              >
                <LogOut size={16} strokeWidth={1.8} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 text-center no-underline flex flex-col items-center gap-[3px] text-[11px] px-1 py-1.5 ${
                active ? 'text-[#1a6fd4] font-semibold' : 'text-[#888] font-normal'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </Link>
          );
        })}
        <button
          onClick={signOut}
          className="flex-1 flex flex-col items-center gap-[3px] border-0 bg-transparent text-[#888] text-[11px] px-1 py-1.5 cursor-pointer"
        >
          <LogOut size={22} strokeWidth={1.8} />
          Sign out
        </button>
      </nav>

      <div className="mobile-nav-spacer" />

      <style>{`
        .desktop-nav { display: flex; }
        .mobile-nav { display: none; }
        .mobile-nav-spacer { display: none; }

        @media (max-width: 640px) {
          header { padding: 0 16px; }
          .desktop-nav { display: none !important; }
          .mobile-nav {
            display: flex !important;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
            padding: 10px 12px;
            background-color: var(--nav-bg);
            border-top: 1px solid var(--nav-border);
            z-index: 100;
            box-shadow: 0 -1px 10px rgba(0,0,0,0.05);
          }
          .mobile-nav-spacer { display: block; height: 72px; }
        }
      `}</style>
    </>
  );
}
