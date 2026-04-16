'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { NotebookPen, CheckSquare, CalendarDays, HardDrive, LogOut } from 'lucide-react';

const navItems = [
  { label: 'Notes', href: '/dashboard', icon: NotebookPen },
  { label: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
  { label: 'Schedule', href: '/dashboard/schedule', icon: CalendarDays },
  { label: 'Storage', href: '/dashboard/storage', icon: HardDrive },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await fetch('/api/auth/signout', { method: 'POST' });
    router.push('/signin');
  }

  return (
    <>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', borderBottom: '1px solid #e5e5e5', height: '56px',
        backgroundColor: '#fff', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', color: 'inherit', borderBottom: '2px solid #000', paddingBottom: '2px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em' }}>
            LOGO <span style={{ textDecoration: 'underline' }}>COMPANY</span>
          </span>
        </Link>

        <nav style={{ display: 'flex', gap: '4px' }} className="desktop-nav">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: '8px 20px', textDecoration: 'none',
                borderBottom: pathname === item.href ? '2px solid #1a6fd4' : '2px solid transparent',
                color: pathname === item.href ? '#1a6fd4' : '#555',
                fontWeight: pathname === item.href ? 600 : 400,
                fontSize: '14px', display: 'inline-block',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={signOut}
          className="desktop-nav"
          style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#fff', color: '#555', fontSize: '13px', cursor: 'pointer' }}
        >
          Sign Out
        </button>
      </header>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                flex: 1, textAlign: 'center', textDecoration: 'none',
                color: active ? '#1a6fd4' : '#888',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                fontSize: '11px', fontWeight: active ? 600 : 400, padding: '6px 4px',
              }}
            >
              <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </Link>
          );
        })}
        <button
          onClick={signOut}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
            border: 'none', backgroundColor: 'transparent', color: '#888',
            fontSize: '11px', padding: '6px 4px', cursor: 'pointer',
          }}
        >
          <LogOut size={22} strokeWidth={1.8} />
          Sign Out
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
            background-color: #fff;
            border-top: 1px solid #e5e5e5;
            z-index: 100;
            box-shadow: 0 -1px 10px rgba(0,0,0,0.05);
          }
          .mobile-nav-spacer { display: block; height: 72px; }
        }
      `}</style>
    </>
  );
}
