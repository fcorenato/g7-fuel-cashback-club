import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { AppShell, PageHeader } from "@/components/clube/AppShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useClube, type Usuario } from "@/lib/clube-store";

export const Route = createFileRoute("/conta")({
  head: () => ({
    meta: [
      { title: "Minha conta — Clube G7" },
      { name: "description", content: "Seus dados cadastrais no Clube G7." },
      { property: "og:title", content: "Minha conta — Clube G7" },
      { property: "og:description", content: "Seus dados cadastrais no Clube G7." },
    ],
  }),
  component: Conta,
});

const estados = "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");

function Conta() {
  const { usuario, atualizarUsuario, sair } = useClube();
  const navigate = useNavigate();
  const [f, setF] = useState<Usuario>(usuario);
  const set = (k: keyof Usuario) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const iniciais = usuario.nome.split(" ").map((p) => p[0]).slice(0, 2).join("");

  return (
    <AppShell header={<PageHeader title="Minha conta" />}>
      <section className="flex items-center gap-4 rounded-3xl bg-card p-4 shadow-soft">
        <div className="font-display grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-navy text-xl font-extrabold text-primary">{iniciais}</div>
        <div className="min-w-0">
          <p className="truncate font-bold text-navy">{usuario.nome}</p>
          <p className="text-xs text-muted-foreground">CPF {usuario.cpf}</p>
        </div>
      </section>

      <form
        className="mt-5 space-y-4 rounded-3xl bg-card p-5 shadow-soft"
        onSubmit={(e) => {
          e.preventDefault();
          atualizarUsuario(f);
          toast.success("Dados atualizados");
        }}
      >
        <Campo label="Nome completo"><Input value={f.nome} onChange={set("nome")} className="h-12 rounded-xl bg-muted" /></Campo>
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Nascimento"><Input type="date" value={f.nascimento} onChange={set("nascimento")} className="h-12 rounded-xl bg-muted" /></Campo>
          <Campo label="Estado">
            <select value={f.estado} onChange={set("estado")} className="h-12 w-full rounded-xl border border-input bg-muted px-3 text-sm">
              {estados.map((uf) => <option key={uf}>{uf}</option>)}
            </select>
          </Campo>
        </div>
        <Campo label="Celular"><Input inputMode="tel" value={f.telefone} onChange={set("telefone")} className="h-12 rounded-xl bg-muted" /></Campo>
        <Campo label="E-mail (opcional)"><Input type="email" value={f.email} onChange={set("email")} placeholder="voce@email.com" className="h-12 rounded-xl bg-muted" /></Campo>
        <Button type="submit" size="lg" className="h-12 w-full rounded-2xl font-bold">Salvar alterações</Button>
      </form>

      <button
        onClick={() => { sair(); navigate({ to: "/" }); }}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-destructive"
      >
        <LogOut className="h-4 w-4" /> Sair da conta
      </button>
      <p className="text-center text-xs text-muted-foreground">Clube G7 · Grupo 7 · Lub7</p>
    </AppShell>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
