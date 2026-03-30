import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateTransfer } from "@/hooks/useTransactions";
import { useBalanceStore } from "@/store/useBalanceStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpRight, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const transferSchema = z.object({
  recipient: z.string().trim().min(2, "Nome do destinatário é obrigatório"),
  amount: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) > 0,
      "O valor deve ser maior que 0",
    ),
});

type TransferForm = z.infer<typeof transferSchema>;

export default function TransferPage() {
  const { mutateAsync, isPending } = useCreateTransfer();
  const balance = useBalanceStore((s) => s.balance);
  const { toast } = useToast();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransferForm>({
    resolver: zodResolver(transferSchema),
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const onSubmit = async (data: TransferForm) => {
    const amount = Number(data.amount);

    if (amount > balance) {
      toast({
        title: "Saldo insuficiente",
        description: `Seu saldo atual é ${formatCurrency(balance)}`,
        variant: "destructive",
      });
      return;
    }

    try {
      await mutateAsync({ recipient: data.recipient, amount });
      setSuccess(true);
      toast({
        title: "Transferência realizada! ✅",
        description: `${formatCurrency(amount)} enviado para ${data.recipient}`,
      });
      reset();
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      toast({
        title: "Erro na transferência",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-auto max-w-lg animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Nova Transferência
        </h1>
        <p className="text-muted-foreground">
          Saldo disponível:{" "}
          <span className="font-medium text-primary">
            {formatCurrency(balance)}
          </span>
        </p>
      </div>

      {success && (
        <Card className="mb-4 border-primary/30 bg-primary/10">
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <p className="font-medium text-primary">
              Transferência concluída com sucesso!
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <ArrowUpRight className="h-5 w-5 text-primary" />
            Dados da transferência
          </CardTitle>
          <CardDescription>
            Preencha os campos para realizar a transferência
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="recipient">Destinatário</Label>
              <Input
                id="recipient"
                placeholder="Nome do destinatário"
                {...register("recipient")}
                className="bg-muted/50"
              />
              {errors.recipient && (
                <p className="text-sm text-destructive">
                  {errors.recipient.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0,00"
                {...register("amount")}
                className="bg-muted/50"
              />
              {errors.amount && (
                <p className="text-sm text-destructive">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Confirmar Transferência"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
