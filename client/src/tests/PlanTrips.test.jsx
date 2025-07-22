import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import PlanTrips from "../pages/PlanTrips";

//Mock useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("PlanTrips Component", () => {
  let alertMock;
  let localStorageMock;

  beforeEach(() => {
    alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    localStorageMock = {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders form inputs and submits with valid values", () => {
    const { container } = render(
      <MemoryRouter>
        <PlanTrips />
      </MemoryRouter>
    );

    // Use getAllBy... and pick the first input for city
    const destinationInput = screen.getAllByPlaceholderText(/Where are you going/i)[0];
    const distanceInput = screen.getAllByPlaceholderText(/Distance/i)[0];
    const selectInput = container.querySelector("select");
    const submitBtn = screen.getAllByText(/Search/i)[0];

    fireEvent.change(destinationInput, { target: { value: "Boston" } });
    fireEvent.change(distanceInput, { target: { value: "10" } });
    fireEvent.change(selectInput, { target: { value: "tourism.attraction" } });
    fireEvent.click(submitBtn);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "tripSearch",
      JSON.stringify({
        destination: "Boston",
        distance: "10",
        category: "tourism.attraction",
      })
    );
  });

  it("shows alert when required fields are missing", () => {
    render(
      <MemoryRouter>
        <PlanTrips />
      </MemoryRouter>
    );

    const submitBtn = screen.getAllByText(/Search/i)[0];
    fireEvent.click(submitBtn);

    expect(alertMock).toHaveBeenCalledWith("Please fill all required fields!");
  });
});
