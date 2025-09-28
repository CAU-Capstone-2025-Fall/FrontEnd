import axios from 'axios';

// axios 인스턴스 생성 (프록시 `/api` 통해 FastAPI 서버와 연결)
const api = axios.create({
  baseURL: '/api/chat',
  withCredentials: true,
});

// 요청 body 타입
export interface ChatRequest {
  message: string;
}

// 응답 타입
export interface ChatResponse {
  answer: string;
}

// 챗봇 대화 요청 함수
export const requestChatBot = async (message: string): Promise<ChatResponse> => {
  const res = await api.post<ChatResponse>('/ask', { message });
  return res.data;
};
