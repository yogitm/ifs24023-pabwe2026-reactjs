import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import HomePage from "./HomePage";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import * as actionModule from "../states/action";

describe("HomePage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const dummyProfile = { id: 1, name: "Admin" };
  const dummyItems = [
    {
      id: 1,
      user_id: 1,
      title: "Kunci Motor Honda",
      description: "Hilang di perpustakaan",
      status: "lost",
      is_completed: 0,
      cover: "http://example.com/cover1.jpg",
      created_at: "2024-02-26T00:00:00Z",
      author: { name: "Admin" },
    },
    {
      id: 2,
      user_id: 2,
      title: "Dompet Coklat",
      description: "Ditemukan dekat kantin",
      status: "found",
      is_completed: 1,
      cover: null,
      created_at: "2024-02-27T00:00:00Z",
      author: { name: "Budi" },
    },
  ];

  it("should return null if profile is not loaded", () => {
    const { container } = renderWithProviders(<HomePage />, {
      preloadedState: { profile: null },
    });
    expect(container.firstChild).toBeNull();
  });

  it("should render list of items and metric summary cards", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: dummyProfile,
        lostFounds: dummyItems,
      },
    });

    expect(screen.getByText("Lost & Found Delcom")).toBeInTheDocument();
    expect(screen.getByText("Kunci Motor Honda")).toBeInTheDocument();
    expect(screen.getByText("Dompet Coklat")).toBeInTheDocument();

    // Check empty cover message on item 2
    expect(screen.getByText("Tidak ada foto cover")).toBeInTheDocument();

    // Check owner action buttons on item 1 (owned by user_id: 1)
    expect(screen.getByTestId("edit-item-btn-1")).toBeInTheDocument();
    expect(screen.getByTestId("delete-item-btn-1")).toBeInTheDocument();

    // Item 2 should not show owner buttons
    expect(screen.queryByTestId("edit-item-btn-2")).not.toBeInTheDocument();
  });

  it("should handle filter switches", () => {
    const setLostFoundsSpy = vi
      .spyOn(actionModule, "asyncSetLostFounds")
      .mockReturnValue(() => {});

    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: dummyProfile,
        lostFounds: dummyItems,
      },
    });

    fireEvent.click(screen.getByTestId("filter-lost-btn"));
    expect(setLostFoundsSpy).toHaveBeenCalledWith({ status: "lost" });

    fireEvent.click(screen.getByTestId("filter-found-btn"));
    expect(setLostFoundsSpy).toHaveBeenCalledWith({ status: "found" });

    fireEvent.click(screen.getByTestId("filter-completed-btn"));
    expect(setLostFoundsSpy).toHaveBeenCalledWith({ is_completed: 1 });

    fireEvent.click(screen.getByTestId("filter-process-btn"));
    expect(setLostFoundsSpy).toHaveBeenCalledWith({ is_completed: 0 });

    fireEvent.click(screen.getByTestId("filter-mine-btn"));
    expect(setLostFoundsSpy).toHaveBeenCalledWith({ is_me: 1 });
  });

  it("should filter items with search input", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: dummyProfile,
        lostFounds: dummyItems,
      },
    });

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "Kunci" } });

    expect(screen.getByText("Kunci Motor Honda")).toBeInTheDocument();
    expect(screen.queryByText("Dompet Coklat")).not.toBeInTheDocument();

    // No results match
    fireEvent.change(searchInput, { target: { value: "Tidak Ada Apa-apa" } });
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("should open and close Add Modal", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: dummyProfile,
        lostFounds: dummyItems,
      },
    });

    const openBtn = screen.getByTestId("open-add-modal-btn");
    fireEvent.click(openBtn);

    expect(screen.getByTestId("add-lost-found-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-add-modal-btn"));
    expect(screen.queryByTestId("add-lost-found-modal")).not.toBeInTheDocument();
  });

  it("should open and close Change Modal", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: dummyProfile,
        lostFounds: dummyItems,
      },
    });

    const editBtn = screen.getByTestId("edit-item-btn-1");
    fireEvent.click(editBtn);

    expect(screen.getByTestId("edit-lost-found-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-change-modal-btn"));
    expect(screen.queryByTestId("edit-lost-found-modal")).not.toBeInTheDocument();
  });

  it("should reload lostFounds when isLostFoundDeleted is true", () => {
    const listSpy = vi
      .spyOn(actionModule, "asyncSetLostFounds")
      .mockReturnValue(() => Promise.resolve());
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: dummyProfile,
        isLostFoundDeleted: true,
      },
    });
    expect(listSpy).toHaveBeenCalled();
  });

  it("should handle delete item with confirmation", async () => {
    const deleteActionSpy = vi
      .spyOn(actionModule, "asyncSetIsLostFoundDelete")
      .mockReturnValue(() => {});

    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({
      isConfirmed: true,
    });

    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: dummyProfile,
        lostFounds: dummyItems,
      },
    });

    const deleteBtn = screen.getByTestId("delete-item-btn-1");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(deleteActionSpy).toHaveBeenCalledWith(1);
    });
  });

  it("should not delete item if confirmation cancelled", async () => {
    const deleteActionSpy = vi
      .spyOn(actionModule, "asyncSetIsLostFoundDelete")
      .mockReturnValue(() => {});

    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({
      isConfirmed: false,
    });

    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: dummyProfile,
        lostFounds: dummyItems,
      },
    });

    const deleteBtn = screen.getByTestId("delete-item-btn-1");
    fireEvent.click(deleteBtn);

    expect(deleteActionSpy).not.toHaveBeenCalled();
  });

  it("should handle null lostFounds array", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: dummyProfile,
        lostFounds: null,
      },
    });

    expect(screen.getByText("Tidak ada laporan yang ditemukan")).toBeInTheDocument();
  });

  it("should handle items with null title/description/author and filter with search", () => {
    const oddItems = [
      {
        id: 99,
        title: null,
        description: null,
        status: "lost",
        is_completed: 0,
        author: null,
      },
    ];

    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: dummyProfile,
        lostFounds: oddItems,
      },
    });

    expect(screen.getByText("Anonim")).toBeInTheDocument();

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "test" } });
  });

  it("should handle unmount during isLostFoundDeleted reload", () => {
    let resolveReload;
    vi.spyOn(actionModule, "asyncSetLostFounds").mockReturnValue(
      () => new Promise((resolve) => { resolveReload = resolve; })
    );

    const { unmount } = renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: dummyProfile,
        isLostFoundDeleted: true,
      },
    });

    unmount();
    if (resolveReload) resolveReload();
  });
});
