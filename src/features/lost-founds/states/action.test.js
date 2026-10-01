import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ActionType,
  setLostFoundsActionCreator,
  asyncSetLostFounds,
  setLostFoundActionCreator,
  setIsLostFoundActionCreator,
  asyncSetLostFound,
  setIsLostFoundAddActionCreator,
  setIsLostFoundAddedActionCreator,
  asyncSetIsLostFoundAdd,
  setIsLostFoundChangeActionCreator,
  setIsLostFoundChangedActionCreator,
  asyncSetIsLostFoundChange,
  setIsLostFoundChangeCoverActionCreator,
  setIsLostFoundChangedCoverActionCreator,
  asyncSetIsLostFoundChangeCover,
  setIsLostFoundDeleteActionCreator,
  setIsLostFoundDeletedActionCreator,
  asyncSetIsLostFoundDelete,
  setLostFoundStatsActionCreator,
  asyncSetLostFoundStats,
} from "./action";
import lostFoundApi from "../api/lostFoundApi";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("lost-founds action", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should create action objects correctly", () => {
    expect(setLostFoundsActionCreator([{ id: 1 }])).toEqual({
      type: ActionType.SET_LOST_FOUNDS,
      payload: [{ id: 1 }],
    });
    expect(setLostFoundActionCreator({ id: 1 })).toEqual({
      type: ActionType.SET_LOST_FOUND,
      payload: { id: 1 },
    });
    expect(setIsLostFoundActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND,
      payload: true,
    });
    expect(setIsLostFoundAddActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND_ADD,
      payload: true,
    });
    expect(setIsLostFoundAddedActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND_ADDED,
      payload: true,
    });
    expect(setIsLostFoundChangeActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND_CHANGE,
      payload: true,
    });
    expect(setIsLostFoundChangedActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND_CHANGED,
      payload: true,
    });
    expect(setIsLostFoundChangeCoverActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND_CHANGE_COVER,
      payload: true,
    });
    expect(setIsLostFoundChangedCoverActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND_CHANGED_COVER,
      payload: true,
    });
    expect(setIsLostFoundDeleteActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND_DELETE,
      payload: true,
    });
    expect(setIsLostFoundDeletedActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND_DELETED,
      payload: true,
    });
    expect(setLostFoundStatsActionCreator({ daily: {} })).toEqual({
      type: ActionType.SET_LOST_FOUND_STATS,
      payload: { daily: {} },
    });
  });

  describe("asyncSetLostFounds", () => {
    it("should dispatch setLostFoundsActionCreator on success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "getLostFounds").mockResolvedValue([{ id: 1 }]);

      await asyncSetLostFounds({ status: "lost" })(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setLostFoundsActionCreator([{ id: 1 }]));
    });

    it("should dispatch empty array on error", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "getLostFounds").mockRejectedValue(new Error("Err"));

      await asyncSetLostFounds()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setLostFoundsActionCreator([]));
    });
  });

  describe("asyncSetLostFound", () => {
    it("should dispatch setLostFoundActionCreator and setIsLostFound on success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "getLostFoundById").mockResolvedValue({ id: 1 });

      await asyncSetLostFound(1)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setLostFoundActionCreator({ id: 1 }));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundActionCreator(true));
    });

    it("should dispatch null on error and finally setIsLostFound", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "getLostFoundById").mockRejectedValue(new Error("Err"));

      await asyncSetLostFound(1)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setLostFoundActionCreator(null));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundActionCreator(true));
    });
  });

  describe("asyncSetIsLostFoundAdd", () => {
    it("should dispatch success actions when postLostFound succeeds", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "postLostFound").mockResolvedValue({ id: 1 });
      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue();

      await asyncSetIsLostFoundAdd("Title", "Desc", "lost")(dispatch);

      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Laporan berhasil ditambahkan!");
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundAddedActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundAddActionCreator(true));
    });

    it("should dispatch error actions when postLostFound fails", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "postLostFound").mockRejectedValue(new Error("Validation fail"));
      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue();

      await asyncSetIsLostFoundAdd("", "", "")(dispatch);

      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Validation fail");
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundAddedActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundAddActionCreator(true));
    });
  });

  describe("asyncSetIsLostFoundChange", () => {
    it("should dispatch success actions when putLostFound succeeds with custom message", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "putLostFound").mockResolvedValue("Updated successfully");
      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue();

      await asyncSetIsLostFoundChange(1, "Title", "Desc", "found", true)(dispatch);

      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Updated successfully");
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangedActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangeActionCreator(true));
    });

    it("should fallback success message if none returned", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "putLostFound").mockResolvedValue("");
      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue();

      await asyncSetIsLostFoundChange(1, "Title", "Desc", "found", true)(dispatch);

      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Laporan berhasil diperbarui!");
    });

    it("should dispatch error actions when putLostFound fails", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "putLostFound").mockRejectedValue(new Error("Fail put"));
      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue();

      await asyncSetIsLostFoundChange(1, "Title", "Desc", "found", true)(dispatch);

      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Fail put");
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangedActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangeActionCreator(true));
    });
  });

  describe("asyncSetIsLostFoundChangeCover", () => {
    it("should dispatch success actions on cover upload success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "postLostFoundCover").mockResolvedValue("Cover uploaded");
      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue();

      const dummy = new File([""], "c.jpg");
      await asyncSetIsLostFoundChangeCover(1, dummy)(dispatch);

      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Cover uploaded");
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangedCoverActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangeCoverActionCreator(true));
    });

    it("should fallback success message when empty", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "postLostFoundCover").mockResolvedValue("");
      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue();

      const dummy = new File([""], "c.jpg");
      await asyncSetIsLostFoundChangeCover(1, dummy)(dispatch);

      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Cover berhasil diperbarui!");
    });

    it("should dispatch error actions on cover upload error", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "postLostFoundCover").mockRejectedValue(new Error("Cover error"));
      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue();

      await asyncSetIsLostFoundChangeCover(1, null)(dispatch);

      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Cover error");
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangedCoverActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangeCoverActionCreator(true));
    });
  });

  describe("asyncSetIsLostFoundDelete", () => {
    it("should dispatch success actions on delete success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "deleteLostFound").mockResolvedValue("Deleted");
      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue();

      await asyncSetIsLostFoundDelete(1)(dispatch);

      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Deleted");
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundDeletedActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundDeleteActionCreator(true));
    });

    it("should fallback success message when empty", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "deleteLostFound").mockResolvedValue("");
      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue();

      await asyncSetIsLostFoundDelete(1)(dispatch);

      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Laporan berhasil dihapus!");
    });

    it("should dispatch error actions on delete fail", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "deleteLostFound").mockRejectedValue(new Error("Del error"));
      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue();

      await asyncSetIsLostFoundDelete(1)(dispatch);

      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Del error");
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundDeletedActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundDeleteActionCreator(true));
    });
  });

  describe("asyncSetLostFoundStats", () => {
    it("should dispatch setLostFoundStatsActionCreator on success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "getStatsDaily").mockResolvedValue({ daily_test: 1 });
      vi.spyOn(lostFoundApi, "getStatsMonthly").mockResolvedValue({ monthly_test: 2 });

      await asyncSetLostFoundStats()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(
        setLostFoundStatsActionCreator({
          daily: { daily_test: 1 },
          monthly: { monthly_test: 2 },
        })
      );
    });

    it("should dispatch empty stats on error", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "getStatsDaily").mockRejectedValue(new Error("Stats error"));

      await asyncSetLostFoundStats()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(
        setLostFoundStatsActionCreator({
          daily: {},
          monthly: {},
        })
      );
    });
  });
});
