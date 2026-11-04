import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Bell, ChevronRight, Zap, MapPin } from "lucide-react";
import { AppShell, Logo } from "@/components/clube/AppShell";
import { AtendimentoItem } from "@/components/clube/AtendimentoItem";
import { AvaliarSheet } from "@/components/clube/AvaliarSheet";
import { useClube, brl, type Atendimento } from "@/lib/clube-store";
import mascote from "@/assets/mascote.png";

export const Route = createFileRoute("/inicio")({
  head: () => ({
    meta: [
      { title: "Início — Clube G7" },
      { name: "description", content: "Seu saldo de cashback e últimos atendimentos no Clube G7." },
      { property: "og:title", content: "Início — Clube G7" },
      { property: "og:description", content: "Seu saldo de cashback e últimos atendimentos." },
    ],
  }),
  component: Inicio,
});

function Inicio() {
  const { usuario, saldo, atendimentos, setAbrirResgate } = useClube();
  const [avaliando, setAvaliando] = useState<Atendimento | null>(null);
  const pendente = atendimentos.find((a) => !a.avaliacao);
  const primeiroNome = usuario.nome.split(" ")[0];

  const header = (
    <div className="bg-hero pattern-dots rounded-b-[2.5rem] px-5 pb-24 pt-6 text-navy-foreground">
      <div className="flex items-center justify-between">
        <Logo className="text-lg" />
        <button aria-label="Notificações" className="relative grid h-10 w-10 place-items-center rounded-full bg-navy-foreground/10">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary" />
        </button>
      </div>
      <p className="mt-6 text-sm text-navy-foreground/70">Olá, {primeiroNome}</p>
      <h1 className="text-2xl font-extrabold">Bom te ver por aqui!</h1>
    </div>
  );

  return (
    <AppShell header={header}>
      {/* Wallet */}
      <section className="-mt-20 animate-rise">
        <div className="bg-wallet relative overflow-hidden rounded-3xl p-5 text-navy-foreground shadow-lift">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-2xl" />
          <p className="text-xs font-semibold uppercase tracking-widest text-navy-foreground/60">Saldo de cashback</p>
          <p className="font-display mt-1 text-4xl font-extrabold">{brl(saldo)}</p>
          <div className="mt-5 flex gap-2">
            <Link to="/saldo" onClick={() => setAbrirResgate(true)} className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-glow">
              Resgatar <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link to="/saldo" className="flex flex-1 items-center justify-center rounded-2xl bg-navy-foreground/10 py-3 text-sm font-bold">
              Ver extrato
            </Link>
          </div>
        </div>
      </section>

      {/* Avaliação pendente */}
      {pendente && (
        <section className="mt-5 flex items-center gap-3 rounded-3xl bg-accent p-4">
          <img src={mascote} alt="" width={816} height={816} loading="lazy" className="h-16 w-16 shrink-0 rounded-full bg-card object-cover object-top" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-navy">Avalie seu último atendimento</p>
            <p className="truncate text-xs text-accent-foreground/80">{pendente.posto} · leva 10 segundos</p>
          </div>
          <button onClick={() => setAvaliando(pendente)} className="shrink-0 rounded-full bg-navy px-4 py-2 text-xs font-bold text-navy-foreground">
            Avaliar
          </button>
        </section>
      )}

      {/* Promo */}
      <section className="bg-promo relative mt-5 overflow-hidden rounded-3xl p-5 text-primary-foreground">
        <Zap className="absolute -right-4 -top-2 h-32 w-32 rotate-12 opacity-20" strokeWidth={1.5} />
        <span className="rounded-full bg-navy px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-foreground">Promoção</span>
        <h2 className="mt-3 text-2xl font-extrabold leading-tight">Cashback em dobro</h2>
        <p className="mt-1 max-w-[16rem] text-sm font-medium">Abasteça com gasolina aditivada e ganhe o dobro de volta.</p>
      </section>

      {/* Atendimentos */}
      <section className="mt-7">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-navy">Últimos atendimentos</h2>
          <Link to="/saldo" className="flex items-center text-xs font-bold text-sky">
            Ver todos <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <ul className="mt-3 space-y-2.5">
          {atendimentos.slice(0, 3).map((a) => (
            <AtendimentoItem key={a.id} a={a} onAvaliar={setAvaliando} />
          ))}
        </ul>
      </section>

      <section className="mt-5 flex items-center gap-3 rounded-3xl border border-dashed border-border p-4">
        <MapPin className="h-5 w-5 shrink-0 text-sky" />
        <p className="flex-1 text-sm text-muted-foreground">Encontre o posto Grupo 7 mais perto de você</p>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </section>

      <AvaliarSheet atendimento={avaliando} onClose={() => setAvaliando(null)} />
    </AppShell>
  );
}
