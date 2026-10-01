import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import LostFoundLayout from "./LostFoundLayout";
import { renderWithProviders } from "../../../test-utils";
import apiHelper from "../../../helpers/apiHelper";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("LostFoundLayout", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should redirect to login if no token found", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue(null);
    renderWithProviders(<LostFoundLayout />);
    expect(mockNavigate).toHaveBeenCalledWith("/auth/login");
  });

  it("should show loading screen while profile is null", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("test-token");
    renderWithProviders(<LostFoundLayout />, {
      preloadedState: { profile: null },
    });
    expect(screen.getByText("Memuat sesi pengguna...")).toBeInTheDocument();
  });

  it("should render layout and handle sidebar toggle and logout when profile is loaded", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("test-token");
    const dummyProfile = { id: 1, name: "Admin", email: "admin@delcom.org" };

    renderWithProviders(<LostFoundLayout />, {
      preloadedState: { profile: dummyProfile },
    });

    expect(screen.getByText("Delcom Lost & Found")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();

    const toggleBtn = screen.getByTestId("toggle-sidebar-btn");
    fireEvent.click(toggleBtn);

    const backdrop = screen.getByTestId("sidebar-backdrop");
    fireEvent.click(backdrop);

    const dropdownBtn = screen.getByTestId("profile-dropdown-button");
    fireEvent.click(dropdownBtn);
    const logoutBtn = screen.getByTestId("logout-item-btn");
    fireEvent.click(logoutBtn);
  });

  it("should redirect to login when isProfile is true but profile is null", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("test-token");
    const putTokenSpy = vi.spyOn(apiHelper, "putAccessToken");

    renderWithProviders(<LostFoundLayout />, {
      preloadedState: { isProfile: true, profile: null },
    });

    expect(putTokenSpy).toHaveBeenCalledWith("");
    expect(mockNavigate).toHaveBeenCalledWith("/auth/login");
  });

  it("should redirect to login when isAuthLogout is true", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("test-token");
    renderWithProviders(<LostFoundLayout />, {
      preloadedState: { isAuthLogout: true, profile: { name: "User" } },
    });
    expect(mockNavigate).toHaveBeenCalledWith("/auth/login");
  });

  it("should do nothing when isProfile is true and profile exists", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("test-token");
    renderWithProviders(<LostFoundLayout />, {
      preloadedState: { isProfile: true, profile: { id: 1, name: "User" } },
    });
    expect(screen.getByText("User")).toBeInTheDocument();
  });
});
