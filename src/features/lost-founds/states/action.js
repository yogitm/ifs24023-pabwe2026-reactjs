import {
  showErrorDialog,
  showSuccessDialog,
} from "../../../helpers/toolsHelper";
import lostFoundApi from "../api/lostFoundApi";

export const ActionType = {
  SET_LOST_FOUNDS: "SET_LOST_FOUNDS",
  SET_LOST_FOUND: "SET_LOST_FOUND",
  SET_IS_LOST_FOUND: "SET_IS_LOST_FOUND",
  SET_IS_LOST_FOUND_ADD: "SET_IS_LOST_FOUND_ADD",
  SET_IS_LOST_FOUND_ADDED: "SET_IS_LOST_FOUND_ADDED",
  SET_IS_LOST_FOUND_CHANGE: "SET_IS_LOST_FOUND_CHANGE",
  SET_IS_LOST_FOUND_CHANGED: "SET_IS_LOST_FOUND_CHANGED",
  SET_IS_LOST_FOUND_CHANGE_COVER: "SET_IS_LOST_FOUND_CHANGE_COVER",
  SET_IS_LOST_FOUND_CHANGED_COVER: "SET_IS_LOST_FOUND_CHANGED_COVER",
  SET_IS_LOST_FOUND_DELETE: "SET_IS_LOST_FOUND_DELETE",
  SET_IS_LOST_FOUND_DELETED: "SET_IS_LOST_FOUND_DELETED",
  SET_LOST_FOUND_STATS: "SET_LOST_FOUND_STATS",
};

export function setLostFoundsActionCreator(lostFounds) {
  return {
    type: ActionType.SET_LOST_FOUNDS,
    payload: lostFounds,
  };
}

export function asyncSetLostFounds(filterParams = {}) {
  return async (dispatch) => {
    try {
      const lostFounds = await lostFoundApi.getLostFounds(filterParams);
      dispatch(setLostFoundsActionCreator(lostFounds));
    } catch (error) {
      dispatch(setLostFoundsActionCreator([]));
    }
  };
}

export function setLostFoundActionCreator(lostFound) {
  return {
    type: ActionType.SET_LOST_FOUND,
    payload: lostFound,
  };
}

export function setIsLostFoundActionCreator(status) {
  return {
    type: ActionType.SET_IS_LOST_FOUND,
    payload: status,
  };
}

export function asyncSetLostFound(id) {
  return async (dispatch) => {
    try {
      const lostFound = await lostFoundApi.getLostFoundById(id);
      dispatch(setLostFoundActionCreator(lostFound));
    } catch (error) {
      dispatch(setLostFoundActionCreator(null));
    } finally {
      dispatch(setIsLostFoundActionCreator(true));
    }
  };
}

export function setIsLostFoundAddActionCreator(isLostFoundAdd) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_ADD,
    payload: isLostFoundAdd,
  };
}

export function setIsLostFoundAddedActionCreator(isLostFoundAdded) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_ADDED,
    payload: isLostFoundAdded,
  };
}

export function asyncSetIsLostFoundAdd(title, description, status) {
  return async (dispatch) => {
    try {
      await lostFoundApi.postLostFound(title, description, status);
      showSuccessDialog("Laporan berhasil ditambahkan!");
      dispatch(setIsLostFoundAddedActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
      dispatch(setIsLostFoundAddedActionCreator(false));
    } finally {
      dispatch(setIsLostFoundAddActionCreator(true));
    }
  };
}

export function setIsLostFoundChangeActionCreator(isLostFoundChange) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_CHANGE,
    payload: isLostFoundChange,
  };
}

export function setIsLostFoundChangedActionCreator(isLostFoundChanged) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_CHANGED,
    payload: isLostFoundChanged,
  };
}

export function asyncSetIsLostFoundChange(id, title, description, status, is_completed) {
  return async (dispatch) => {
    try {
      const message = await lostFoundApi.putLostFound(
        id,
        title,
        description,
        status,
        is_completed
      );
      showSuccessDialog(message || "Laporan berhasil diperbarui!");
      dispatch(setIsLostFoundChangedActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
      dispatch(setIsLostFoundChangedActionCreator(false));
    } finally {
      dispatch(setIsLostFoundChangeActionCreator(true));
    }
  };
}

export function setIsLostFoundChangeCoverActionCreator(isLostFoundChangeCover) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_CHANGE_COVER,
    payload: isLostFoundChangeCover,
  };
}

export function setIsLostFoundChangedCoverActionCreator(status) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_CHANGED_COVER,
    payload: status,
  };
}

export function asyncSetIsLostFoundChangeCover(id, cover) {
  return async (dispatch) => {
    try {
      const message = await lostFoundApi.postLostFoundCover(id, cover);
      showSuccessDialog(message || "Cover berhasil diperbarui!");
      dispatch(setIsLostFoundChangedCoverActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
      dispatch(setIsLostFoundChangedCoverActionCreator(false));
    } finally {
      dispatch(setIsLostFoundChangeCoverActionCreator(true));
    }
  };
}

export function setIsLostFoundDeleteActionCreator(isLostFoundDelete) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_DELETE,
    payload: isLostFoundDelete,
  };
}

export function setIsLostFoundDeletedActionCreator(isLostFoundDeleted) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_DELETED,
    payload: isLostFoundDeleted,
  };
}

export function asyncSetIsLostFoundDelete(id) {
  return async (dispatch) => {
    try {
      const message = await lostFoundApi.deleteLostFound(id);
      showSuccessDialog(message || "Laporan berhasil dihapus!");
      dispatch(setIsLostFoundDeletedActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
      dispatch(setIsLostFoundDeletedActionCreator(false));
    } finally {
      dispatch(setIsLostFoundDeleteActionCreator(true));
    }
  };
}

export function setLostFoundStatsActionCreator(stats) {
  return {
    type: ActionType.SET_LOST_FOUND_STATS,
    payload: stats,
  };
}

export function asyncSetLostFoundStats() {
  return async (dispatch) => {
    try {
      const daily = await lostFoundApi.getStatsDaily();
      const monthly = await lostFoundApi.getStatsMonthly();
      dispatch(setLostFoundStatsActionCreator({ daily, monthly }));
    } catch (error) {
      dispatch(setLostFoundStatsActionCreator({ daily: {}, monthly: {} }));
    }
  };
}
