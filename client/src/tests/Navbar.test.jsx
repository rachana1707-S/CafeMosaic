import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../components/Navbar";

//Mock the AuthContext
vi.mock("../context/AuthContext", () => ({
  useAuthUser: vi.fn(),
}));

import { useAuthUser } from "../context/AuthContext";

describe("Navbar Component", () => {
  it("renders navbar with public links when no user is logged in", () => {
    useAuthUser.mockReturnValue({ user: null });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByAltText("PlanVoyage")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Plan Your Trip")).toBeInTheDocument();
    expect(screen.getByText("Suggested Iteninaries")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("renders user links and dropdown when logged in", () => {
    const mockLogout = vi.fn();
    useAuthUser.mockReturnValue({
      user: { id: 1, username: "raghav" },
      logout: mockLogout,
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText("raghav")).toBeInTheDocument();
    expect(screen.getByText("View Saved Plans")).toBeInTheDocument();
    expect(screen.getAllByText("My Suggestions").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Logout").length).toBeGreaterThan(0);
  });
});
