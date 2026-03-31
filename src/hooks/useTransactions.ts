import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTransactions,
  createTransfer,
  type Transaction,
} from "@/services/api/transactions";
import { useBalanceStore } from "@/store/useBalanceStore";

export function useTransactions() {
  return useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });
}

export function useCreateTransfer() {
  const queryClient = useQueryClient();
  const deduct = useBalanceStore((s) => s.deduct);
  const add = useBalanceStore((s) => s.add);

  return useMutation({
    mutationFn: createTransfer,
    onSuccess: (_newTx, variables) => {
      if (variables.type === "debit") deduct(variables.amount);
      else add(variables.amount);

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
