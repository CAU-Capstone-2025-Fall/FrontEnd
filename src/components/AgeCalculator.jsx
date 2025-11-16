import React, { useState } from 'react';
import '../css/SideService.css';

const healthGuideMap = {
  dog: [
    {
      min: 0,
      max: 12,
      stage: '성장기',
      features: '감각이 발달하고 에너지가 많은 시기입니다.',
      checkup: '기본 예방접종, 심장사상충·내부 기생충 예방 필수.',
    },
    {
      min: 13,
      max: 29,
      stage: '청년기',
      features: '활동성이 높고 신체 능력이 가장 좋은 시기입니다.',
      checkup: '스케일링 첫 점검, 슬개골 탈구·피부 알러지 점검.',
    },
    {
      min: 30,
      max: 49,
      stage: '중년기',
      features: '활동량이 줄고 체중 변화가 나타날 수 있습니다.',
      checkup: '혈액검사(신장·간), 관절 검사, 구강검진 필수.',
    },
    {
      min: 50,
      max: 69,
      stage: '노년기',
      features: '노화가 본격적으로 나타나는 시기입니다.',
      checkup: '6개월마다 종합검진, 심장초음파, 복부초음파 권장.',
    },
    {
      min: 70,
      max: 200,
      stage: '고령',
      features: '만성질환 위험이 급증하는 시기입니다.',
      checkup: '3~6개월마다 정밀검진, 관절·심장·신장 집중 모니터링.',
    },
  ],

  cat: [
    {
      min: 0,
      max: 12,
      stage: '성장기',
      features: '활동량이 많고 호기심이 왕성합니다.',
      checkup: '기본 접종·중성화 여부 점검, 장내 기생충 예방.',
    },
    {
      min: 13,
      max: 29,
      stage: '성묘기',
      features: '몸 상태가 안정적이고 활동성이 일정합니다.',
      checkup: '비만 관리, 치석 관리, 신장 수치 정기 점검.',
    },
    {
      min: 30,
      max: 49,
      stage: '중년기',
      features: '신장·요로계 문제 위험이 증가합니다.',
      checkup: 'CBC·혈액검사, 요검사, 스케일링, 심장 검사.',
    },
    {
      min: 50,
      max: 69,
      stage: '노묘기',
      features: '관절염·신장병·갑상선 질환이 증가하는 시기입니다.',
      checkup: '6개월마다 고령묘 종합검진, 혈압 측정 필수.',
    },
    {
      min: 70,
      max: 200,
      stage: '고령기',
      features: '신체 기능 저하가 커지고 섭식량 감소가 나타납니다.',
      checkup: '초음파·X-ray·혈액검사 포함 종합 정밀검진.',
    },
  ],

  rabbit: [
    {
      min: 0,
      max: 12,
      stage: '성장기',
      features: '활동량이 많고 사회성이 활발합니다.',
      checkup: '기본 접종, 구강(앞니) 성장 확인 필수.',
    },
    {
      min: 13,
      max: 29,
      stage: '성숙기',
      features: '건강이 안정적이며 식습관 패턴이 잡힙니다.',
      checkup: '치아 과성장 체크, 소장염·장내 가스 예방.',
    },
    {
      min: 30,
      max: 49,
      stage: '중년기',
      features: '소화 문제·비만 위험 증가.',
      checkup: '치아 X-ray, 장내 미생물 검사.',
    },
    {
      min: 50,
      max: 69,
      stage: '노령기',
      features: '근력·체중 감소, 구강 문제 증가.',
      checkup: '6개월마다 구강검사(앞니·어금니), 혈액검사 권장.',
    },
    {
      min: 70,
      max: 200,
      stage: '고령',
      features: '전반적 노화 진행, 먹이 섭취량 감소.',
      checkup: '정밀검진, 장 기능 검사, 관절 관리.',
    },
  ],

  parrot: [
    {
      min: 0,
      max: 12,
      stage: '유조/성장기',
      features: '지능 발달과 사회성이 성장하는 시기입니다.',
      checkup: '기생충 검사, 깃털 상태 점검.',
    },
    {
      min: 13,
      max: 29,
      stage: '성조기',
      features: '교감이 활발하며 활동성이 높습니다.',
      checkup: '영양상태, 부리·발톱 상태 점검.',
    },
    {
      min: 30,
      max: 49,
      stage: '중년기',
      features: '비만·간질환 위험 증가.',
      checkup: '간 수치 검사, 식단 조절.',
    },
    {
      min: 50,
      max: 69,
      stage: '노령기',
      features: '깃털 갈라짐·면역력 저하.',
      checkup: '정기 혈액검사, 곰팡이 감염 검사.',
    },
    {
      min: 70,
      max: 200,
      stage: '고령',
      features: '활동량 급감, 깃털 회복력 저하.',
      checkup: '종합검진(혈액, X-ray), 환경 온도 조절 필요.',
    },
  ],

  turtle: [
    {
      min: 0,
      max: 20,
      stage: '성장기',
      features: '껍질 성장과 식욕이 왕성한 시기입니다.',
      checkup: '칼슘·UVB 부족 여부 반드시 체크.',
    },
    {
      min: 21,
      max: 40,
      stage: '성숙기',
      features: '건강이 안정적이며 활동성이 일정합니다.',
      checkup: '대사성골질환(MBD) 검사, 수질 관리.',
    },
    {
      min: 41,
      max: 70,
      stage: '중년기',
      features: '소화 문제와 껍질 질환 위험 증가.',
      checkup: '대변 검사, 수온·수질 모니터링 강화.',
    },
    {
      min: 71,
      max: 120,
      stage: '노령기',
      features: '먹이 섭취량 감소, 활동성 저하.',
      checkup: 'X-ray로 폐·껍질 상태 점검, 간 기능 검사.',
    },
  ],
};

