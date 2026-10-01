import { describe, it, expect, vi, beforeEach } from "vitest";
import lostFoundApi from "./lostFoundApi";
import apiHelper from "../../../helpers/apiHelper";

describe("lostFoundApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("postLostFound", () => {
    it("should create new lost-found and return data on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { lost_found_id: 10 },
        }),
      });

      const res = await lostFoundApi.postLostFound("Title", "Description", "lost");
      expect(res).toEqual({ lost_found_id: 10 });
    });

    it("should throw error if creation fails", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Data tidak valid",
        }),
      });

      await expect(lostFoundApi.postLostFound("", "", "")).rejects.toThrow("Data tidak valid");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(lostFoundApi.postLostFound("", "", "")).rejects.toThrow(
        "Gagal menambahkan data lost & found"
      );
    });
  });

  describe("postLostFoundCover", () => {
    it("should upload cover and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah cover",
        }),
      });

      const dummyFile = new File(["dummy"], "cover.jpg", { type: "image/jpeg" });
      const msg = await lostFoundApi.postLostFoundCover(1, dummyFile);
      expect(msg).toBe("Berhasil mengubah cover");
    });

    it("should handle cover file without name property properly", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil",
        }),
      });

      const dummyBlob = new Blob(["dummy"], { type: "image/jpeg" });
      const msg = await lostFoundApi.postLostFoundCover(1, dummyBlob);
      expect(msg).toBe("Berhasil");
    });

    it("should throw error on upload cover fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Format tidak didukung",
        }),
      });

      const dummyFile = new File(["dummy"], "cover.jpg");
      await expect(lostFoundApi.postLostFoundCover(1, dummyFile)).rejects.toThrow(
        "Format tidak didukung"
      );
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      const dummyFile = new File(["dummy"], "cover.jpg");
      await expect(lostFoundApi.postLostFoundCover(1, dummyFile)).rejects.toThrow(
        "Gagal mengubah cover"
      );
    });
  });

  describe("putLostFound", () => {
    it("should update lost-found and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah data",
        }),
      });

      const msg = await lostFoundApi.putLostFound(1, "Title", "Desc", "found", true);
      expect(msg).toBe("Berhasil mengubah data");
    });

    it("should handle is_completed as false", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah data",
        }),
      });

      const msg = await lostFoundApi.putLostFound(1, "Title", "Desc", "lost", false);
      expect(msg).toBe("Berhasil mengubah data");
    });

    it("should throw error if update fails", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Gagal update",
        }),
      });

      await expect(lostFoundApi.putLostFound(1, "", "", "", false)).rejects.toThrow("Gagal update");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(lostFoundApi.putLostFound(1, "", "", "", false)).rejects.toThrow(
        "Gagal mengubah data lost & found"
      );
    });
  });

  describe("getLostFounds", () => {
    it("should get list of lost-founds without parameters", async () => {
      const mockList = [{ id: 1, title: "Item 1" }];
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { lost_founds: mockList },
        }),
      });

      const res = await lostFoundApi.getLostFounds();
      expect(res).toEqual(mockList);
    });

    it("should get list of lost-founds with filter parameters", async () => {
      const mockList = [{ id: 2, title: "Item 2" }];
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { lost_founds: mockList },
        }),
      });

      const res = await lostFoundApi.getLostFounds({
        status: "lost",
        is_completed: 1,
        is_me: 1,
        search: "kunci",
      });
      expect(res).toEqual(mockList);
    });

    it("should fallback to empty array if lost_founds is missing in data", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: {},
        }),
      });

      const res = await lostFoundApi.getLostFounds();
      expect(res).toEqual([]);
    });

    it("should throw error if fetch list fails", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Server error",
        }),
      });

      await expect(lostFoundApi.getLostFounds()).rejects.toThrow("Server error");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(lostFoundApi.getLostFounds()).rejects.toThrow(
        "Gagal mengambil data lost & found"
      );
    });
  });

  describe("getLostFoundById", () => {
    it("should return lost-found detail by id on success", async () => {
      const mockItem = { id: 1, title: "Item 1" };
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { lost_found: mockItem },
        }),
      });

      const res = await lostFoundApi.getLostFoundById(1);
      expect(res).toEqual(mockItem);
    });

    it("should throw error if get detail fails", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Tidak ditemukan",
        }),
      });

      await expect(lostFoundApi.getLostFoundById(99)).rejects.toThrow("Tidak ditemukan");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(lostFoundApi.getLostFoundById(99)).rejects.toThrow(
        "Gagal mengambil detail lost & found"
      );
    });
  });

  describe("deleteLostFound", () => {
    it("should delete lost-found and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil menghapus data",
        }),
      });

      const msg = await lostFoundApi.deleteLostFound(1);
      expect(msg).toBe("Berhasil menghapus data");
    });

    it("should throw error if delete fails", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Tidak diizinkan",
        }),
      });

      await expect(lostFoundApi.deleteLostFound(1)).rejects.toThrow("Tidak diizinkan");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(lostFoundApi.deleteLostFound(1)).rejects.toThrow(
        "Gagal menghapus data lost & found"
      );
    });
  });

  describe("getStatsDaily", () => {
    it("should return daily statistics on success", async () => {
      const mockStats = { stats_losts: {}, stats_founds: {} };
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: mockStats,
        }),
      });

      const res = await lostFoundApi.getStatsDaily();
      expect(res).toEqual(mockStats);
    });

    it("should fallback to empty object if data is missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
        }),
      });

      const res = await lostFoundApi.getStatsDaily();
      expect(res).toEqual({});
    });

    it("should throw error if get daily stats fails", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Error stats",
        }),
      });

      await expect(lostFoundApi.getStatsDaily()).rejects.toThrow("Error stats");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(lostFoundApi.getStatsDaily()).rejects.toThrow("Gagal mengambil statistik harian");
    });
  });

  describe("getStatsMonthly", () => {
    it("should return monthly statistics on success", async () => {
      const mockStats = { stats_losts: {} };
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: mockStats,
        }),
      });

      const res = await lostFoundApi.getStatsMonthly();
      expect(res).toEqual(mockStats);
    });

    it("should fallback to empty object if data is missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
        }),
      });

      const res = await lostFoundApi.getStatsMonthly();
      expect(res).toEqual({});
    });

    it("should throw error if get monthly stats fails", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Error monthly stats",
        }),
      });

      await expect(lostFoundApi.getStatsMonthly()).rejects.toThrow("Error monthly stats");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(lostFoundApi.getStatsMonthly()).rejects.toThrow(
        "Gagal mengambil statistik bulanan"
      );
    });
  });
});
