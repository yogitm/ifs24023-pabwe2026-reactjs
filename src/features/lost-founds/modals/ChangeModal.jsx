import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import {
  asyncSetIsLostFoundChange,
  asyncSetLostFound,
  asyncSetLostFounds,
  setIsLostFoundChangeActionCreator,
  setIsLostFoundChangedActionCreator,
} from "../states/action";
import { IconX, IconEdit, IconLoader2 } from "@tabler/icons-react";

function ChangeModal({ show, onClose, lostFoundId }) {
  const dispatch = useDispatch();

  const isLostFoundChange = useSelector((state) => state.isLostFoundChange);
  const isLostFoundChanged = useSelector((state) => state.isLostFoundChanged);
  const lostFound = useSelector((state) => state.lostFound);

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("lost");
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (lostFoundId && show) {
      dispatch(asyncSetLostFound(lostFoundId));
    }
  }, [lostFoundId, show, dispatch]);

  useEffect(() => {
    if (lostFound && show) {
      setTitle(lostFound.title || "");
      setDescription(lostFound.description || "");
      setStatus(lostFound.status || "lost");
      setIsCompleted(Boolean(lostFound.is_completed));
    }
  }, [lostFound, show]);

  useEffect(() => {
    if (isLostFoundChange) {
      setLoading(false);
      dispatch(setIsLostFoundChangeActionCreator(false));
      if (isLostFoundChanged) {
        dispatch(setIsLostFoundChangedActionCreator(false));
        dispatch(asyncSetLostFounds());
        if (lostFoundId) {
          dispatch(asyncSetLostFound(lostFoundId));
        }
        onClose();
      }
    }
  }, [isLostFoundChange, isLostFoundChanged, dispatch, onClose, lostFoundId]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [show]);

  function handleSave(e) {
    e.preventDefault();
    if (!title.trim()) {
      showErrorDialog("Judul tidak boleh kosong");
      return;
    }

    if (!description.trim()) {
      showErrorDialog("Deskripsi tidak boleh kosong");
      return;
    }

    setLoading(true);
    dispatch(
      asyncSetIsLostFoundChange(
        lostFoundId,
        title.trim(),
        description.trim(),
        status,
        isCompleted
      )
    );
  }

  if (!show) return null;

  return (
    <div
      data-testid="edit-lost-found-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <IconEdit size={18} stroke={2.5} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Ubah Data Laporan
            </h3>
          </div>
          <button
            type="button"
            data-testid="close-change-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <IconX size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Jenis Laporan
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                data-testid="change-status-lost-btn"
                onClick={() => setStatus("lost")}
                className={`py-2 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  status === "lost"
                    ? "bg-rose-50 border-rose-500 text-rose-700 shadow-xs"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                🔍 Barang Hilang (Lost)
              </button>
              <button
                type="button"
                data-testid="change-status-found-btn"
                onClick={() => setStatus("found")}
                className={`py-2 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  status === "found"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                ✨ Barang Temuan (Found)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Judul Barang / Laporan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              data-testid="change-lost-found-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Deskripsi &amp; Lokasi Terakhir <span className="text-red-500">*</span>
            </label>
            <textarea
              data-testid="change-lost-found-desc-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm resize-none"
            />
          </div>

          {/* Toggle Selesai / Completed */}
          <div className="pt-2">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                data-testid="change-is-completed-checkbox"
                checked={isCompleted}
                onChange={(e) => setIsCompleted(e.target.checked)}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <div>
                <span className="text-sm font-bold text-slate-800">
                  Tandai Sebagai Selesai (Completed)
                </span>
                <p className="text-xs text-slate-500">
                  Centang jika barang telah dikembalikan ke pemilik atau telah ditemukan.
                </p>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              data-testid="cancel-change-btn"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              data-testid="submit-change-btn"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-semibold shadow-md shadow-amber-600/20 hover:bg-amber-700 transition-all disabled:opacity-50"
            >
              {loading && <IconLoader2 size={16} className="animate-spin" />}
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangeModal;
