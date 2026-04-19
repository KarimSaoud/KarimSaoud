import { ReactNode } from "react";
import Link from "next/link";
import { CalendarDays, Home, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

type AppShellProps = {
  children: ReactNode;
  currentPath?: "/" | "/history" | "/profile";
};

export function AppShell({ children, currentPath = "/" }: AppShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-[calc(1.25rem+env(safe-area-inset-top))] sm:max-w-3xl sm:px-6 lg:max-w-5xl">
      <header className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-muted-foreground">Food Journal</p>
          <h1 className="mt-2 text-[1.65rem] font-semibold leading-tight tracking-tight sm:text-3xl">Cibo, acqua e bevande</h1>
        </div>
        <div className="hidden rounded-lg border border-border bg-card p-1 sm:flex">
          <NavLink href="/" active={currentPath === "/"}>
            <Home className="h-4 w-4" />
            Oggi
          </NavLink>
          <NavLink href="/history" active={currentPath === "/history"}>
            <CalendarDays className="h-4 w-4" />
            Storico
          </NavLink>
          <NavLink href="/profile" active={currentPath === "/profile"}>
            <UserRound className="h-4 w-4" />
            Profilo
          </NavLink>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <nav className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-1/2 z-30 flex w-[calc(100%-24px)] max-w-sm -translate-x-1/2 rounded-lg border border-border bg-card/95 p-2 shadow-soft backdrop-blur sm:hidden">
        <NavLink href="/" active={currentPath === "/"}>
          <Home className="h-4 w-4" />
          Oggi
        </NavLink>
        <NavLink href="/history" active={currentPath === "/history"}>
          <CalendarDays className="h-4 w-4" />
          Storico
        </NavLink>
        <NavLink href="/profile" active={currentPath === "/profile"}>
          <UserRound className="h-4 w-4" />
          Profilo
        </NavLink>
      </nav>
    </div>
  );
}

function NavLink({
  href,
  active,
  children
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm transition",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}
