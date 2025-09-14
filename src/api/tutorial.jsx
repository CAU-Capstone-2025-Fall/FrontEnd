import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; //백엔드 서버 주소 - 현재 로컬호스트 8000 포트
//추후 AWS 배포시 해당 주소로 변경
//해당 주소는 .env 파일로 관리할 예정
//현재는 각자 컴퓨터에서 서버를 실행하여 테스트하므로 localhost로 설정, 포트는 서버가 자동으로 할당하는 포트로 설정, 8000포트가 아닐 수 있음

export const giveMeAnswer = async () => {
  //백엔드 서버로 GET 요청을 보내는 함수 튜토리얼 API
  try {
    const response = await axios.get(`${API_BASE_URL}/`); //비동기 axios GET 요청
    return response.data; //응답 데이터 반환
  } catch (error) {
    console.error(error);
    return null;
  }
};
