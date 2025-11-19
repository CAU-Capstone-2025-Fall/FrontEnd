// src/api/survey.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/userinfo',
  withCredentials: true,
});

// 설문 저장: POST /api/userinfo/survey
export async function saveSurvey(userId, answers) {
  const payload = { userId, ...answers };
  const { data } = await api.post('/survey', payload);
  return data;
}

// 설문 조회: GET /api/userinfo/survey/:userId
export async function getSurvey(userId) {
  const { data } = await api.get(`/survey/${userId}`);
  return data;
}
