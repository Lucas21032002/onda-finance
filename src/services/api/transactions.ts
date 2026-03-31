export interface Transaction {
  id: string;
  type: "credit" | "debit";
  description: string;
  amount: number;
  date: string;
  recipient?: string;
  category?: string;
}

const mockTransactions: Transaction[] = [];

export async function fetchTransactions(): Promise<Transaction[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return [...mockTransactions];
}

export async function createTransfer(data: {
  recipient?: string;
  amount: number;
  type: "credit" | "debit";
  category: string;
}): Promise<Transaction> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const isDebit = data.type === "debit";

  const newTransaction: Transaction = {
    id: crypto.randomUUID(),
    type: data.type,
    description: isDebit
      ? `Transferência para ${data.recipient}`
      : `Entrada: ${data.category}`,
    amount: data.amount,
    date: new Date().toISOString().split("T")[0],
    recipient: isDebit ? data.recipient : undefined,
    category: data.category,
  };

  mockTransactions.unshift(newTransaction);

  return newTransaction;
}

export async function mockLogin(
  identifier: string,
): Promise<{ id: string; name: string; email: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const isEmail = identifier.includes("@");
  return {
    id: crypto.randomUUID(),
    name: isEmail ? identifier.split("@")[0] : identifier,
    email: isEmail
      ? identifier
      : `${identifier.toLowerCase().replace(/\s+/g, ".")}@onda.com`,
  };
}
