import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock } from "lucide-react";
import { AppShell, PageHeader } from "@/components/clube/AppShell";
import { useClube, brl, dataCurta } from "@/lib/clube-store";

export const Route = createFileRoute("/resgates")({
  head: () => ({
    meta: [
      { title: "Resgates — Clube G7" },
      { name: "description", content: "Histórico dos seus resgates de cashback no Clube G7." },
      { property: "og:title", content: "Resgates — Clube G7" },
      { property: "og:description", content: "Histórico dos seus resgates de cashback." },
    ],
  }),
  component: Resgates,
});

function Resgates() {
  const { resgates, resgatado } = useClube();
  return (
    <AppShell header={<PageHeader title="Resgates" subtitle={`Você já resgatou ${brl(resgatado)}`} />}>
      <ul className="space-y-2.5">
        {resgates.map((r) => {
          const ok = r.status === "finalizado";
          return (
            <li key={r.id} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-soft animate-rise">
              <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${ok ? "bg-success/15 text-success" : "bg-primary/25 text-primary-foreground"}`}>
                {ok ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg font-extrabold text-navy">{brl(r.valor)}</p>
                <p className="text-xs text-muted-foreground">Solicitado em {dataCurta(r.data)}</p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${ok ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground"}`}>
                {ok ? "Finalizado" : "Em análise"}
              </span>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
