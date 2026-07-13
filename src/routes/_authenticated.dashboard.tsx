import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, LogOut, Shield, Users, Activity, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import type { AppRole, Profile } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard · Chacal Wallet Manager" }],
  }),
  component: Dashboard,
});

const roleLabel: Record<AppRole, string> = {
  master: "Master",
  admin: "Administrador",
  operator: "Operador",
  auditor: "Auditor",
};

const roleTone: Record<AppRole, string> = {
  master: "bg-gradient-brand text-primary-foreground border-transparent",
  admin: "bg-primary/15 text-primary border-primary/30",
  operator: "bg-accent/15 text-accent border-accent/30",
  auditor: "bg-warning/15 text-warning border-warning/30",
};

function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<Profile | null> => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", sess.session.user.id)
        .maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
  });

  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: async (): Promise<AppRole[]> => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) return [];
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", sess.session.user.id);
      if (error) throw error;
      return (data ?? []).map((r) => r.role as AppRole);
    },
  });

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Sessão encerrada");
    navigate({ to: "/auth", replace: true });
  }

  const isMaster = roles.includes("master");
  const isAdmin = isMaster || roles.includes("admin");

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/60 bg-card/40 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-gradient-brand shadow-glow">
              <Wallet className="size-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-none">
                Chacal <span className="text-gradient-brand">Wallet</span>
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">Console operacional</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-none">{profile?.name ?? "—"}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                @{profile?.login ?? "…"}
              </p>
            </div>
            <div className="flex gap-1">
              {roles.map((r) => (
                <Badge key={r} variant="outline" className={roleTone[r]}>
                  {roleLabel[r]}
                </Badge>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="size-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Olá, {profile?.name?.split(" ")[0] ?? "operador"}.
          </h2>
          <p className="mt-2 text-muted-foreground">
            Autenticação e controle de acesso ativos. Carteiras, consolidação e trade em massa serão liberados nas próximas fases.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Wallet className="size-5" />}
            label="Carteiras"
            value="0"
            hint="Ainda não configurado"
          />
          <StatCard
            icon={<TrendingUp className="size-5" />}
            label="Volume 24h"
            value="—"
            hint="Aguardando integração Solana"
          />
          <StatCard
            icon={<Users className="size-5" />}
            label="Sua função"
            value={roles.map((r) => roleLabel[r]).join(", ") || "—"}
            hint={isMaster ? "Acesso total" : isAdmin ? "Gestão" : "Operação"}
          />
          <StatCard
            icon={<Activity className="size-5" />}
            label="Status"
            value={profile?.status === "active" ? "Ativo" : profile?.status ?? "—"}
            hint="Conta em bom estado"
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="size-4 text-primary" />
                Modelo de acesso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <RoleRow role="master" desc="Acesso total. Cria e revoga qualquer função." />
              <RoleRow role="admin" desc="Gerencia operadores, aprova operações críticas." />
              <RoleRow role="operator" desc="Executa transferências, consolidações e trades." />
              <RoleRow role="auditor" desc="Visualização somente leitura de logs e operações." />
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Próximas fases</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm">
                <NextStep n={1} title="Carteiras & dashboard" desc="CRUD de carteiras, chaves criptografadas (AES-256-GCM), favoritos e grupos." />
                <NextStep n={2} title="Solana on-chain" desc="Saldos SOL/SPL, transferências, importação e criação via server functions." />
                <NextStep n={3} title="Operações em massa" desc="Consolidar tudo na Principal e trade (Jupiter) em todas as carteiras." />
                <NextStep n={4} title="Auditoria" desc="Log completo de ações, filtros por usuário e exportação." />
              </ol>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="shadow-card">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="text-primary">{icon}</span>
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function RoleRow({ role, desc }: { role: AppRole; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <Badge variant="outline" className={roleTone[role]}>
        {roleLabel[role]}
      </Badge>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}

function NextStep({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <li className="flex gap-3">
      <span className="grid size-6 shrink-0 place-items-center rounded-md bg-primary/15 font-mono text-xs text-primary">
        {n}
      </span>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-muted-foreground">{desc}</p>
      </div>
    </li>
  );
}
