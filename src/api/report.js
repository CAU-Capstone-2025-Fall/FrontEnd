// src/api/report.js
import axios from 'axios';

// ----------------------
// 1) SAVE REPORT (POST)
//    baseURL: /api/report
// ----------------------
const apiSave = axios.create({
  baseURL: '/api/report',
  withCredentials: true,
});

export const saveReport = async (userId, data) => {
  const res = await apiSave.post(`/${encodeURIComponent(userId)}`, data);
  return res.data;
};

// ----------------------
// 2) GET REPORT (GET)
//    baseURL: /report
// ----------------------
const apiGet = axios.create({
  baseURL: '/report',
  withCredentials: true,
});

export const getReport = async (userId) => {
  const res = await apiGet.get(`/${encodeURIComponent(userId)}`);
  console.log(res);
  return res.data;
};
