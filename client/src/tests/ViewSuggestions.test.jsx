import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ViewSuggestion from "../pages/ViewSuggestions";

// Mock AuthContext
vi.mock("../context/AuthContext", () => ({
  useAuthUser: vi.fn(),
}));

// Mock useLocation to inject suggestion via state
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: () => ({
      state: {
        id: 1,
        destination: "Boston",
        description: "A great place to visit",
        places: ["Museum", "Harbor"],
        image: "https://example.com/image.jpg",
        website: "example.com",
        category: "History",
        userId: 123,
      },
    }),
    useNavigate: () => vi.fn(),
  };
});

import { useAuthUser } from "../context/AuthContext";

describe("ViewSuggestion Component", () => {
  it("renders suggestion details and edit button for the suggestion owner", () => {
    useAuthUser.mockReturnValue({ user: { id: 123, username: "raghav" } });

    render(
      <MemoryRouter>
        <ViewSuggestion />
      </MemoryRouter>
    );

    expect(screen.getByText(/Viewing Boston/i)).toBeInTheDocument();
    expect(screen.getByText("Itinery Details")).toBeInTheDocument();
    expect(screen.getByText("Boston")).toBeInTheDocument();
    expect(screen.getByText("Museum")).toBeInTheDocument();
    expect(screen.getByText("Harbor")).toBeInTheDocument();
    expect(screen.getByText("A great place to visit")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /example.com/i })).toHaveAttribute("href", "https://example.com");
    expect(screen.getByText("History")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete Suggestion")).toBeInTheDocument();
  });

  it("does not show edit/delete buttons for other users", () => {
    useAuthUser.mockReturnValue({ user: { id: 999, username: "notowner" } });

    render(
      <MemoryRouter>
        <ViewSuggestion />
      </MemoryRouter>
    );

    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete Suggestion")).not.toBeInTheDocument();
  });
});
