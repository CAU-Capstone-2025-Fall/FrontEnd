import React, { useState } from 'react';
import '../css/SideService.css';

const bmiRanges = {
  dog: {
    small: [
      { label: '저체중', min: 0, max: 4 },
      { label: '정상', min: 4, max: 7 },
      { label: '과체중', min: 7, max: 9 },
      { label: '비만', min: 9, max: 100 },
    ],
    medium: [
      { label: '저체중', min: 0, max: 8 },
      { label: '정상', min: 8, max: 15 },
      { label: '과체중', min: 15, max: 20 },
      { label: '비만', min: 20, max: 100 },
    ],
    large: [
      { label: '저체중', min: 0, max: 18 },
      { label: '정상', min: 18, max: 28 },
      { label: '과체중', min: 28, max: 34 },
      { label: '비만', min: 34, max: 100 },
    ],
  },
  cat: [
    { label: '저체중', min: 0, max: 3 },
    { label: '정상', min: 3, max: 5.5 },
    { label: '과체중', min: 5.5, max: 7 },
    { label: '비만', min: 7, max: 100 },
  ],
  rabbit: [
    { label: '저체중', min: 0, max: 2 },
    { label: '정상', min: 2, max: 3.5 },
    { label: '과체중', min: 3.5, max: 4.2 },
    { label: '비만', min: 4.2, max: 100 },
  ],
  parrot: [
    { label: '저체중', min: 0, max: 0.06 },
    { label: '정상', min: 0.06, max: 0.1 },
    { label: '과체중', min: 0.1, max: 0.12 },
    { label: '비만', min: 0.12, max: 100 },
  ],
};

const bmiAdvice = {
  dog: {
    저체중: {
      advice: '체중이 부족한 상태입니다.',
      food: '고단백 기호성 좋은 사료, 연어·닭가슴살 토핑, 자주 소량 급여.',
      exercise: '무리한 운동 금지, 짧고 가벼운 산책 중심.',
    },
    정상: {
      advice: '건강한 체중입니다!',
      food: '균형 잡힌 사료 유지, 간식은 하루 권장량 내에서.',
      exercise: '하루 30–60분 산책, 주 2–3회 가벼운 놀이.',
    },
    과체중: {
      advice: '조금 체중 감량이 필요합니다.',
      food: '저지방 사료로 교체, 간식 줄이기, 양 조절.',
      exercise: '산책 시간 20% 증가, 계단 오르기 등 저강도 운동.',
    },
    비만: {
      advice: '비만 단계입니다. 체중 조절 필수!',
      food: '다이어트용 처방식 추천, 간식 금지. 식사량 정확히 계량.',
      exercise: '천천히 걷기부터 시작해 점진적으로 증가.',
    },
  },
  cat: {
    저체중: {
      advice: '체중이 많이 부족한 상태입니다.',
      food: '기호성 높은 습식 사료, 닭고기·참치 토핑 소량씩.',
      exercise: '무리한 장난 금지, 편안한 환경 조성.',
    },
    정상: {
      advice: '건강한 체중입니다!',
      food: '습식 + 건식 병행 급여, 간식 조절.',
      exercise: '레이저 포인터 놀이 10~15분, 캣타워 활동.',
    },
    과체중: {
      advice: '다이어트가 필요합니다.',
      food: '다이어트 사료, 급여량 정확히 측정.',
      exercise: '부드러운 장난감 놀이 15~20분 매일.',
    },
    비만: {
      advice: '비만 단계입니다. 건강 위험 증가!',
      food: '수의사 상담 후 처방식 추천. 간식 금지.',
      exercise: '천천히 움직이는 인터랙티브 장난감 권장.',
    },
  },
  rabbit: {
    저체중: {
      advice: '영양 부족 상태입니다.',
      food: '티모시 대신 알팔파 급여 비중 증가.',
      exercise: '스트레스 없는 조용한 환경에서 짧은 운동.',
    },
    정상: {
      advice: '건강한 체중입니다!',
      food: '티모시 위주 + 소량 펠렛 유지.',
      exercise: '실내 자유 배변 시간 2~3시간.',
    },
    과체중: {
      advice: '체중 조절이 필요합니다.',
      food: '펠렛 감량, 간식 최소화.',
      exercise: '방에서 3~4시간 자유 운동.',
    },
    비만: {
      advice: '비만입니다. 관절·소화 위험 증가!',
      food: '티모시 90% 이상, 펠렛 최소화.',
      exercise: '바닥 미끄럽지 않은 환경에서 천천히 운동.',
    },
  },
  parrot: {
    저체중: {
      advice: '체중이 부족하여 면역 저하 위험이 있습니다.',
      food: '고지방 씨앗류 소량, 고단백 펠렛 추가.',
      exercise: '스트레스 최소화, 휴식이 우선.',
    },
    정상: {
      advice: '건강한 체중입니다!',
      food: '펠렛 70%, 야채·과일 30% 유지.',
      exercise: '날개 스트레칭, 자연스러운 비행 훈련.',
    },
    과체중: {
      advice: '체중 관리가 필요합니다.',
      food: '씨앗류 줄이기, 펠렛·야채 비중 증가.',
      exercise: '짧은 비행 운동, 횃대 사이 이동 훈련.',
    },
    비만: {
      advice: '비만 단계입니다. 간질환 위험 증가!',
      food: '펠렛 중심 식단, 기름진 씨앗 금지.',
      exercise: '1–2m 비행 반복, 횃대 오르기 운동.',
    },
  },
};

