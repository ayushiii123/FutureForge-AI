import api from "./api";

export const getDashboardStats = async () => {
  const res = await api.get("/dashboard/stats");
  return res.data.stats;
};

export const getSalesReport = async (from, to) => {
  const res = await api.get("/dashboard/sales-report", {
    params: { from, to },
  });

  return res.data.report;
};