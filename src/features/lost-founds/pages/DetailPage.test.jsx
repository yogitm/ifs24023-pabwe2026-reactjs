import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import DetailPage from "./DetailPage";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import * as actionModule from "../states/action";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "1" }),
  };
});

describe("DetailPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const dummyProfile = { id: 1, name: "Admin" };
  const dummyItem = {
    id: 1,
    user_id: 1,
    title: "Kunci Honda",
    description: "Hilang di perpus",
    status: "lost",
    is_completed: 0,
    cover: "http://example.com/cover.jpg",
    created_at: "2024-02-26T00:00:00Z",
    updated_at: "2024-02-27T00:00:00Z",
    author: { name: "Admin", photo: "http://example.com/photo.jpg" },
  };

  it("should render loading when profile or lostFound is null", () => {
    const { container } = renderWithProviders(<DetailPage />, {
      preloadedState: { profile: null, lostFound: null },
    });
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("should render details, owner action buttons, and navigate back", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: dummyProfile,
        lostFound: dummyItem,
      },
    });

    expect(screen.getByText("Kunci Honda")).toBeInTheDocument();
    expect(screen.getByText("Hilang di perpus")).toBeInTheDocument();
    expect(screen.getByText("Barang Hilang")).toBeInTheDocument();
    expect(screen.getByText("Dalam Proses")).toBeInTheDocument();

    expect(screen.getByTestId("edit-cover-btn")).toBeInTheDocument();
    expect(screen.getByTestId("edit-detail-btn")).toBeInTheDocument();
    expect(screen.getByTestId("delete-detail-btn")).toBeInTheDocument();

    const backLink = screen.getByTestId("back-to-home-link");
    expect(backLink).toHaveAttribute("href", "/");
  });

  it("should open cover modal and edit modal", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: dummyProfile,
        lostFound: dummyItem,
      },
    });

    fireEvent.click(screen.getByTestId("edit-cover-btn"));
    expect(screen.getByTestId("change-cover-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-cover-modal-btn"));
    expect(screen.queryByTestId("change-cover-modal")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("edit-detail-btn"));
    expect(screen.getByTestId("edit-lost-found-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-change-modal-btn"));
    expect(screen.queryByTestId("edit-lost-found-modal")).not.toBeInTheDocument();
  });

  it("should handle delete with confirm dialog", async () => {
    const deleteSpy = vi
      .spyOn(actionModule, "asyncSetIsLostFoundDelete")
      .mockReturnValue(() => {});
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({
      isConfirmed: true,
    });

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: dummyProfile,
        lostFound: dummyItem,
      },
    });

    fireEvent.click(screen.getByTestId("delete-detail-btn"));
    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith(1);
    });
  });

  it("should not delete if confirmation is cancelled", async () => {
    const deleteSpy = vi
      .spyOn(actionModule, "asyncSetIsLostFoundDelete")
      .mockReturnValue(() => {});
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({
      isConfirmed: false,
    });

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: dummyProfile,
        lostFound: dummyItem,
      },
    });

    fireEvent.click(screen.getByTestId("delete-detail-btn"));
    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it("should navigate to / if isLostFound is true but item is null", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: dummyProfile,
        isLostFound: true,
        lostFound: null,
      },
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should navigate to / if isLostFoundDeleted is true", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: dummyProfile,
        isLostFoundDeleted: true,
        lostFound: dummyItem,
      },
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should render placeholder when cover or author photo is missing", () => {
    const itemWithoutCover = {
      ...dummyItem,
      cover: null,
      author: { name: "Anon", photo: null },
      updated_at: null,
    };

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: dummyProfile,
        lostFound: itemWithoutCover,
      },
    });

    expect(screen.getByText("Belum ada foto bukti/cover")).toBeInTheDocument();
  });

  it("should render found status, completed badge, anonymous author, and hide owner controls when not owner", () => {
    const foundCompletedItem = {
      id: 2,
      user_id: 999,
      title: "Laptop Temuan",
      description: "Ditemukan di lab",
      status: "found",
      is_completed: 1,
      cover: "http://example.com/laptop.jpg",
      author: null,
      created_at: "2026-03-01T00:00:00Z",
    };

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: dummyProfile,
        isLostFound: true,
        lostFound: foundCompletedItem,
      },
    });

    expect(screen.getByText("Barang Temuan")).toBeInTheDocument();
    expect(screen.getByText("Selesai Dikembalikan")).toBeInTheDocument();
    expect(screen.getByText("Anonim")).toBeInTheDocument();
    expect(screen.queryByTestId("edit-detail-btn")).not.toBeInTheDocument();
    expect(screen.queryByTestId("delete-detail-btn")).not.toBeInTheDocument();
  });

  it("should consider user owner if author name matches profile name even if user_id differs", () => {
    const matchedAuthorItem = {
      ...dummyItem,
      user_id: 999,
      author: { name: "Admin" },
    };

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: dummyProfile,
        lostFound: matchedAuthorItem,
      },
    });

    expect(screen.getByTestId("edit-detail-btn")).toBeInTheDocument();
  });

  it("should not be owner if user_id differs and author name does not match", () => {
    const otherAuthorItem = {
      ...dummyItem,
      user_id: 999,
      author: { name: "Other User" },
    };

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: dummyProfile,
        lostFound: otherAuthorItem,
      },
    });

    expect(screen.queryByTestId("edit-detail-btn")).not.toBeInTheDocument();
  });
});