export default function AnimalBmiCalculator() {
  const [animal, setAnimal] = useState('dog');
  const [dogSize, setDogSize] = useState('small');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState(null);

  const getResult = (w) => {
    let range;
    if (animal === 'dog') {
      range = bmiRanges.dog[dogSize];
    } else if (animal === 'cat') {
      range = bmiRanges.cat;
    } else if (animal === 'rabbit') {
      range = bmiRanges.rabbit;
    } else if (animal === 'parrot') {
      range = bmiRanges.parrot;
    }
    for (let i = 0; i < range.length; i++) {
      const { label, min, max } = range[i];
      if (i < range.length - 1) {
        if (w >= min && w < max) return label;
      } else {
        if (w >= min) return label;
      }
    }
    return '범위 외';
  };

  const handleCalculate = () => {
    const w = weight;
    if (isNaN(w) || w <= 0) {
      setResult('올바른 체중을 입력해 주세요.');
      return;
    }
    const status = getResult(w);
    setResult({
      status,
      weight: w,
      label:
        animal === 'dog'
          ? dogSize === 'small'
            ? '소형견'
            : dogSize === 'medium'
              ? '중형견'
              : '대형견'
          : animal === 'cat'
            ? '고양이'
            : animal === 'rabbit'
              ? '토끼'
              : '앵무새',

      advice: bmiAdvice[animal][status].advice,
      food: bmiAdvice[animal][status].food,
      exercise: bmiAdvice[animal][status].exercise,
    });
  };

  return (
    <div className="sideservice-section">
      <h3>⚖️ 동물 비만도 계산기</h3>
      <select value={animal} onChange={(e) => setAnimal(e.target.value)}>
        <option value="dog">강아지</option>
        <option value="cat">고양이</option>
        <option value="rabbit">토끼</option>
        <option value="parrot">앵무새</option>
      </select>
      {animal === 'dog' && (
        <select
          value={dogSize}
          onChange={(e) => setDogSize(e.target.value)}
          style={{ marginLeft: 10 }}
        >
          <option value="small">소형견</option>
          <option value="medium">중형견</option>
          <option value="large">대형견</option>
        </select>
      )}
      <input
        type="number"
        min="0"
        placeholder="실제 체중(kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        style={{ marginLeft: 10 }}
      />
      <button className="btn btn--light" onClick={handleCalculate} style={{ marginLeft: 10 }}>
        계산
      </button>
      {result && (
        <div className="result-wrapper">
          <div className="result-card title-card">
            <h4>⚖️ 비만도 분석 결과</h4>
            <p>
              {result.label} 기준
              <br />
              체중 {result.weight}kg → <b>{result.status}</b> 입니다.
            </p>
          </div>

          <div className="result-card">
            <h4>📌 현재 상태</h4>
            <p>{result.advice}</p>
          </div>

          <div className="result-card">
            <h4>🍽️ 추천 음식/식단</h4>
            <p>{result.food}</p>
          </div>

          <div className="result-card">
            <h4>🏃 운동/활동 가이드</h4>
            <p>{result.exercise}</p>
          </div>
        </div>
      )}
    </div>
  );
}
