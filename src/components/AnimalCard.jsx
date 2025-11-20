import React from 'react';

function displayAge(ageStr) {
  if (!ageStr) return '-';
  const has60 = /60\s*일\s*미만|60일미만/.test(ageStr);
  const m = ageStr.match(/(\d{4})/);
  if (m) {
    const birthYear = parseInt(m[1], 10);
    const y = new Date().getFullYear();
    let years = y - birthYear + 1;
    if (years <= 0) years = 1;
    return `${years}살${has60 ? '(60일미만)' : ''}`;
  }
  return ageStr.trim();
}

export default function AnimalCard({ animal, onOpen, onToggleFav, isFav, aiMode }) {
  const imgSrc = aiMode ? animal.createdImg || animal.popfile1 : animal.popfile1;
  const isAIImage = aiMode && animal.createdImg;
  return (
    <div className="card">
      <div className="card__imgWrap" onClick={() => onOpen(animal)} role="button">
        <img src={imgSrc} alt={animal.kindNm || 'animal'} />

        {isAIImage && <span className="ai-generated-tag">AI 생성 이미지</span>}
      </div>

      <button
        className={`card__heart ${isFav ? 'is-on' : ''}`}
        onClick={() => onToggleFav(animal)}
        title="찜"
      >
        ♥
      </button>

      <div className="card__body">
        <h3 className="card__title">{animal.kindNm || '-'}</h3>
        <p className="card__meta">
          <span>{displayAge(animal.age)}</span> · <span>{animal.orgNm || '-'}</span>
        </p>
        <button className="btn btn--light" onClick={() => onOpen(animal)}>
          상세보기
        </button>
      </div>
    </div>
  );
}
