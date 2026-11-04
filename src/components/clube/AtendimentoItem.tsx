import { Fuel, ShoppingBag, Wrench, Star } from "lucide-react";
import { brl, dataCurta, hora, type Atendimento } from "@/lib/clube-store";

const icones = { combustivel: Fuel, loja: ShoppingBag, lubrificacao: Wrench };

export function AtendimentoItem({ a, onAvaliar }: { a: Atendimento; onAvaliar: (a: Atendimento) => void }) {
  const Icon = icones[a.tipo];
  return (
    <li className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-navy">{a.posto}</p>
        <p className="text-xs text-muted-foreground">
          {dataCurta(a.data)} · {hora(a.data)} · {brl(a.valor)}
        </p>
        {a.avaliacao ? (
          <span className="mt-1 inline-flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} className={`h-3 w-3 ${n <= a.avaliacao!.nota ? "fill-primary text-primary" : "text-border"}`} />
            ))}
          </span>
        ) : (
          <button onClick={() => onAvaliar(a)} className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-sky">
            <Star className="h-3 w-3" /> Avaliar
          </button>
        )}
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-extrabold text-success">+{brl(a.cashback)}</p>
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">cashback</p>
      </div>
    </li>
  );
}
