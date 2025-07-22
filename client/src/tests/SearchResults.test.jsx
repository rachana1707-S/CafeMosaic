import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import axios from "axios";
import SearchResults from "../pages/SearchResults";

vi.mock("axios");
vi.mock("../context/AuthContext", () => ({
  useAuthUser: () => ({ user: { id: 1 } }),
}));

describe("SearchResults Component", () => {
  it("renders Search Results and shows empty state when no places found", async () => {
    axios.get
      .mockResolvedValueOnce({ data: [] }) // /api/places
      .mockResolvedValueOnce({ data: [] }); // /api/plans/user/:id

    render(
      <MemoryRouter initialEntries={["/search-results?city=Boston&distance=10&category=tourism.attraction"]}>
        <Routes>
          <Route path="/search-results" element={<SearchResults />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Search Results for/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText(/No places found/i)).toBeInTheDocument()
    );
  });

  it("renders Search Results with place cards when data is returned", async () => {
    const mockPlace = {
      properties: {
        place_id: "123",
        name: "Mock Cafe",
        formatted: "123 Main St",
        categories: ["catering.restaurant"],
        city: "Boston",
        state: "MA",
        country: "USA",
        opening_hours: "9 AM - 5 PM",
        phone: "123-456-7890",
      },
      geometry: {
        coordinates: [-71.0589, 42.3601],
      },
    };

    axios.get
      .mockResolvedValueOnce({ data: [mockPlace] }) // /api/places
      .mockResolvedValueOnce({ data: [] }); // /api/plans/user/:id

    render(
      <MemoryRouter initialEntries={["/search-results?city=Boston&distance=10&category=tourism.attraction"]}>
        <Routes>
          <Route path="/search-results" element={<SearchResults />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText("Mock Cafe")).toBeInTheDocument()
    );

    expect(screen.getAllByText(/Boston/i).length).toBeGreaterThan(0);

    // Check country is rendered
    expect(screen.getByText(/USA/i)).toBeInTheDocument();
  });
});
