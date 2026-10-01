import apiHelper from "../../../helpers/apiHelper";

const lostFoundApi = (() => {
  const BASE_URL = `${DELCOM_BASEURL}/lost-founds`;

  function _url(path) {
    return BASE_URL + path;
  }

  async function postLostFound(title, description, status) {
    const response = await apiHelper.fetchData(_url("/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        status,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menambahkan data lost & found");
    }

    return result.data;
  }

  async function postLostFoundCover(id, cover) {
    const formData = new FormData();
    formData.append("cover", cover, cover.name || "cover.jpg");
    const response = await apiHelper.fetchData(_url(`/${id}/cover`), {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengubah cover");
    }

    return result.message;
  }

  async function putLostFound(id, title, description, status, is_completed) {
    const response = await apiHelper.fetchData(_url(`/${id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        status,
        is_completed: is_completed ? 1 : 0,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengubah data lost & found");
    }

    return result.message;
  }

  async function getLostFounds({ status = "", is_completed = "", is_me = "", search = "" } = {}) {
    const queryParams = [];
    if (status) queryParams.push(`status=${status}`);
    if (is_completed !== "" && is_completed !== null && is_completed !== undefined) {
      queryParams.push(`is_completed=${is_completed}`);
    }
    if (is_me) queryParams.push(`is_me=${is_me}`);
    if (search) queryParams.push(`search=${encodeURIComponent(search)}`);

    const queryStr = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
    const response = await apiHelper.fetchData(_url(`/${queryStr}`), {
      method: "GET",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil data lost & found");
    }

    return result.data?.lost_founds || [];
  }

  async function getLostFoundById(id) {
    const response = await apiHelper.fetchData(_url(`/${id}`), {
      method: "GET",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil detail lost & found");
    }

    return result.data?.lost_found;
  }

  async function deleteLostFound(id) {
    const response = await apiHelper.fetchData(_url(`/${id}`), {
      method: "DELETE",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menghapus data lost & found");
    }

    return result.message;
  }

  async function getStatsDaily() {
    const response = await apiHelper.fetchData(_url("/stats/daily"), {
      method: "GET",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil statistik harian");
    }

    return result.data || {};
  }

  async function getStatsMonthly() {
    const response = await apiHelper.fetchData(_url("/stats/monthly"), {
      method: "GET",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil statistik bulanan");
    }

    return result.data || {};
  }

  return {
    postLostFound,
    postLostFoundCover,
    putLostFound,
    getLostFounds,
    getLostFoundById,
    deleteLostFound,
    getStatsDaily,
    getStatsMonthly,
  };
})();

export default lostFoundApi;
