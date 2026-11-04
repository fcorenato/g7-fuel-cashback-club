import { createContext, useContext, useState, type ReactNode } from "react";

export type Atendimento = {
  id: string;
  posto: string;
  data: string; // ISO
  valor: number;
  cashback: number;
  tipo: "combustivel" | "loja" | "lubrificacao";
  avaliacao?: { nota: number; comentario: string };
};

export type Resgate = {
  id: string;
  data: string;
  valor: number;
  status: "pendente" | "finalizado";
};

export type Usuario = {
  cpf: string;
  nome: string;
  nascimento: string;
  telefone: string;
  estado: string;
  email: string;
};

// Demo data — replace with the real Clube G7 API.
const atendimentosIniciais: Atendimento[] = [
  { id: "a1", posto: "Estação G7", data: "2026-08-19T10:06:16", valor: 7, cashback: 0.35, tipo: "loja" },
  { id: "a2", posto: "BR Mania (Posto 7)", data: "2026-06-12T12:02:10", valor: 77.7, cashback: 3.9, tipo: "combustivel" },
  { id: "a3", posto: "Posto Carioca", data: "2026-05-28T18:41:00", valor: 250, cashback: 12.5, tipo: "combustivel", avaliacao: { nota: 5, comentario: "Ótimo atendimento!" } },
  { id: "a4", posto: "Lub7 Aldeota", data: "2026-05-10T09:15:00", valor: 189.9, cashback: 9.49, tipo: "lubrificacao" },
  { id: "a5", posto: "Estação G7", data: "2026-04-22T20:30:00", valor: 553, cashback: 27.65, tipo: "combustivel", avaliacao: { nota: 4, comentario: "" } },
];

type Store = {
  usuario: Usuario;
  atendimentos: Atendimento[];
  resgates: Resgate[];
  acumulado: number;
  resgatado: number;
  saldo: number;
  logado: boolean;
  entrar: () => void;
  sair: () => void;
  avaliar: (id: string, nota: number, comentario: string) => void;
  resgatar: (valor: number) => void;
  atualizarUsuario: (u: Usuario) => void;
};

const Ctx = createContext<Store | null>(null);

export function ClubeProvider({ children }: { children: ReactNode }) {
  const [logado, setLogado] = useState(false);
  const [atendimentos, setAtendimentos] = useState(atendimentosIniciais);
  const [resgates, setResgates] = useState<Resgate[]>([
    { id: "r1", data: "2026-05-12", valor: 1, status: "finalizado" },
  ]);
  const [usuario, setUsuario] = useState<Usuario>({
    cpf: "847.281.083-68",
    nome: "Renato Gomes",
    nascimento: "1981-07-01",
    telefone: "(85) 99189-0803",
    estado: "CE",
    email: "",
  });

  const acumulado = round(atendimentos.reduce((s, a) => s + a.cashback, 0));
  const resgatado = round(resgates.reduce((s, r) => s + r.valor, 0));
  const saldo = round(acumulado - resgatado);

  return (
    <Ctx.Provider
      value={{
        usuario,
        atendimentos,
        resgates,
        acumulado,
        resgatado,
        saldo,
        logado,
        entrar: () => setLogado(true),
        sair: () => setLogado(false),
        avaliar: (id, nota, comentario) =>
          setAtendimentos((l) => l.map((a) => (a.id === id ? { ...a, avaliacao: { nota, comentario } } : a))),
        resgatar: (valor) =>
          setResgates((l) => [
            { id: crypto.randomUUID(), data: new Date().toISOString().slice(0, 10), valor: round(valor), status: "pendente" },
            ...l,
          ]),
        atualizarUsuario: setUsuario,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useClube() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useClube fora do ClubeProvider");
  return c;
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

export const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const dataCurta = (iso: string) =>
  new Date(iso.length === 10 ? iso + "T12:00:00" : iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
export const hora = (iso: string) =>
  new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
