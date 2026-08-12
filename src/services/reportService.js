export async function getReportsAdmin(axiosSecure) {
  const res = await axiosSecure.get("/reports");
  return res.data;
}

export async function resolveReport(axiosSecure, id) {
  const res = await axiosSecure.patch(`/reports/${id}/resolve`);
  return res.data;
}