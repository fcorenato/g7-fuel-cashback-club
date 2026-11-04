import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/clube/AppShell";
import { useClube } from "@/lib/clube-store";
import mascote from "@/assets/mascote.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Clube G7 — Entrar" },
      { name: "description", content: "Acesse o Clube G7 e acompanhe seu cashback nos postos do Grupo 7." },
      { property: "og:title", content: "Clube G7 — Cashback nos postos Grupo 7" },
      { property: "og:description", content: "Abasteça, ganhe cashback e resgate quando quiser." },
    ],
  }),
  component: Login,
});

function mascaraCpf(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function Login() {
  const { entrar } = useClube();
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [ver, setVer] = useState(false);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-hero text-navy-foreground">
      <div className="pattern-dots relative flex flex-1 flex-col items-center justify-end overflow-hidden px-6 pt-10">
        <Logo className="text-4xl" />
        <p className="mt-2 text-center text-sm text-navy-foreground/70">Clube de vantagens para clientes do Grupo 7</p>
        <div className="relative mt-6">
          <div className="absolute inset-x-6 bottom-0 top-10 rounded-full bg-sky/30 blur-2xl" />
          <img src={mascote} alt="Mascote do Clube G7" width={816} height={816} className="relative h-56 w-56 object-contain animate-rise" />
        </div>
      </div>

      <form
        className="rounded-t-[2rem] bg-card px-6 pb-10 pt-8 text-card-foreground"
        onSubmit={(e) => {
          e.preventDefault();
          entrar();
          navigate({ to: "/inicio" });
        }}
      >
        <h1 className="text-2xl font-extrabold text-navy">Oie! Bem-vindo 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">Entre com seu CPF para ver seu cashback.</p>

        <label className="mt-6 block text-xs font-bold uppercase tracking-wide text-muted-foreground">CPF</label>
        <Input
          inputMode="numeric"
          value={cpf}
          onChange={(e) => setCpf(mascaraCpf(e.target.value))}
          placeholder="000.000.000-00"
          className="mt-1.5 h-14 rounded-2xl bg-muted text-base"
        />
        <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Senha</label>
        <div className="relative mt-1.5">
          <Input
            type={ver ? "text" : "password"}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••"
            className="h-14 rounded-2xl bg-muted pr-12 text-base"
          />
          <button type="button" aria-label="Mostrar senha" onClick={() => setVer(!ver)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            {ver ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <button type="button" className="mt-3 text-sm font-semibold text-sky">Esqueci minha senha</button>

        <Button type="submit" size="lg" className="mt-6 h-14 w-full rounded-2xl text-base font-bold shadow-glow">
          Entrar
        </Button>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Ainda não é membro? <button type="button" className="font-bold text-navy underline underline-offset-4">Cadastre-se grátis</button>
        </p>
      </form>
    </div>
  );
}
