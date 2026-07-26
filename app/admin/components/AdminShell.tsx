"use client";

import {
  BookOpenText,
  ContactRound,
  FileText,
  FolderKanban,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  Settings,
  UsersRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const navigation = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/content", label: "Site content", icon: FileText },
  { href: "/admin/board", label: "Board", icon: UsersRound },
  { href: "/admin/submissions", label: "Submissions", icon: ContactRound },
  { href: "/admin/media", label: "Media", icon: Images },
  { href: "/admin/account", label: "Account", icon: Settings },
] as const;

export function AdminShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function signOut() {
    await authClient.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  const nav = (
    <>
      <div className="flex h-16 items-center border-b border-white/15 px-5">
        <Link
          href="/admin"
          className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <img
            src="/brand/logo-white.png"
            alt="IHBA"
            className="h-8 w-auto object-contain"
          />
          <span className="border-l border-white/20 pl-3 text-sm font-semibold text-white">
            Admin
          </span>
        </Link>
      </div>

      <nav aria-label="Admin navigation" className="flex-1 px-3 py-5">
        <ul className="space-y-1">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/admin"
                ? pathname === href
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-11 items-center gap-3 px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                    active
                      ? "bg-white text-navy-ink"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/15 p-3">
        <p className="truncate px-3 pb-2 text-xs text-white/55">{userName}</p>
        <button
          type="button"
          onClick={signOut}
          className="flex min-h-11 w-full items-center gap-3 px-3 text-sm font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-navy-ink lg:flex">
        {nav}
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-navy-ink/45"
            onClick={() => setOpen(false)}
          />
          <aside className="relative flex h-full w-72 flex-col bg-navy-ink">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 grid size-10 place-items-center text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label="Close navigation"
            >
              <X className="size-5" />
            </button>
            {nav}
          </aside>
        </div>
      )}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-white px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="grid size-11 place-items-center text-navy-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </button>
          <div className="hidden items-center gap-2 text-sm text-ink/55 lg:flex">
            <BookOpenText className="size-4" aria-hidden="true" />
            IHBA content workspace
          </div>
          <Link
            href="/"
            target="_blank"
            className="text-sm font-semibold text-navy hover:text-azure-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
          >
            View website
          </Link>
        </header>

        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
