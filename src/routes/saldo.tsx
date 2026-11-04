import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowUpRight, TrendingUp, ArrowDownLeft, PiggyBank } from "lucide-react";
import { AppShell, PageHeader } from "@/components/clube/AppShell";
import { AtendimentoItem } from "@/components/clube/AtendimentoItem";
import { AvaliarSheet } from "@/components/clube/AvaliarSheet";
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useClube, brl, type Atendimento } from "@/lib/clube-store";

export const Route = createFileRoute("/saldo")({
  head: () => ({
    meta: [
      { title: "Saldo — Clube G7" },
      { name: "description", content: "Saldo, resumo de cashback e histórico de atendimentos." },
      { property: "og:title", content: "Saldo — Clube G7" },
      { property: "og:description", content: "Saldo, resumo de cashback e histórico de atendimentos." },
    ],
  }),
  component: Saldo,
});

function Saldo() {
  const { saldo, acumulado, resgatado, atendimentos, resgatar } = useClube();
  const { abrirResgate: abrir, setAbrirResgate } = useClube();
  const navigate = useNavigate();
  const [avaliando, setAvaliando] = useState<Atendimento | null>(null);
  const [centavos, setCentavos] = useState(0);
  const valor = centavos / 100;
  const fecharResgate = () => {
    setCentavos(0);
    setAbrirResgate(false);
  };

  return (
    <AppShell header={<PageHeader title="Seu saldo" subtitle="Acompanhe tudo o que você ganhou" />}>
      <section className="bg-wallet rounded-3xl p-5 text-navy-foreground shadow-lift animate-rise">
        <p className="text-xs font-semibold uppercase tracking-widest text-navy-foreground/60">Disponível</p>
        <p className="font-display mt-1 text-4xl font-extrabold">{brl(saldo)}</p>
        <Button onClick={() => setAbrirResgate(true)} size="lg" className="mt-5 h-12 w-full rounded-2xl font-bold shadow-glow">
          Resgatar cashback <ArrowUpRight className="h-4 w-4" />
        </Button>
      </section>

      <section className="mt-4 grid grid-cols-2 gap-3">
        <Stat icon={TrendingUp} label="Acumulado" valor={brl(acumulado)} />
        <Stat icon={ArrowDownLeft} label="Resgatado" valor={brl(resgatado)} />
      </section>

      <section className="mt-7">
        <h2 className="text-lg font-extrabold text-navy">Últimos 5 atendimentos</h2>
        <ul className="mt-3 space-y-2.5">
          {atendimentos.slice(0, 5).map((a) => (
            <AtendimentoItem key={a.id} a={a} onAvaliar={setAvaliando} />
          ))}
        </ul>
      </section>

      <AvaliarSheet atendimento={avaliando} onClose={() => setAvaliando(null)} />

      <Drawer open={!!abrir} onOpenChange={(o) => !o && fecharResgate()}>
        <DrawerContent className="mx-auto max-w-md rounded-t-[2rem]">
          <div className="px-6 pb-8 pt-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
                <PiggyBank className="h-6 w-6" />
              </div>
              <div>
                <DrawerTitle className="font-display text-xl font-extrabold text-navy">Solicitar resgate</DrawerTitle>
                <DrawerDescription>Disponível: {brl(saldo)}</DrawerDescription>
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-muted p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Quanto deseja resgatar?</p>
              <input
                inputMode="numeric"
                aria-label="Valor do resgate"
                value={brl(valor)}
                onChange={(e) => setCentavos(Number(e.target.value.replace(/\D/g, "").slice(0, 9)) || 0)}
                className="font-display mt-2 w-full bg-transparent text-center text-4xl font-extrabold text-navy outline-none"
              />
              {valor > saldo && <p className="mt-1 text-xs font-semibold text-destructive">Valor acima do saldo disponível</p>}
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2">
              {[10, 20, 50].map((v) => (
                <button key={v} onClick={() => setCentavos(Math.min(v, saldo) * 100)} className="rounded-xl border border-border py-2 text-sm font-bold text-navy">
                  {brl(v).replace(",00", "")}
                </button>
              ))}
              <button onClick={() => setCentavos(Math.round(saldo * 100))} className="rounded-xl bg-accent py-2 text-sm font-bold text-accent-foreground">
                Tudo
              </button>
            </div>

            <Button
              size="lg"
              disabled={valor <= 0 || valor > saldo}
              className="mt-6 h-14 w-full rounded-2xl text-base font-bold shadow-glow"
              onClick={() => {
                resgatar(valor);
                toast.success(`Resgate de ${brl(valor)} solicitado!`);
                fecharResgate();
                navigate({ to: "/resgates" });
              }}
            >
              Confirmar resgate
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </AppShell>
  );
}

function Stat({ icon: Icon, label, valor }: { icon: typeof TrendingUp; label: string; valor: string }) {
  return (
    <div className="rounded-3xl bg-card p-4 shadow-soft">
      <Icon className="h-5 w-5 text-sky" />
      <p className="mt-3 text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="font-display text-lg font-extrabold text-navy">{valor}</p>
    </div>
  );
}
