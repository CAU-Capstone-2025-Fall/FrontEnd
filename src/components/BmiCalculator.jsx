import React, { useState } from "react";
import "./SideService.css";

const bmiRanges = {
  dog: {
    small: [
      { label: "저체중", min: 0, max: 4 },
      { label: "정상", min: 4, max: 7 },
      { label: "과체중", min: 7, max: 9 },
      { label: "비만", min: 9, max: 100 },
    ],
    medium: [
      { label: "저체중", min: 0, max: 8 },
      { label: "정상", min: 8, max: 15 },
      { label: "과체중", min: 15, max: 20 },
      { label: "비만", min: 20, max: 100 },
    ],
    large: [
      { label: "저체중", min: 0, max: 18 },
      { label: "정상", min: 18, max: 28 },
      { label: "과체중", min: 28, max: 34 },
      { label: "비만", min: 34, max: 100 },
    ],
  },
  cat: [
    { label: "저체중", min: 0, max: 3 },
    { label: "정상", min: 3, max: 5.5 },
    { label: "과체중", min: 5.5, max: 7 },
    { label: "비만", min: 7, max: 100 },
  ],
};

export default function AnimalBmiCalculator() {
  const [animal, setAnimal] = useState("dog");
  const [dogSize, setDogSize] = useState("small");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState(null);

  const getResult = (w) => {
    let range;
    if (animal === "dog") {
      range = bmiRanges.dog[dogSize];
    } else {
      range = bmiRanges.cat;
    }
    for (let i = 0; i < range.length; i++) {
      const { label, min, max } = range[i];
      if (i < range.length - 1) {
        if (w >= min && w < max) return label;
      } else {
        if (w >= min) return label;
      }
    }
    return "범위 외";
  };

  const handleCalculate = () => {
    const w = weight;
    if (isNaN(w) || w <= 0) {
      setResult("올바른 체중을 입력해 주세요.");
      return;
    }
    const status = getResult(w);
    setResult(
      `입력한 체중: ${w}kg → 결과: ${status} (${animal === "dog" ? (dogSize === "small" ? "소형견" : dogSize === "medium" ? "중형견" : "대형견") : "고양이"})`
    );
  };

  return (
    <div className="sideservice-section">
      <h3>⚖️ 비만도 계산기</h3>
      <select value={animal} onChange={e => setAnimal(e.target.value)}>
        <option value="dog">강아지</option>
        <option value="cat">고양이</option>
      </select>
      {animal === "dog" && (
        <select value={dogSize} onChange={e => setDogSize(e.target.value)} style={{ marginLeft: 10 }}>
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
        onChange={e => setWeight(e.target.value)}
        style={{ marginLeft: 10 }}
      />
      <button className="btn btn--light" onClick={handleCalculate} style={{ marginLeft: 10 }}>
        계산
      </button>
      {result && <p>{result}</p>}
    </div>
  );
}