import { describe, it, expect } from "vitest";
import { ActionType } from "./action";
import {
  lostFoundsReducer,
  lostFoundReducer,
  isLostFoundReducer,
  isLostFoundAddReducer,
  isLostFoundAddedReducer,
  isLostFoundChangeReducer,
  isLostFoundChangedReducer,
  isLostFoundChangeCoverReducer,
  isLostFoundChangedCoverReducer,
  isLostFoundDeleteReducer,
  isLostFoundDeletedReducer,
  lostFoundStatsReducer,
} from "./reducer";

describe("lost-founds reducers", () => {
  it("should return default states when no action matches", () => {
    expect(lostFoundsReducer(undefined, {})).toEqual([]);
    expect(lostFoundReducer(undefined, {})).toBeNull();
    expect(isLostFoundReducer(undefined, {})).toBe(false);
    expect(isLostFoundAddReducer(undefined, {})).toBe(false);
    expect(isLostFoundAddedReducer(undefined, {})).toBe(false);
    expect(isLostFoundChangeReducer(undefined, {})).toBe(false);
    expect(isLostFoundChangedReducer(undefined, {})).toBe(false);
    expect(isLostFoundChangeCoverReducer(undefined, {})).toBe(false);
    expect(isLostFoundChangedCoverReducer(undefined, {})).toBe(false);
    expect(isLostFoundDeleteReducer(undefined, {})).toBe(false);
    expect(isLostFoundDeletedReducer(undefined, {})).toBe(false);
    expect(lostFoundStatsReducer(undefined, {})).toBeNull();
  });

  it("should handle SET_LOST_FOUNDS", () => {
    const list = [{ id: 1, title: "Dompet" }];
    const res = lostFoundsReducer([], {
      type: ActionType.SET_LOST_FOUNDS,
      payload: list,
    });
    expect(res).toEqual(list);
  });

  it("should handle SET_LOST_FOUND", () => {
    const item = { id: 1, title: "Kunci" };
    expect(
      lostFoundReducer(null, { type: ActionType.SET_LOST_FOUND, payload: item })
    ).toEqual(item);
  });

  it("should handle SET_IS_LOST_FOUND", () => {
    expect(
      isLostFoundReducer(false, {
        type: ActionType.SET_IS_LOST_FOUND,
        payload: true,
      })
    ).toBe(true);
  });

  it("should handle SET_IS_LOST_FOUND_ADD", () => {
    expect(
      isLostFoundAddReducer(false, {
        type: ActionType.SET_IS_LOST_FOUND_ADD,
        payload: true,
      })
    ).toBe(true);
  });

  it("should handle SET_IS_LOST_FOUND_ADDED", () => {
    expect(
      isLostFoundAddedReducer(false, {
        type: ActionType.SET_IS_LOST_FOUND_ADDED,
        payload: true,
      })
    ).toBe(true);
  });

  it("should handle SET_IS_LOST_FOUND_CHANGE", () => {
    expect(
      isLostFoundChangeReducer(false, {
        type: ActionType.SET_IS_LOST_FOUND_CHANGE,
        payload: true,
      })
    ).toBe(true);
  });

  it("should handle SET_IS_LOST_FOUND_CHANGED", () => {
    expect(
      isLostFoundChangedReducer(false, {
        type: ActionType.SET_IS_LOST_FOUND_CHANGED,
        payload: true,
      })
    ).toBe(true);
  });

  it("should handle SET_IS_LOST_FOUND_CHANGE_COVER", () => {
    expect(
      isLostFoundChangeCoverReducer(false, {
        type: ActionType.SET_IS_LOST_FOUND_CHANGE_COVER,
        payload: true,
      })
    ).toBe(true);
  });

  it("should handle SET_IS_LOST_FOUND_CHANGED_COVER", () => {
    expect(
      isLostFoundChangedCoverReducer(false, {
        type: ActionType.SET_IS_LOST_FOUND_CHANGED_COVER,
        payload: true,
      })
    ).toBe(true);
  });

  it("should handle SET_IS_LOST_FOUND_DELETE", () => {
    expect(
      isLostFoundDeleteReducer(false, {
        type: ActionType.SET_IS_LOST_FOUND_DELETE,
        payload: true,
      })
    ).toBe(true);
  });

  it("should handle SET_IS_LOST_FOUND_DELETED", () => {
    expect(
      isLostFoundDeletedReducer(false, {
        type: ActionType.SET_IS_LOST_FOUND_DELETED,
        payload: true,
      })
    ).toBe(true);
  });

  it("should handle SET_LOST_FOUND_STATS", () => {
    const stats = { daily: {}, monthly: {} };
    expect(
      lostFoundStatsReducer(null, {
        type: ActionType.SET_LOST_FOUND_STATS,
        payload: stats,
      })
    ).toEqual(stats);
  });
});
