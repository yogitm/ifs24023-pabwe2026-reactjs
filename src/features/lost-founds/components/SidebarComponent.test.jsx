import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import SidebarComponent from "./SidebarComponent";
import { renderWithProviders } from "../../../test-utils";

describe("SidebarComponent", () => {
  it("should render navigation items", () => {
    const onCloseMobile = vi.fn();
    renderWithProviders(
      <SidebarComponent isSidebarOpen={true} onCloseMobile={onCloseMobile} />
    );

    expect(screen.getByText("Lost & Found")).toBeInTheDocument();
    expect(screen.getByText("Semua Pengguna")).toBeInTheDocument();
    expect(screen.getByText("Profil Saya")).toBeInTheDocument();

    const backdrop = screen.getByTestId("sidebar-backdrop");
    fireEvent.click(backdrop);
    expect(onCloseMobile).toHaveBeenCalled();
  });

  it("should not render backdrop when isSidebarOpen is false", () => {
    renderWithProviders(
      <SidebarComponent isSidebarOpen={false} onCloseMobile={vi.fn()} />
    );

    expect(screen.queryByTestId("sidebar-backdrop")).not.toBeInTheDocument();
  });
});
