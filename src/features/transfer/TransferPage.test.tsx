import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, beforeEach, expect } from "vitest";
import TransferPage from "./TransferPage";

let mockBalance = 1000;
const mockMutateAsync = vi.fn();
const mockToast = vi.fn();

vi.mock("@/hooks/useTransactions", () => ({
  useCreateTransfer: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

vi.mock("@/store/useBalanceStore", () => ({
  useBalanceStore: (selector: any) => selector({ balance: mockBalance }),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

const openSelect = async (index: number) => {
  const combos = screen.getAllByRole("combobox");
  await userEvent.click(combos[index]);
};

const selectOption = async (label: string) => {
  await userEvent.click(screen.getByRole("option", { name: label }));
};

describe("TransferPage", () => {
  beforeEach(() => {
    mockBalance = 1000;
    mockMutateAsync.mockReset();
    mockToast.mockReset();
  });

  it("exige categoria", async () => {
    render(<TransferPage />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/valor/i), "100");
    await user.type(screen.getByLabelText(/destinatário/i), "Ana");
    await user.click(
      screen.getByRole("button", { name: /confirmar transferência/i }),
    );

    expect(
      await screen.findByText(/categoria é obrigatória/i),
    ).toBeInTheDocument();
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it("exige destinatário para débito", async () => {
    render(<TransferPage />);
    const user = userEvent.setup();

    await openSelect(1); // Categoria
    await selectOption("PIX");

    await user.type(screen.getByLabelText(/valor/i), "100");
    await user.click(
      screen.getByRole("button", { name: /confirmar transferência/i }),
    );

    expect(
      await screen.findByText(/nome do destinatário é obrigatório/i),
    ).toBeInTheDocument();
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it("permite entrada (crédito) sem destinatário", async () => {
    render(<TransferPage />);
    const user = userEvent.setup();

    await openSelect(0);
    await selectOption("Entrada");

    await openSelect(1);
    await selectOption("TRABALHO");

    await user.type(screen.getByLabelText(/valor/i), "250");

    await user.click(
      screen.getByRole("button", { name: /confirmar transferência/i }),
    );

    await waitFor(() =>
      expect(mockMutateAsync).toHaveBeenCalledWith({
        recipient: undefined,
        amount: 250,
        type: "credit",
        category: "TRABALHO",
      }),
    );
  });

  it("bloqueia débito maior que o saldo", async () => {
    mockBalance = 50;

    render(<TransferPage />);
    const user = userEvent.setup();

    await openSelect(1);
    await selectOption("PIX");

    await user.type(screen.getByLabelText(/destinatário/i), "Maria");
    await user.type(screen.getByLabelText(/valor/i), "100");

    await user.click(
      screen.getByRole("button", { name: /confirmar transferência/i }),
    );

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Saldo insuficiente" }),
    );
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });
});
