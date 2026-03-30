export interface Transaction {
  id: string;
  type: "credit" | "debit";
  description: string;
  amount: number;
  date: string;
  recipient?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "credit",
    description: "Salário",
    amount: 3500,
    date: "2026-03-28",
  },
  {
    id: "2",
    type: "debit",
    description: "Supermercado",
    amount: 287.5,
    date: "2026-03-27",
  },
  {
    id: "3",
    type: "credit",
    description: "Freelance",
    amount: 1200,
    date: "2026-03-25",
  },
  {
    id: "4",
    type: "debit",
    description: "Netflix",
    amount: 39.9,
    date: "2026-03-24",
  },
  {
    id: "5",
    type: "debit",
    description: "Uber",
    amount: 32.0,
    date: "2026-03-23",
  },
  {
    id: "6",
    type: "credit",
    description: "Pix recebido",
    amount: 150,
    date: "2026-03-22",
  },
  {
    id: "7",
    type: "debit",
    description: "Farmácia",
    amount: 85.4,
    date: "2026-03-20",
  },
];

export async function fetchTransactions(): Promise<Transaction[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return [...mockTransactions];
}

export async function createTransfer(data: {
  recipient: string;
  amount: number;
}): Promise<Transaction> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const newTransaction: Transaction = {
    id: crypto.randomUUID(),
    type: "debit",
    description: `Transferência para ${data.recipient}`,
    amount: data.amount,
    date: new Date().toISOString().split("T")[0],
    recipient: data.recipient,
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
