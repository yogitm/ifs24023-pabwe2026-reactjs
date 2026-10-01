import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  asyncSetLostFound,
  asyncSetIsLostFoundDelete,
  setIsLostFoundActionCreator,
  setIsLostFoundDeleteActionCreator,
} from "../states/action";
import { formatDate, showConfirmDialog } from "../../../helpers/toolsHelper";
import ChangeCoverModal from "../modals/ChangeCoverModal";
import ChangeModal from "../modals/ChangeModal";
import {
  IconArrowLeft,
  IconPhotoUp,
  IconEdit,
  IconTrash,
  IconCalendar,
  IconCircleCheck,
  IconClock,
  IconPhoto,
  IconUser,
  IconTag,
} from "@tabler/icons-react";

function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profile = useSelector((state) => state.profile);
  const lostFound = useSelector((state) => state.lostFound);
  const isLostFound = useSelector((state) => state.isLostFound);
  const isLostFoundDeleted = useSelector((state) => state.isLostFoundDeleted);

  const [showCoverModal, setShowCoverModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    dispatch(asyncSetLostFound(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (isLostFound) {
      dispatch(setIsLostFoundActionCreator(false));
      if (!lostFound) {
        navigate("/");
      }
    }
  }, [isLostFound, lostFound, navigate, dispatch]);

  useEffect(() => {
    if (isLostFoundDeleted) {
      dispatch(setIsLostFoundDeleteActionCreator(false));
      navigate("/");
    }
  }, [isLostFoundDeleted, navigate, dispatch]);

  if (!profile || !lostFound) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isOwner =
    lostFound.user_id === profile.id ||
    (lostFound.author && lostFound.author.name === profile.name);

  async function handleDelete() {
    const result = await showConfirmDialog(
      "Apakah Anda yakin ingin menghapus laporan ini?"
    );
    if (result.isConfirmed) {
      dispatch(asyncSetIsLostFoundDelete(lostFound.id));
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Top Back & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/"
          data-testid="back-to-home-link"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <IconArrowLeft size={18} />
          Kembali ke Beranda
        </Link>

        {isOwner && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="edit-cover-btn"
              onClick={() => setShowCoverModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200/60 transition-colors"
            >
              <IconPhotoUp size={16} />
              Ubah Cover
            </button>
            <button
              type="button"
              data-testid="edit-detail-btn"
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 transition-colors"
            >
              <IconEdit size={16} />
              Ubah Laporan
            </button>
            <button
              type="button"
              data-testid="delete-detail-btn"
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 transition-colors"
            >
              <IconTrash size={16} />
              Hapus
            </button>
          </div>
        )}
      </div>

      {/* Main Detail Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Cover Preview Area */}
        <div className="relative aspect-video sm:aspect-21/9 w-full bg-slate-100 overflow-hidden">
          {lostFound.cover ? (
            <img
              src={lostFound.cover}
              alt={lostFound.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-gradient-to-br from-slate-50 to-slate-100">
              <IconPhoto size={56} stroke={1.5} />
              <p className="text-sm mt-2 text-slate-400">Belum ada foto bukti/cover</p>
            </div>
          )}

          {/* Badges on Cover */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm ${
                lostFound.status === "lost"
                  ? "bg-rose-500 text-white"
                  : "bg-teal-500 text-white"
              }`}
            >
              {lostFound.status === "lost" ? "Barang Hilang" : "Barang Temuan"}
            </span>

            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${
                lostFound.is_completed
                  ? "bg-emerald-600 text-white"
                  : "bg-amber-500 text-white"
              }`}
            >
              {lostFound.is_completed ? "Selesai Dikembalikan" : "Dalam Proses"}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {lostFound.title}
            </h1>

            {/* Author and Date Meta */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                {lostFound.author?.photo ? (
                  <img
                    src={lostFound.author.photo}
                    alt={lostFound.author.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[10px]">
                    <IconUser size={14} />
                  </div>
                )}
                <span className="font-semibold text-slate-700">
                  {lostFound.author?.name || "Anonim"}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <IconCalendar size={15} />
                <span>Dilaporkan: {formatDate(lostFound.created_at)}</span>
              </div>

              {lostFound.updated_at && (
                <div className="flex items-center gap-1.5">
                  <IconClock size={15} />
                  <span>Diperbarui: {formatDate(lostFound.updated_at)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Keterangan Lengkap &amp; Lokasi
            </h2>
            <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
              {lostFound.description}
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ChangeCoverModal
        show={showCoverModal}
        onClose={() => setShowCoverModal(false)}
        lostFound={lostFound}
      />
      <ChangeModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        lostFoundId={lostFound.id}
      />
    </div>
  );
}

export default DetailPage;
