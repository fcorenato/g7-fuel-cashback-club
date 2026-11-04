import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useClube, brl, dataCurta, type Atendimento } from "@/lib/clube-store";

const rotulos = ["", "Muito ruim", "Ruim", "Regular", "Bom", "Excelente!"];
const chips = ["Atendimento rápido", "Simpatia", "Limpeza", "Calibragem", "Preço"];

export function AvaliarSheet({ atendimento, onClose }: { atendimento: Atendimento | null; onClose: () => void }) {
  const { avaliar } = useClube();
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const fechar = () => {
    setNota(0);
    setComentario("");
    setTags([]);
    onClose();
  };

  return (
    <Drawer open={!!atendimento} onOpenChange={(o) => !o && fechar()}>
      <DrawerContent className="mx-auto max-w-md rounded-t-[2rem]">
        {atendimento && (
          <div className="px-6 pb-8 pt-4">
            <DrawerTitle className="font-display text-2xl font-extrabold text-navy">Como foi seu atendimento?</DrawerTitle>
            <DrawerDescription className="mt-1 text-sm">
              {atendimento.posto} · {dataCurta(atendimento.data)} · {brl(atendimento.valor)}
            </DrawerDescription>

            <div className="mt-6 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} aria-label={`${n} estrelas`} onClick={() => setNota(n)} className="p-1 transition-transform active:scale-90">
                  <Star className={`h-10 w-10 ${n <= nota ? "fill-primary text-primary" : "text-border"}`} strokeWidth={1.5} />
                </button>
              ))}
            </div>
            <p className="mt-2 h-5 text-center text-sm font-semibold text-navy">{rotulos[nota]}</p>

            {nota > 0 && (
              <div className="animate-rise">
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {chips.map((c) => {
                    const on = tags.includes(c);
                    return (
                      <button
                        key={c}
                        onClick={() => setTags((t) => (on ? t.filter((x) => x !== c) : [...t, c]))}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${on ? "border-navy bg-navy text-navy-foreground" : "border-border bg-card text-foreground"}`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
                <Textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Quer contar mais? (opcional)"
                  className="mt-4 min-h-24 rounded-2xl bg-muted"
                />
              </div>
            )}

            <Button
              disabled={!nota}
              size="lg"
              className="mt-6 h-14 w-full rounded-2xl text-base font-bold shadow-glow"
              onClick={() => {
                avaliar(atendimento.id, nota, [tags.join(", "), comentario].filter(Boolean).join(" — "));
                toast.success("Obrigado pela avaliação! 💛");
                fechar();
              }}
            >
              Enviar avaliação
            </Button>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
