import React, { useState } from "react";
import axios from "axios";
import "./SurveyForm.css";

export default function SurveyForm({ user }) {
  const [answers, setAnswers] = useState({
    address: "",
    residenceType: "",
    hasPetSpace: "",
    familyCount: "",
    hasChildOrElder: "",
    dailyHomeTime: "",
    hasAllergy: "",
    allergyAnimal: "",
    activityLevel: "",
    expectations: [],
    favoriteAnimals: [],
    preferredSize: "",
    preferredPersonality: [],
    careTime: "",
    budget: "",
    specialEnvironment: "",
    additionalNote: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // 로그인 상태가 아니면 설문 이용 불가
  if (!user) {
    return <p>로그인 후 설문 이용이 가능합니다.</p>;
  }

  // 체크박스/다중선택 핸들링
  const handleMultiSelect = (e, key) => {
    const value = e.target.value;
    setAnswers((prev) => {
      if (e.target.checked) {
        return { ...prev, [key]: [...prev[key], value] };
      } else {
        return { ...prev, [key]: prev[key].filter((item) => item !== value) };
      }
    });
  };

  // 일반 필드 핸들링
  const handleChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  // 제출 핸들링
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      console.log("Submitting survey:", { userId: user, ...answers });
      const res = await axios.post(
        "http://localhost:8000/userinfo/survey",
        //"http://3.38.48.153:8000/userinfo/survey",
        {
          userId: user,
          ...answers,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setSubmitted(true);
      } else {
        setError(res.data.msg || "설문 저장 실패");
      }
    } catch (err) {
      setError("서버 오류: " + (err?.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return <p>설문이 성공적으로 저장되었습니다! 감사합니다.</p>;
  }

  return (
    <form
      className="sideservice-section"
      onSubmit={handleSubmit}
      style={{ maxWidth: 540, margin: "0 auto" }}
    >
      <h3>반려동물 추천 설문조사</h3>
      <div>
        <label>
          0. 거주 지역(예: 서울특별시 강남구 역삼동)<br />
          <input
            type="text"
            name="address"
            value={answers.address}
            onChange={handleChange}
            placeholder="시/도, 시/군/구, 동/읍/면 순으로 입력"
            required
          />
        </label>
      </div>
      <div>
        <label>
          1. 현재 거주 형태는 무엇인가요?<br />
          <select
            name="residenceType"
            value={answers.residenceType}
            onChange={handleChange}
            required
          >
            <option value="">선택하세요</option>
            <option value="아파트">아파트</option>
            <option value="단독주택">단독주택</option>
            <option value="오피스텔/원룸">오피스텔/원룸</option>
            <option value="기타">기타</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          2. 반려동물을 위한 별도의 공간(방/마당/테라스 등)이 있나요?<br />
          <select
            name="hasPetSpace"
            value={answers.hasPetSpace}
            onChange={handleChange}
            required
          >
            <option value="">선택하세요</option>
            <option value="있음">있음</option>
            <option value="없음">없음</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          3. 함께 사는 가족/동거인 수는 몇 명인가요?<br />
          <input
            name="familyCount"
            value={answers.familyCount}
            onChange={handleChange}
            type="number"
            min="1"
            max="20"
            required
            style={{ width: "80px" }}
          />
        </label>
      </div>
      <div>
        <label>
          4. 어린이나 노인이 함께 거주하나요?<br />
          <select
            name="hasChildOrElder"
            value={answers.hasChildOrElder}
            onChange={handleChange}
            required
          >
            <option value="">선택하세요</option>
            <option value="있음">있음</option>
            <option value="없음">없음</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          5. 평일 하루 중 집에 머무는 시간은 몇 시간인가요?<br />
          <select
            name="dailyHomeTime"
            value={answers.dailyHomeTime}
            onChange={handleChange}
            required
          >
            <option value="">선택하세요</option>
            <option value="0~4시간">0~4시간</option>
            <option value="4~8시간">4~8시간</option>
            <option value="8~12시간">8~12시간</option>
            <option value="12시간 이상">12시간 이상</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          6. 본인 혹은 가족 중 동물 알레르기가 있나요?<br />
          <select
            name="hasAllergy"
            value={answers.hasAllergy}
            onChange={handleChange}
            required
          >
            <option value="">선택하세요</option>
            <option value="없음">없음</option>
            <option value="있음">있음</option>
          </select>
        </label>
        {answers.hasAllergy === "있음" && (
          <input
            name="allergyAnimal"
            value={answers.allergyAnimal}
            onChange={handleChange}
            placeholder="어떤 동물에 알레르기가 있나요?"
            style={{ marginTop: 6 }}
          />
        )}
      </div>
      <div>
        <label>
          7. 평소 야외 활동(산책, 운동 등)을 얼마나 즐기시나요?<br />
          <select
            name="activityLevel"
            value={answers.activityLevel}
            onChange={handleChange}
            required
          >
            <option value="">선택하세요</option>
            <option value="매우 활발함">매우 활발함</option>
            <option value="보통">보통</option>
            <option value="주로 실내 생활">주로 실내 생활</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          8. 반려동물에게 바라는 점을 모두 선택해 주세요.<br />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
            {[
              "교감(애정 표현, 함께 놀기)",
              "독립성(혼자 잘 지냄)",
              "관리의 용이함(손쉬운 관리)",
              "활동적/에너지 넘침",
              "조용함/차분함",
              "기타",
            ].map((label) => (
              <label key={label} style={{ marginRight: "10px" }}>
                <input
                  type="checkbox"
                  value={label}
                  checked={answers.expectations.includes(label)}
                  onChange={(e) => handleMultiSelect(e, "expectations")}
                />
                {label}
              </label>
            ))}
          </div>
        </label>
      </div>
      <div>
        <label>
          9. 선호하는 동물 종류(복수 선택 가능)<br />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
            {[
              "강아지",
              "고양이",
              "소형동물(햄스터, 토끼 등)",
              "파충류",
              "조류",
              "기타",
            ].map((label) => (
              <label key={label} style={{ marginRight: "10px" }}>
                <input
                  type="checkbox"
                  value={label}
                  checked={answers.favoriteAnimals.includes(label)}
                  onChange={(e) => handleMultiSelect(e, "favoriteAnimals")}
                />
                {label}
              </label>
            ))}
          </div>
        </label>
      </div>
      <div>
        <label>
          10. 선호하는 반려동물의 크기<br />
          <select
            name="preferredSize"
            value={answers.preferredSize}
            onChange={handleChange}
            required
          >
            <option value="">선택하세요</option>
            <option value="소형">소형</option>
            <option value="중형">중형</option>
            <option value="대형">대형</option>
            <option value="상관없음">상관없음</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          11. 선호하는 반려동물의 성격<br />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
            {["활발함", "차분함", "독립적", "애교 많음", "상관없음"].map((label) => (
              <label key={label} style={{ marginRight: "10px" }}>
                <input
                  type="checkbox"
                  value={label}
                  checked={answers.preferredPersonality.includes(label)}
                  onChange={(e) => handleMultiSelect(e, "preferredPersonality")}
                />
                {label}
              </label>
            ))}
          </div>
        </label>
      </div>
      <div>
        <label>
          12. 하루 평균 반려동물 케어에 투자할 수 있는 시간<br />
          <select
            name="careTime"
            value={answers.careTime}
            onChange={handleChange}
            required
          >
            <option value="">선택하세요</option>
            <option value="10분 이하">10분 이하</option>
            <option value="30분">30분</option>
            <option value="1시간">1시간</option>
            <option value="2시간 이상">2시간 이상</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          13. 월 평균 반려동물 관련 지출 의향(사료, 용품, 병원 등)<br />
          <select
            name="budget"
            value={answers.budget}
            onChange={handleChange}
            required
          >
            <option value="">선택하세요</option>
            <option value="3만 원 이하">3만 원 이하</option>
            <option value="5만 원">5만 원</option>
            <option value="10만 원">10만 원</option>
            <option value="20만 원 이상">20만 원 이상</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          14. 집에 식물, 다른 동물, 특별한 환경(예: 잦은 여행, 장거리 출퇴근 등)이 있나요?<br />
          <input
            name="specialEnvironment"
            value={answers.specialEnvironment}
            onChange={handleChange}
            placeholder="있으면 간단히 적어주세요"
          />
        </label>
      </div>
      <div>
        <label>
          15. 반려동물 입양에 있어 궁금한 점이나 특별히 원하는 점을 자유롭게 적어주세요<br />
          <textarea
            name="additionalNote"
            value={answers.additionalNote}
            onChange={handleChange}
            rows={2}
            style={{ width: "100%" }}
            placeholder="간단히 적어 주세요"
          />
        </label>
      </div>
      <button
        className="btn btn--light"
        type="submit"
        disabled={loading}
        style={{ marginTop: 16 }}
      >
        {loading ? "저장 중..." : "제출"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}