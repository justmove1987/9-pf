import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Admin from "../pages/Admin";

// 🧩 Mock del context i del fetch
vi.mock("../context/useAuth", () => ({
  useAuth: () => ({ user: { id: "1", name: "Admin", role: "admin" } }),
}));

vi.mock("../utils/fetchWithValidation", () => ({
  fetchWithValidation: vi.fn(() =>
    Promise.resolve([
      {
        _id: "1",
        name: "Usuari Prova",
        email: "test@domini.com",
        role: "editor",
        active: true,
      },
    ])
  ),
}));

describe("Admin Page", () => {
  it("mostra spinner mentre carrega", () => {
    render(<Admin />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("mostra usuaris després de carregar", async () => {
    render(<Admin />);
    await waitFor(() => {
      expect(screen.getByText("Usuari Prova")).toBeInTheDocument();
    });
  });

  it("filtra per nom", async () => {
    render(<Admin />);
    await waitFor(() => {
      expect(screen.getByText("Usuari Prova")).toBeInTheDocument();
    });
    fireEvent.change(screen.getByPlaceholderText(/cerca/i), {
      target: { value: "Prova" },
    });
    expect(screen.getByDisplayValue("Prova")).toBeInTheDocument();
  });
});
