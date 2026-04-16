"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";
import { useTheme } from "./ThemeProvider";

const navItems = [
  { label: "Notes", href: "/dashboard", icon: NotebookPen },
  { label: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { label: "Schedule", href: "/dashboard/schedule", icon: CalendarDays },
  { label: "Storage", href: "/dashboard/storage", icon: HardDrive },
];

function getInitials(email: string) {
  const name = email.split("@")[0];
  const parts = name.split(/[._-]/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function getDisplayName(email: string) {
  const name = email.split("@")[0];
  return name
    .split(/[._-]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" }).then(async (res) => {
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
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function signOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/signin");
  }

  const initials = email ? getInitials(email) : "?";
  const displayName = email ? getDisplayName(email) : "";

  return (
    <>
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        borderBottom: "1px solid var(--nav-border)",
        height: "56px",
        backgroundColor: "var(--nav-bg)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <Link href="/dashboard" style={{
          textDecoration: "none",
          color: "inherit",
          borderBottom: "2px solid #000",
          paddingBottom: "2px",
        }}>
          <span style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.05em" }}>
            LOGO <span style={{ textDecoration: "underline" }}>COMPANY</span>
          </span>
        </Link>

        <nav style={{ display: "flex", gap: "4px" }} className="desktop-nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} style={{
              padding: "8px 20px",
              textDecoration: "none",
              borderBottom: pathname === item.href ? "2px solid #1a6fd4" : "2px solid transparent",
              color: pathname === item.href ? "#1a6fd4" : "var(--nav-color)",
              fontWeight: pathname === item.href ? 600 : 400,
              fontSize: "14px",
              display: "inline-block",
            }}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Profile Avatar + Dropdown */}
        <div ref={dropdownRef} style={{ position: "relative" }} className="desktop-nav">
          <button
            onClick={() => setOpen((v) => !v)}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "6px",
              border: "2px solid #fff",
              backgroundColor: "#1a1a1a",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              letterSpacing: "0.03em",
            }}
          >
            {initials}
          </button>

          {open && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 10px)",
              right: 0,
              width: "220px",
              backgroundColor: "var(--dropdown-bg)",
              border: "1px solid var(--dropdown-border)",
              borderRadius: "10px",
              padding: "12px 0 8px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              zIndex: 200,
            }}>
              {/* Name */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "4px 16px 12px",
                borderBottom: "1px solid var(--dropdown-border)",
              }}>
                <User size={18} color="var(--dropdown-color)" strokeWidth={1.8} />
                <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--dropdown-color)" }}>
                  {displayName}
                </span>
              </div>

              {/* Theme switcher */}
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "6px",
                padding: "12px 16px",
                borderBottom: "1px solid var(--dropdown-border)",
              }}>
                {([
                  { value: "light", Icon: Sun },
                  { value: "dark", Icon: Moon },
                  { value: "system", Icon: Monitor },
                ] as const).map(({ value, Icon }) => (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    title={value.charAt(0).toUpperCase() + value.slice(1)}
                    style={{
                      width: "40px",
                      height: "36px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: theme === value ? "#3a3a3a" : "transparent",
                      color: theme === value ? "#fff" : "#888",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={16} strokeWidth={1.8} />
                  </button>
                ))}
              </div>

              {/* Sign out */}
              <button
                onClick={signOut}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 16px",
                  border: "none",
                  backgroundColor: "transparent",
                  color: "var(--dropdown-color)",
                  fontSize: "14px",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--dropdown-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
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
            <Link key={href} href={href} style={{
              flex: 1,
              textAlign: "center",
              textDecoration: "none",
              color: active ? "#1a6fd4" : "#888",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
              fontSize: "11px",
              fontWeight: active ? 600 : 400,
              padding: "6px 4px",
            }}>
              <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </Link>
          );
        })}
        <button
          onClick={signOut}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3px",
            border: "none",
            backgroundColor: "transparent",
            color: "#888",
            fontSize: "11px",
            padding: "6px 4px",
            cursor: "pointer",
          }}
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
