import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import ChangeModal from "./ChangeModal";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import * as actionModule from "../states/action";

describe("ChangeModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should not render when show is false", () => {
    renderWithProviders(<ChangeModal show={false} onClose={vi.fn()} lostFoundId={1} />);
    expect(screen.queryByTestId("edit-lost-found-modal")).not.toBeInTheDocument();
  });

  it("should populate inputs from preloaded state and handle validation", () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue();
    renderWithProviders(
      <ChangeModal show={true} onClose={vi.fn()} lostFoundId={1} />,
      {
        preloadedState: {
          lostFound: {
            id: 1,
            title: "Kunci Lama",
            description: "Deskripsi Lama",
            status: "lost",
            is_completed: 0,
          },
        },
      }
    );

    expect(screen.getByTestId("change-lost-found-title-input")).toHaveValue("Kunci Lama");
    expect(screen.getByTestId("change-lost-found-desc-input")).toHaveValue("Deskripsi Lama");

    const submitBtn = screen.getByTestId("submit-change-btn");
    // Clear title
    fireEvent.change(screen.getByTestId("change-lost-found-title-input"), {
      target: { value: "" },
    });
    fireEvent.click(submitBtn);
    expect(errorSpy).toHaveBeenCalledWith("Judul tidak boleh kosong");

    // Fill title, clear desc
    fireEvent.change(screen.getByTestId("change-lost-found-title-input"), {
      target: { value: "Kunci Baru" },
    });
    fireEvent.change(screen.getByTestId("change-lost-found-desc-input"), {
      target: { value: "" },
    });
    fireEvent.click(submitBtn);
    expect(errorSpy).toHaveBeenCalledWith("Deskripsi tidak boleh kosong");
  });

  it("should toggle status and completed checkbox and submit change", () => {
    const changeActionSpy = vi
      .spyOn(actionModule, "asyncSetIsLostFoundChange")
      .mockReturnValue(() => {});

    renderWithProviders(
      <ChangeModal show={true} onClose={vi.fn()} lostFoundId={1} />,
      {
        preloadedState: {
          lostFound: {
            id: 1,
            title: "Dompet",
            description: "Dekat parkir",
            status: "lost",
            is_completed: 0,
          },
        },
      }
    );

    const lostBtn = screen.getByTestId("change-status-lost-btn");
    fireEvent.click(lostBtn);

    const foundBtn = screen.getByTestId("change-status-found-btn");
    fireEvent.click(foundBtn);

    const checkbox = screen.getByTestId("change-is-completed-checkbox");
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    const submitBtn = screen.getByTestId("submit-change-btn");
    fireEvent.click(submitBtn);

    expect(changeActionSpy).toHaveBeenCalledWith(
      1,
      "Dompet",
      "Dekat parkir",
      "found",
      true
    );
  });

  it("should close modal when isLostFoundChanged is true", () => {
    const onClose = vi.fn();
    renderWithProviders(
      <ChangeModal show={true} onClose={onClose} lostFoundId={1} />,
      {
        preloadedState: {
          isLostFoundChange: true,
          isLostFoundChanged: true,
        },
      }
    );

    expect(onClose).toHaveBeenCalled();
  });

  it("should handle cancel and close buttons", () => {
    const onClose = vi.fn();
    renderWithProviders(<ChangeModal show={true} onClose={onClose} lostFoundId={1} />);

    fireEvent.click(screen.getByTestId("close-change-modal-btn"));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId("cancel-change-btn"));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("should handle null title/description/status and use fallback defaults", () => {
    renderWithProviders(<ChangeModal show={true} onClose={vi.fn()} lostFoundId={1} />, {
      preloadedState: {
        lostFound: {
          id: 1,
          title: null,
          description: null,
          status: null,
          is_completed: 0,
        },
      },
    });

    expect(screen.getByTestId("change-lost-found-title-input")).toHaveValue("");
    expect(screen.getByTestId("change-lost-found-desc-input")).toHaveValue("");
  });

  it("should handle isLostFoundChange true with isLostFoundChanged false and null lostFoundId", () => {
    const onClose = vi.fn();
    renderWithProviders(
      <ChangeModal show={true} onClose={onClose} lostFoundId={null} />,
      {
        preloadedState: {
          isLostFoundChange: true,
          isLostFoundChanged: false,
        },
      }
    );
    expect(onClose).not.toHaveBeenCalled();

    renderWithProviders(
      <ChangeModal show={true} onClose={onClose} lostFoundId={null} />,
      {
        preloadedState: {
          isLostFoundChange: true,
          isLostFoundChanged: true,
        },
      }
    );
    expect(onClose).toHaveBeenCalled();
  });
});
