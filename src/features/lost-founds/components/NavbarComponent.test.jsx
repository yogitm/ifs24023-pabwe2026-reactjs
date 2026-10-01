import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import NavbarComponent from "./NavbarComponent";
import { renderWithProviders } from "../../../test-utils";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("NavbarComponent", () => {
  const dummyProfile = {
    name: "John Doe",
    email: "john@example.com",
    photo: "http://example.com/photo.jpg",
  };

  it("should render profile info with photo and toggle dropdown", () => {
    const handleLogout = vi.fn();
    const onToggleSidebar = vi.fn();

    renderWithProviders(
      <NavbarComponent
        profile={dummyProfile}
        handleLogout={handleLogout}
        onToggleSidebar={onToggleSidebar}
        isSidebarOpen={false}
      />
    );

    expect(screen.getByText("Delcom Lost & Found")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    const dropdownBtn = screen.getByTestId("profile-dropdown-button");
    fireEvent.click(dropdownBtn);
    expect(screen.getByTestId("profile-dropdown-menu")).toBeInTheDocument();

    const profileItemBtn = screen.getByTestId("profile-item-btn");
    fireEvent.click(profileItemBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/profile");

    fireEvent.click(dropdownBtn);
    const logoutBtn = screen.getByTestId("logout-item-btn");
    fireEvent.click(logoutBtn);
    expect(handleLogout).toHaveBeenCalled();
  });

  it("should render fallback initial when photo is missing and close on outside click", () => {
    renderWithProviders(
      <NavbarComponent
        profile={{ name: "Jane Doe" }}
        handleLogout={vi.fn()}
        onToggleSidebar={vi.fn()}
        isSidebarOpen={true}
      />
    );

    expect(screen.getByText("J")).toBeInTheDocument();

    const dropdownBtn = screen.getByTestId("profile-dropdown-button");
    fireEvent.click(dropdownBtn);
    expect(screen.getByTestId("profile-dropdown-menu")).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(document.body);
    expect(screen.queryByTestId("profile-dropdown-menu")).not.toBeInTheDocument();
  });

  it("should trigger onToggleSidebar", () => {
    const onToggleSidebar = vi.fn();
    renderWithProviders(
      <NavbarComponent
        profile={dummyProfile}
        handleLogout={vi.fn()}
        onToggleSidebar={onToggleSidebar}
        isSidebarOpen={false}
      />
    );

    const toggleBtn = screen.getByTestId("toggle-sidebar-btn");
    fireEvent.click(toggleBtn);
    expect(onToggleSidebar).toHaveBeenCalled();
  });

  it("should handle profile without name or null safely", () => {
    renderWithProviders(
      <NavbarComponent
        profile={{}}
        handleLogout={vi.fn()}
        onToggleSidebar={vi.fn()}
      />
    );
    expect(screen.getByText("U")).toBeInTheDocument();
    expect(screen.getByText("Pengguna")).toBeInTheDocument();
  });

  it("should not close dropdown when clicking inside dropdown element", () => {
    renderWithProviders(
      <NavbarComponent
        profile={dummyProfile}
        handleLogout={vi.fn()}
        onToggleSidebar={vi.fn()}
      />
    );
    const dropdownBtn = screen.getByTestId("profile-dropdown-button");
    fireEvent.click(dropdownBtn);
    fireEvent.mouseDown(screen.getByTestId("profile-dropdown-menu"));
    expect(screen.getByTestId("profile-dropdown-menu")).toBeInTheDocument();
  });
});
