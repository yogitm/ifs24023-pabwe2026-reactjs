import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import {
  asyncSetIsLostFoundChangeCover,
  asyncSetLostFound,
  setIsLostFoundChangeCoverActionCreator,
  setIsLostFoundChangedCoverActionCreator,
} from "../states/action";
import { IconX, IconPhotoUp, IconLoader2, IconUpload } from "@tabler/icons-react";

function ChangeCoverModal({ show, onClose, lostFound }) {
  const dispatch = useDispatch();

  const isLostFoundChangeCover = useSelector((state) => state.isLostFoundChangeCover);
  const isLostFoundChangedCover = useSelector((state) => state.isLostFoundChangedCover);

  const [loading, setLoading] = useState(false);
  const [fileCover, setFileCover] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
      setFileCover(null);
      setPreviewUrl(null);
    } else {
      document.body.style.overflow = "auto";
    }
  }, [show]);

  useEffect(() => {
    if (isLostFoundChangeCover) {
      dispatch(setIsLostFoundChangeCoverActionCreator(false));
      setLoading(false);
      if (isLostFoundChangedCover) {
        dispatch(setIsLostFoundChangedCoverActionCreator(false));
        if (lostFound?.id) {
          dispatch(asyncSetLostFound(lostFound.id));
        }
        onClose();
      }
    }
  }, [isLostFoundChangeCover, isLostFoundChangedCover, dispatch, onClose, lostFound]);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        showErrorDialog("Hanya file JPEG, JPG, atau PNG yang diperbolehkan!");
        return;
      }
      const MAX_FILE_SIZE = 1024 * 1024; // 1MB
      if (file.size > MAX_FILE_SIZE) {
        showErrorDialog("Ukuran file terlalu besar. Maksimal 1MB!");
        return;
      }
      setFileCover(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  function handleSave(e) {
    e.preventDefault();
    if (!fileCover) {
      showErrorDialog("Pilih file cover terlebih dahulu!");
      return;
    }

    setLoading(true);
    dispatch(asyncSetIsLostFoundChangeCover(lostFound.id, fileCover));
  }

  if (!show || !lostFound) return null;

  return (
    <div
      data-testid="change-cover-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <IconPhotoUp size={18} stroke={2.5} />
            </div>
            <h3 className="text-base font-bold text-slate-800">Ubah Cover Laporan</h3>
          </div>
          <button
            type="button"
            data-testid="close-cover-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <IconX size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div className="flex flex-col items-center justify-center">
            {previewUrl ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mb-3">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : lostFound?.cover ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mb-3">
                <img
                  src={lostFound.cover}
                  alt="Current Cover"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 mb-3">
                <IconPhotoUp size={40} stroke={1.5} className="mb-2 text-slate-300" />
                <p className="text-xs">Belum ada cover terpilih</p>
              </div>
            )}

            <label className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold cursor-pointer transition-colors">
              <IconUpload size={18} />
              <span>{fileCover ? fileCover.name : "Pilih Berkas Foto Baru"}</span>
              <input
                type="file"
                data-testid="cover-file-input"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="text-[11px] text-slate-400 mt-2 text-center">
              Format yang didukung: JPG, JPEG, PNG (Maks. 1MB)
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              data-testid="cancel-cover-btn"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              data-testid="submit-cover-btn"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-semibold shadow-md shadow-sky-600/20 hover:bg-sky-700 transition-all disabled:opacity-50"
            >
              {loading && <IconLoader2 size={16} className="animate-spin" />}
              <span>Unggah Cover</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangeCoverModal;
