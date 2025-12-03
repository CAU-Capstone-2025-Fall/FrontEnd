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

function toPercentScore(raw) {
  if (raw === null || raw === undefined || raw === '') return null;
  const n = Number(raw);
  if (Number.isNaN(n)) return null;
  // If value looks like 0..1 probability
  if (n <= 1.0) {
    return Math.round(n * 70 + 30);
  }
  // If value already in 0..100 range
  if (n <= 100) {
    return Math.round(n);
  }
  // otherwise clamp
  return Math.max(0, Math.min(100, Math.round(n)));
}

export default function AnimalCard({ animal, onOpen, onToggleFav, isFav, aiMode }) {
  const imgSrc = aiMode ? animal.createdImg || animal.popfile1 : animal.popfile1;
  const isAIImage = aiMode && animal.createdImg;
  const rec = animal.recommendation || {
    final: animal.finalScore ?? animal.final ?? animal.score ?? null,
    reasons: animal.reasons ?? [],
  };
  const finalScoreRaw = rec.final;
  const finalScore = toPercentScore(finalScoreRaw);
  const reasonObjects = Array.isArray(rec.reasons) ? rec.reasons : [];
  // normalize to plain strings for easy display
  const reasonTexts = reasonObjects
    .map((r) => {
      if (!r) return '';
      // prefer 'reason' field (we put human-short string there in backend), else fall back to 'label'
      return (r.reason || r.label || '').trim();
    })
    .filter(Boolean);

  return (
    <div className="card">
      <div className="card__imgWrap" onClick={() => onOpen(animal)} role="button">
        <img src={imgSrc} alt={animal.kindNm || 'animal'} />

        {isAIImage && <span className="ai-generated-tag">AI 생성 이미지</span>}

        {finalScore !== null && finalScore !== undefined && (
          <span
            className="card__score"
            title={`매칭률: ${
              typeof finalScore === 'number' ? `${Math.round(finalScore)}%` : finalScore
            }`}
          >
            {typeof finalScore === 'number' ? `매칭률 ${Math.round(finalScore)}%` : finalScore}
          </span>
        )}
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
        {reasonTexts.length > 0 && (
          <div className="card__reasons">
            {reasonTexts.slice(0, 3).map((txt, i) => (
              <span key={i} className="card__reasonBadge" title={txt}>
                {txt.length > 30 ? `${txt.slice(0, 28)}…` : txt}
              </span>
            ))}
            {reasonTexts.length > 3 && (
              <span className="card__reasonMore">+{reasonTexts.length - 2}</span>
            )}
          </div>
        )}

        <button className="btn btn--light" onClick={() => onOpen(animal)}>
          상세보기
        </button>
      </div>
    </div>
  );
}
