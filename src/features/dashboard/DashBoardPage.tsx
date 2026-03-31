import { useBalanceStore } from "@/store/useBalanceStore";
import { useTransactions } from "@/hooks/useTransactions";
import { Card, CardContent } from "@/components/ui/card";
import { TransactionSkeleton } from "@/components/TransactionSkeleton";
import {
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";

export default function DashboardPage() {
  const balance = useBalanceStore((s) => s.balance);
  const { data: transactions, isLoading } = useTransactions();

  const [typeFilter, setTypeFilter] = useState<"all" | "credit" | "debit">(
    "all",
  );
  const [search, setSearch] = useState("");
  const [periodFilter, setPeriodFilter] = useState<
    "7d" | "30d" | "90d" | "all"
  >("30d");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | "TRABALHO" | "COMPRAS" | "LIFESTYLE" | "PIX" | "TRANSFER" | "OUTROS"
  >("all");

  const totalIncome =
    transactions
      ?.filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0) ?? 0;

  const totalExpense =
    transactions
      ?.filter((t) => t.type === "debit")
      .reduce((sum, t) => sum + t.amount, 0) ?? 0;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const periodCutoff = useMemo(() => {
    if (periodFilter === "all") return null;
    const days = periodFilter === "7d" ? 7 : periodFilter === "30d" ? 30 : 90;
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
  }, [periodFilter]);

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];

    return transactions.filter((t) => {
      if (typeFilter !== "all" && t.type !== typeFilter) return false;

      const category =
        (t.category?.toUpperCase() as
          | "TRABALHO"
          | "COMPRAS"
          | "LIFESTYLE"
          | "PIX"
          | "TRANSFER"
          | "OUTROS"
          | undefined) ?? getCategoryLabel(t.description);

      if (categoryFilter !== "all" && category !== categoryFilter) return false;

      if (periodCutoff) {
        const txDate = new Date(t.date);
        if (txDate < periodCutoff) return false;
      }

      if (search.trim()) {
        const term = search.trim().toLowerCase();
        const haystack = [t.description, t.recipient ?? "", t.category ?? ""]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(term)) return false;
      }

      return true;
    });
  }, [transactions, typeFilter, categoryFilter, periodCutoff, search]);

  const getCategoryLabel = (desc: string) => {
    if (
      desc.toLowerCase().includes("salário") ||
      desc.toLowerCase().includes("freelance")
    )
      return "TRABALHO";
    if (
      desc.toLowerCase().includes("supermercado") ||
      desc.toLowerCase().includes("farmácia")
    )
      return "COMPRAS";
    if (
      desc.toLowerCase().includes("netflix") ||
      desc.toLowerCase().includes("uber")
    )
      return "LIFESTYLE";
    if (desc.toLowerCase().includes("pix")) return "PIX";
    if (desc.toLowerCase().includes("transferência")) return "TRANSFER";
    return "OUTROS";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Histórico de Transações
          </h1>
          <p className="mt-1 text-muted-foreground">
            Revise e gerencie suas movimentações financeiras.
          </p>
        </div>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Entradas do Mês
                </p>
                <p className="mt-1 font-display text-2xl font-bold text-primary">
                  {formatCurrency(totalIncome)}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Saídas do Mês
                </p>
                <p className="mt-1 font-display text-2xl font-bold text-destructive">
                  {formatCurrency(totalExpense)}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/30 bg-primary/10">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                  Saldo Atual
                </p>
                <p className="mt-1 font-display text-2xl font-bold text-foreground">
                  {balance >= 0 ? "+" : ""} {formatCurrency(balance)}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 p-4">
          <div className="flex-1 min-w-[180px]">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Destinatário / Nome
            </p>
            <Input
              placeholder="Buscar..."
              className="h-9 bg-muted/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="min-w-[160px]">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Período
            </p>
            <Select
              value={periodFilter}
              onValueChange={(v) =>
                setPeriodFilter(v as "7d" | "30d" | "90d" | "all")
              }
            >
              <SelectTrigger className="h-9 bg-muted/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                <SelectItem value="all">Todos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[160px]">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Categoria
            </p>
            <Select
              value={categoryFilter}
              onValueChange={(v) =>
                setCategoryFilter(
                  v as
                    | "all"
                    | "TRABALHO"
                    | "COMPRAS"
                    | "LIFESTYLE"
                    | "PIX"
                    | "TRANSFER"
                    | "OUTROS",
                )
              }
            >
              <SelectTrigger className="h-9 bg-muted/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Categorias</SelectItem>
                <SelectItem value="TRABALHO">Trabalho</SelectItem>
                <SelectItem value="COMPRAS">Compras</SelectItem>
                <SelectItem value="LIFESTYLE">Lifestyle</SelectItem>
                <SelectItem value="PIX">PIX</SelectItem>
                <SelectItem value="TRANSFER">Transfer</SelectItem>
                <SelectItem value="OUTROS">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Tipo
            </p>
            <div className="flex gap-1">
              {(["all", "credit", "debit"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    typeFilter === type
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {type === "all"
                    ? "Todos"
                    : type === "credit"
                      ? "Entradas"
                      : "Saídas"}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        {isLoading ? (
          <div className="p-4">
            <TransactionSkeleton />
          </div>
        ) : !filteredTransactions?.length ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              Nenhuma transação encontrada.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[1.2fr_1.5fr_1fr_1fr_1fr] gap-4 border-b border-border px-6 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Data
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Entidade
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Categoria
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-right">
                Valor
              </p>
            </div>

            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="grid grid-cols-[1.2fr_1.5fr_1fr_1fr_1fr] gap-4 items-center border-b border-border/50 px-6 py-4 transition-colors hover:bg-muted/30"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(tx.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(tx.date).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    {tx.type === "credit" ? (
                      <ArrowDownLeft className="h-4 w-4 text-primary" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {tx.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tx.recipient ?? "Pagamento"}
                    </p>
                  </div>
                </div>

                <div>
                  <Badge
                    variant="outline"
                    className="rounded-md border-border text-[10px] font-semibold uppercase"
                  >
                    {tx.category ?? getCategoryLabel(tx.description)}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Concluído
                  </span>
                </div>

                <div className="text-right">
                  <p
                    className={`text-sm font-bold font-display ${tx.type === "credit" ? "text-primary" : "text-destructive"}`}
                  >
                    {tx.type === "credit" ? "+" : "-"}{" "}
                    {formatCurrency(tx.amount)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">BRL</p>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between px-6 py-3">
              <p className="text-xs text-muted-foreground">
                Mostrando 1 - {filteredTransactions.length} de{" "}
                <span className="font-bold text-foreground">
                  {filteredTransactions.length}
                </span>{" "}
                transações
              </p>
              <div className="flex gap-1">
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
