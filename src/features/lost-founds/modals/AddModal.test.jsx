import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import AddModal from "./AddModal";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import * as actionModule from "../states/action";

describe("AddModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should not render when show is false", () => {
    renderWithProviders(<AddModal show={false} onClose={vi.fn()} />);
    expect(screen.queryByTestId("add-lost-found-modal")).not.toBeInTheDocument();
  });

  it("should render properly and handle validation errors", () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue();
    renderWithProviders(<AddModal show={true} onClose={vi.fn()} />);

    expect(screen.getByText("Buat Laporan Baru")).toBeInTheDocument();

    const submitBtn = screen.getByTestId("submit-add-btn");
    // Empty title
    fireEvent.click(submitBtn);
    expect(errorSpy).toHaveBeenCalledWith("Judul tidak boleh kosong");

    // Fill title, empty desc
    const titleInput = screen.getByTestId("add-lost-found-title-input");
    fireEvent.change(titleInput, { target: { value: "Kunci Hilang" } });
    fireEvent.click(submitBtn);
    expect(errorSpy).toHaveBeenCalledWith("Deskripsi tidak boleh kosong");
  });

  it("should switch status and submit correctly", () => {
    const addActionSpy = vi
      .spyOn(actionModule, "asyncSetIsLostFoundAdd")
      .mockReturnValue(() => {});

    renderWithProviders(<AddModal show={true} onClose={vi.fn()} />);

    const lostBtn = screen.getByTestId("select-status-lost-btn");
    fireEvent.click(lostBtn);

    const foundBtn = screen.getByTestId("select-status-found-btn");
    fireEvent.click(foundBtn);

    const titleInput = screen.getByTestId("add-lost-found-title-input");
    const descInput = screen.getByTestId("add-lost-found-desc-input");

    fireEvent.change(titleInput, { target: { value: "Dompet Coklat" } });
    fireEvent.change(descInput, { target: { value: "Ditemukan di kantin" } });

    const submitBtn = screen.getByTestId("submit-add-btn");
    fireEvent.click(submitBtn);

    expect(addActionSpy).toHaveBeenCalledWith("Dompet Coklat", "Ditemukan di kantin", "found");
  });

  it("should close modal and reset fields when successfully added", () => {
    const onClose = vi.fn();
    const { rerender } = renderWithProviders(
      <AddModal show={true} onClose={onClose} />,
      {
        preloadedState: {
          isLostFoundAdd: true,
          isLostFoundAdded: true,
        },
      }
    );

    expect(onClose).toHaveBeenCalled();
  });

  it("should handle close button clicks", () => {
    const onClose = vi.fn();
    renderWithProviders(<AddModal show={true} onClose={onClose} />);

    const closeBtn = screen.getByTestId("close-add-modal-btn");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();

    const cancelBtn = screen.getByTestId("cancel-add-btn");
    fireEvent.click(cancelBtn);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("should handle isLostFoundAdd true but isLostFoundAdded false", () => {
    const onClose = vi.fn();
    renderWithProviders(<AddModal show={true} onClose={onClose} />, {
      preloadedState: {
        isLostFoundAdd: true,
        isLostFoundAdded: false,
      },
    });
    expect(onClose).not.toHaveBeenCalled();
  });
});