const dogAgeMap = {
  small: { first: 15, second: 24, after: 4 },
  medium: { first: 14, second: 22, after: 5 },
  large: { first: 12, second: 20, after: 6 },
};
const catAgeMap = { first: 15, second: 24, after: 4 };
const rabbitAgeMap = { first: 9, second: 18, after: 9 };
const parrotAgeMap = { first: 7, second: 15, after: 7 };
const turtleAgeMap = { first: 10, second: 20, after: 4 };

export default function AgeCalculator() {
  const [animal, setAnimal] = useState('dog');
  const [age, setAge] = useState('');
  const [dogSize, setDogSize] = useState('small');
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    let humanAge = 0;
    const n = Number(age);

    let baseText = '';

    if (animal === 'dog') {
      const m = dogAgeMap[dogSize];
      if (n === 1) humanAge = m.first;
      else if (n === 2) humanAge = m.second;
      else if (n > 2) humanAge = m.second + (n - 2) * m.after;

      const sizeLabel = dogSize === 'small' ? '소형견' : dogSize === 'medium' ? '중형견' : '대형견';

      baseText = `${sizeLabel} ${n}살은 사람 나이로 약 ${humanAge}세에 해당합니다.`;
    } else {
      const map = {
        cat: catAgeMap,
        rabbit: rabbitAgeMap,
        parrot: parrotAgeMap,
        turtle: turtleAgeMap,
      }[animal];

      if (n === 1) humanAge = map.first;
      else if (n === 2) humanAge = map.second;
      else if (n > 2) humanAge = map.second + (n - 2) * map.after;

      const label = {
        cat: '고양이',
        rabbit: '토끼',
        parrot: '앵무새',
        turtle: '거북이',
      }[animal];

      baseText = `${label} ${n}살은 사람 나이로 약 ${humanAge}세에 해당합니다.`;
    }

    // 건강 가이드 매칭
    const guide = healthGuideMap[animal].find((g) => humanAge >= g.min && humanAge <= g.max);

    setResult({
      baseText,
      stage: guide.stage,
      features: guide.features,
      checkup: guide.checkup,
    });
  };

  return (
    <div className="sideservice-section">
      <h3>🐾 내 반려동물은 몇 살 일까?</h3>

      <select value={animal} onChange={(e) => setAnimal(e.target.value)}>
        <option value="dog">강아지</option>
        <option value="cat">고양이</option>
        <option value="rabbit">토끼</option>
        <option value="parrot">앵무새</option>
        <option value="turtle">거북이</option>
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
        min="1"
        max="30"
        placeholder="나이(살)"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        style={{ marginLeft: 10 }}
      />

      <button className="btn btn--light" onClick={handleCalculate} style={{ marginLeft: 10 }}>
        계산
      </button>

      {result && (
        <div className="result-wrapper">
          <div className="result-card title-card">
            <h4>🐾 나이 변환 결과</h4>
            <p>{result.baseText}</p>
          </div>

          <div className="result-card">
            <h4>📌 현재 단계</h4>
            <p>{result.stage}</p>
          </div>

          <div className="result-card">
            <h4>📌 특징</h4>
            <p>{result.features}</p>
          </div>

          <div className="result-card">
            <h4>🩺 추천 건강검진</h4>
            <p>{result.checkup}</p>
          </div>
        </div>
      )}
    </div>
  );
}
