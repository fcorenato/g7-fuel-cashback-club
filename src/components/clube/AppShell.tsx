import { Link, useNavigate } from "@tanstack/react-router";
import { Home, Wallet, Receipt, UserRound } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useClube } from "@/lib/clube-store";

const tabs = [
  { to: "/inicio", label: "Início", icon: Home },
  { to: "/saldo", label: "Saldo", icon: Wallet },
  { to: "/resgates", label: "Resgates", icon: Receipt },
  { to: "/conta", label: "Conta", icon: UserRound },
] as const;

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display inline-flex items-baseline gap-1 font-extrabold ${className}`}>
      Clube <span className="rounded-lg bg-primary px-1.5 text-primary-foreground">G7</span>
      <span className="text-primary">+</span>
    </span>
  );
}

export function AppShell({ children, header }: { children: ReactNode; header?: ReactNode }) {
  const { logado } = useClube();
  const navigate = useNavigate();
  useEffect(() => {
    if (!logado) navigate({ to: "/" });
  }, [logado, navigate]);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      {header}
      <main className="flex-1 px-4 pb-28">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-4 pb-safe">
        <div className="grid grid-cols-4 rounded-3xl bg-navy p-1.5 shadow-lift">
          {tabs.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col items-center gap-0.5 rounded-2xl py-2 text-[11px] font-semibold text-navy-foreground/60 transition-colors data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="px-5 pb-4 pt-6">
      <Logo className="text-base text-navy" />
      <h1 className="mt-4 text-3xl font-extrabold text-navy">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </header>
  );
}
