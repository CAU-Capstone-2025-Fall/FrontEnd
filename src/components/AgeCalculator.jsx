import React, { useState } from 'react';
import '../css/SideService.css';

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
    if (animal === 'dog') {
      const m = dogAgeMap[dogSize];
      if (n === 1) humanAge = m.first;
      else if (n === 2) humanAge = m.second;
      else if (n > 2) humanAge = m.second + (n - 2) * m.after;
      setResult(
        `${dogSize === 'small' ? '소형견' : dogSize === 'medium' ? '중형견' : '대형견'} ${n}살은 사람 나이로 약 ${humanAge}세에 해당합니다.`
      );
    } else if (animal === 'cat') {
      if (n === 1) humanAge = catAgeMap.first;
      else if (n === 2) humanAge = catAgeMap.second;
      else if (n > 2) humanAge = catAgeMap.second + (n - 2) * catAgeMap.after;
      setResult(`고양이 ${n}살은 사람 나이로 약 ${humanAge}세에 해당합니다.`);
    } else if (animal === 'rabbit') {
      if (n === 1) humanAge = rabbitAgeMap.first;
      else if (n === 2) humanAge = rabbitAgeMap.second;
      else if (n > 2) humanAge = rabbitAgeMap.second + (n - 2) * rabbitAgeMap.after;
      setResult(`토끼 ${n}살은 사람 나이로 약 ${humanAge}세에 해당합니다.`);
    } else if (animal === 'parrot') {
      if (n === 1) humanAge = parrotAgeMap.first;
      else if (n === 2) humanAge = parrotAgeMap.second;
      else if (n > 2) humanAge = parrotAgeMap.second + (n - 2) * parrotAgeMap.after;
      setResult(`앵무새 ${n}살은 사람 나이로 약 ${humanAge}세에 해당합니다.`);
    } else if (animal === 'turtle') {
      if (n === 1) humanAge = turtleAgeMap.first;
      else if (n === 2) humanAge = turtleAgeMap.second;
      else if (n > 2) humanAge = turtleAgeMap.second + (n - 2) * turtleAgeMap.after;
      setResult(`거북이 ${n}살은 사람 나이로 약 ${humanAge}세에 해당합니다.`);
    }
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
      {result && <p>{result}</p>}
    </div>
  );
}
