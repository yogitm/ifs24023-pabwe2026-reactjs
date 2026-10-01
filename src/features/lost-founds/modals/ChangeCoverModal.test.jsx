import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import ChangeCoverModal from "./ChangeCoverModal";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import * as actionModule from "../states/action";

describe("ChangeCoverModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.URL.createObjectURL = vi.fn(() => "blob:http://localhost/dummy-url");
  });

  const dummyItem = {
    id: 1,
    title: "Kunci Motor",
    cover: "http://example.com/cover.jpg",
  };

  it("should not render when show is false or item is null", () => {
    renderWithProviders(<ChangeCoverModal show={false} onClose={vi.fn()} lostFound={dummyItem} />);
    expect(screen.queryByTestId("change-cover-modal")).not.toBeInTheDocument();

    renderWithProviders(<ChangeCoverModal show={true} onClose={vi.fn()} lostFound={null} />);
    expect(screen.queryByTestId("change-cover-modal")).not.toBeInTheDocument();
  });

  it("should validate file type and size", () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue();
    renderWithProviders(<ChangeCoverModal show={true} onClose={vi.fn()} lostFound={dummyItem} />);

    const fileInput = screen.getByTestId("cover-file-input");

    // Invalid type
    const txtFile = new File(["dummy"], "file.txt", { type: "text/plain" });
    fireEvent.change(fileInput, { target: { files: [txtFile] } });
    expect(errorSpy).toHaveBeenCalledWith("Hanya file JPEG, JPG, atau PNG yang diperbolehkan!");

    // Too large
    const largeFile = new File(["dummy"], "large.png", { type: "image/png" });
    Object.defineProperty(largeFile, "size", { value: 2 * 1024 * 1024 });
    fireEvent.change(fileInput, { target: { files: [largeFile] } });
    expect(errorSpy).toHaveBeenCalledWith("Ukuran file terlalu besar. Maksimal 1MB!");
  });

  it("should upload valid file properly", () => {
    const coverActionSpy = vi
      .spyOn(actionModule, "asyncSetIsLostFoundChangeCover")
      .mockReturnValue(() => {});

    renderWithProviders(<ChangeCoverModal show={true} onClose={vi.fn()} lostFound={dummyItem} />);

    const validFile = new File(["dummy"], "valid.jpg", { type: "image/jpeg" });
    const fileInput = screen.getByTestId("cover-file-input");
    fireEvent.change(fileInput, { target: { files: [validFile] } });

    expect(screen.getByText("valid.jpg")).toBeInTheDocument();

    const submitBtn = screen.getByTestId("submit-cover-btn");
    fireEvent.click(submitBtn);

    expect(coverActionSpy).toHaveBeenCalledWith(1, validFile);
  });

  it("should close when isLostFoundChangedCover is true", () => {
    const onClose = vi.fn();
    renderWithProviders(
      <ChangeCoverModal show={true} onClose={onClose} lostFound={dummyItem} />,
      {
        preloadedState: {
          isLostFoundChangeCover: true,
          isLostFoundChangedCover: true,
        },
      }
    );

    expect(onClose).toHaveBeenCalled();
  });

  it("should handle cancel and close buttons", () => {
    const onClose = vi.fn();
    renderWithProviders(<ChangeCoverModal show={true} onClose={onClose} lostFound={dummyItem} />);

    fireEvent.click(screen.getByTestId("close-cover-modal-btn"));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId("cancel-cover-btn"));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("should show error when submitting without selecting a file", () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue();
    renderWithProviders(<ChangeCoverModal show={true} onClose={vi.fn()} lostFound={dummyItem} />);
    const submitBtn = screen.getByTestId("submit-cover-btn");
    fireEvent.click(submitBtn);
    expect(errorSpy).toHaveBeenCalledWith("Pilih file cover terlebih dahulu!");
  });

  it("should render placeholder when cover is null and ignore empty file change", () => {
    renderWithProviders(<ChangeCoverModal show={true} onClose={vi.fn()} lostFound={{ id: 1, cover: null }} />);
    expect(screen.getByText("Belum ada cover terpilih")).toBeInTheDocument();

    const fileInput = screen.getByTestId("cover-file-input");
    fireEvent.change(fileInput, { target: { files: [] } });
    expect(screen.getByText("Belum ada cover terpilih")).toBeInTheDocument();
  });

  it("should handle isLostFoundChangeCover true with isLostFoundChangedCover false and lostFound without id", () => {
    const onClose = vi.fn();
    renderWithProviders(
      <ChangeCoverModal show={true} onClose={onClose} lostFound={{ title: "No id" }} />,
      {
        preloadedState: {
          isLostFoundChangeCover: true,
          isLostFoundChangedCover: false,
        },
      }
    );
    expect(onClose).not.toHaveBeenCalled();

    // Now with isLostFoundChangedCover: true and lostFound without id
    const { rerender } = renderWithProviders(
      <ChangeCoverModal show={true} onClose={onClose} lostFound={{ title: "No id" }} />,
      {
        preloadedState: {
          isLostFoundChangeCover: true,
          isLostFoundChangedCover: true,
        },
      }
    );
    expect(onClose).toHaveBeenCalled();
  });
});
