import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OrderForm from "../components/OrderForm";
import { SymbolProvider } from "../context/SymbolContext";

// Mock the Orders service to return a backend error
jest.mock("../services/Orders", () => ({
  placeOrder: jest.fn(({ qty, price }) =>
    Promise.resolve({
      json: () =>
        Promise.resolve(
          qty <= 0
            ? { error: "Quantity must be > 0" }
            : price <= 0
            ? { error: "Price must be > 0" }
            : {}
        ),
    })
  ),
}));

const renderWithProviders = (ui) =>
  render(<SymbolProvider>{ui}</SymbolProvider>);

describe("OrderForm backend validation", () => {
  test("shows backend error notification for invalid quantity", async () => {
    renderWithProviders(<OrderForm />);
    fireEvent.change(screen.getByLabelText(/Quantity/i), {
      target: { value: 0 },
    });
    fireEvent.change(screen.getByLabelText(/Price/i), {
      target: { value: "100" },
    });
    fireEvent.click(screen.getByRole("button", { name: /buy/i }));

    // Wait for the notification to appear
    expect(
      await screen.findByText(/Quantity must be > 0/i)
    ).toBeInTheDocument();
  });

  test("shows backend error notification for invalid price", async () => {
    renderWithProviders(<OrderForm />);
    fireEvent.change(screen.getByLabelText(/Quantity/i), {
      target: { value: 10 },
    });
    fireEvent.change(screen.getByLabelText(/Price/i), {
      target: { value: "0" },
    });
    fireEvent.click(screen.getByRole("button", { name: /buy/i }));

    // Wait for the notification to appear
    expect(await screen.findByText(/Price must be > 0/i)).toBeInTheDocument();
  });
});
