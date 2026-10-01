import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import AddModal from "../modals/AddModal";
import ChangeModal from "../modals/ChangeModal";
import {
  asyncSetIsLostFoundDelete,
  asyncSetLostFounds,
  setIsLostFoundDeleteActionCreator,
} from "../states/action";
import { formatDate, showConfirmDialog } from "../../../helpers/toolsHelper";
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconCheck,
  IconClock,
  IconEye,
  IconPencil,
  IconTrash,
  IconPhoto,
  IconAlertCircle,
  IconUser,
  IconCircleCheck,
} from "@tabler/icons-react";

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profile = useSelector((state) => state.profile);
  const lostFounds = useSelector((state) => state.lostFounds);
  const isLostFoundDeleted = useSelector((state) => state.isLostFoundDeleted);

  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("all"); // 'all', 'lost', 'found', 'completed', 'process', 'mine'
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    let params = {};
    if (filterType === "lost") params.status = "lost";
    else if (filterType === "found") params.status = "found";
    else if (filterType === "completed") params.is_completed = 1;
    else if (filterType === "process") params.is_completed = 0;
    else if (filterType === "mine") params.is_me = 1;

    Promise.resolve(dispatch(asyncSetLostFounds(params))).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [filterType, dispatch]);

  useEffect(() => {
    let isMounted = true;
    if (isLostFoundDeleted) {
      dispatch(setIsLostFoundDeleteActionCreator(false));
      setLoading(true);
      Promise.resolve(dispatch(asyncSetLostFounds())).finally(() => {
        if (isMounted) setLoading(false);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [isLostFoundDeleted, dispatch]);

  if (!profile) return null;

  async function handleDelete(id) {
    const result = await showConfirmDialog(
      "Apakah Anda yakin ingin menghapus laporan ini?"
    );
    if (result.isConfirmed) {
      dispatch(asyncSetIsLostFoundDelete(id));
    }
  }

  const itemsList = Array.isArray(lostFounds) ? lostFounds : [];
  const filteredList = itemsList.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = item.title ? item.title.toLowerCase() : "";
    const description = item.description ? item.description.toLowerCase() : "";
    return title.includes(q) || description.includes(q);
  });

  const totalCount = itemsList.length;
  const lostCount = itemsList.filter((i) => i.status === "lost").length;
  const foundCount = itemsList.filter((i) => i.status === "found").length;
  const completedCount = itemsList.filter((i) => i.is_completed).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Lost &amp; Found Delcom
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pusat informasi barang hilang dan barang temuan di lingkungan kampus IT Del.
          </p>
        </div>
        <button
          type="button"
          data-testid="open-add-modal-btn"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all hover:scale-102"
        >
          <IconPlus size={18} stroke={2.5} />
          <span>Buat Laporan Baru</span>
        </button>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
            {totalCount}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Laporan
            </p>
            <p className="text-xl font-bold text-slate-900">{totalCount}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-lg">
            {lostCount}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Barang Hilang
            </p>
            <p className="text-xl font-bold text-rose-700">{lostCount}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-lg">
            {foundCount}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Barang Temuan
            </p>
            <p className="text-xl font-bold text-teal-700">{foundCount}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
            {completedCount}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Selesai Dikembalikan
            </p>
            <p className="text-xl font-bold text-emerald-700">{completedCount}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "all", label: "Semua" },
            { id: "lost", label: "Barang Hilang" },
            { id: "found", label: "Barang Temuan" },
            { id: "completed", label: "Selesai" },
            { id: "process", label: "Dalam Proses" },
            { id: "mine", label: "Laporan Saya" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              data-testid={`filter-${tab.id}-btn`}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === tab.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <IconSearch
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            data-testid="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul atau lokasi..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
          />
        </div>
      </div>

      {/* Reports Grid */}
      {filteredList.length === 0 ? (
        <div
          data-testid="empty-state"
          className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-slate-100 shadow-xs text-center px-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mb-4">
            <IconAlertCircle size={32} stroke={1.5} />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Tidak ada laporan yang ditemukan
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Belum ada barang yang dilaporkan pada kategori ini atau kata kunci tidak cocok.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((item) => {
            const isOwner =
              item.user_id === profile.id ||
              (item.author && item.author.name === profile.name);

            return (
              <div
                key={item.id}
                data-testid={`lost-found-item-${item.id}`}
                className="group flex flex-col justify-between rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md hover:border-slate-200 transition-all overflow-hidden"
              >
                <div>
                  {/* Card Cover */}
                  <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                    {item.cover ? (
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-gradient-to-br from-slate-50 to-slate-100">
                        <IconPhoto size={36} stroke={1.5} />
                        <span className="text-[11px] mt-1 text-slate-400">
                          Tidak ada foto cover
                        </span>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-xs ${
                          item.status === "lost"
                            ? "bg-rose-500 text-white"
                            : "bg-teal-500 text-white"
                        }`}
                      >
                        {item.status === "lost" ? "Hilang" : "Ditemukan"}
                      </span>

                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-xs ${
                          item.is_completed
                            ? "bg-emerald-600 text-white"
                            : "bg-amber-500 text-white"
                        }`}
                      >
                        {item.is_completed ? "Selesai" : "Dalam Proses"}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <IconUser size={14} />
                        <span className="font-medium text-slate-600 truncate max-w-[120px]">
                          {item.author?.name || "Anonim"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <IconClock size={14} />
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 pb-5 pt-0 flex items-center justify-between gap-2">
                  <Link
                    to={`/lost-founds/${item.id}`}
                    data-testid={`view-detail-btn-${item.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-xs font-semibold transition-colors"
                  >
                    <IconEye size={15} />
                    <span>Detail</span>
                  </Link>

                  {isOwner && (
                    <>
                      <button
                        type="button"
                        data-testid={`edit-item-btn-${item.id}`}
                        onClick={() => {
                          setSelectedId(item.id);
                          setShowChangeModal(true);
                        }}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-600 transition-colors"
                        title="Ubah Data"
                      >
                        <IconPencil size={15} />
                      </button>
                      <button
                        type="button"
                        data-testid={`delete-item-btn-${item.id}`}
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
                        title="Hapus Laporan"
                      >
                        <IconTrash size={15} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <AddModal show={showAddModal} onClose={() => setShowAddModal(false)} />
      <ChangeModal
        show={showChangeModal}
        onClose={() => setShowChangeModal(false)}
        lostFoundId={selectedId}
      />
    </div>
  );
}

export default HomePage;
