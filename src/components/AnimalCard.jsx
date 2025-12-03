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

  // 0.0 ~ 1.0 구간을 30~100으로 매핑
  if (n <= 1.0) {
    return Math.round(n * 70 + 30);
  }
  // 1~100이면 그대로 퍼센트
  if (n <= 100) {
    return Math.round(n);
  }
  // 그 외는 클램프
  return Math.max(0, Math.min(100, Math.round(n)));
}

export default function AnimalCard({ animal, onOpen, onToggleFav, isFav, aiMode }) {
  const imgSrc = aiMode ? animal.createdImg || animal.popfile1 : animal.popfile1;
  const isAIImage = aiMode && animal.createdImg;

  // 백엔드에서 붙여준 recommendation 객체를 우선 사용
  const rec = animal.recommendation || {
    final: animal.finalScore ?? animal.final ?? animal.score ?? null,
    sim: animal.sim ?? null,
    compat: animal.compat ?? null,
    priority: animal.priority ?? null,
    location: animal.location ?? null,
    reasons: animal.reasons ?? [],
  };

  // ---- 원시 점수(raw) ----
  const simRaw = rec.sim;
  const compatRaw = rec.compat;
  const prioRaw = rec.priority;
  const locRaw = rec.location;

  // ---- 화면용 퍼센트 스코어 ----
  const simScore = simRaw != null ? toPercentScore(simRaw) : null;
  const compatScore = compatRaw != null ? toPercentScore(compatRaw) : null;
  const prioScore = prioRaw != null ? toPercentScore(prioRaw / 3.0) : null; // priority는 0~3 기준이라 /3
  const locScore = locRaw != null ? toPercentScore(locRaw) : null;

  // 💡 매칭률: sim & compat 평균으로 표시
  let matchScoreRaw = null;
  if (simRaw != null && compatRaw != null) {
    matchScoreRaw = (Number(simRaw) + Number(compatRaw)) / 2;
  } else if (simRaw != null) {
    matchScoreRaw = Number(simRaw);
  } else if (compatRaw != null) {
    matchScoreRaw = Number(compatRaw);
  }
  const matchScore = matchScoreRaw != null ? toPercentScore(matchScoreRaw) : null;

  // ---- reasons ----
  const reasonObjects = Array.isArray(rec.reasons) ? rec.reasons : [];

  // 배지에 쓸 "짧은 라벨"
  const reasonBadges = reasonObjects.filter((r) => r && (r.label || r.reason));

  return (
    <div className="card">
      <div className="card__imgWrap" onClick={() => onOpen(animal)} role="button">
        <img src={imgSrc} alt={animal.kindNm || 'animal'} />

        {isAIImage && <span className="ai-generated-tag">AI 생성 이미지</span>}

        {typeof matchScore === 'number' && (
          <span
            className={`card__score ${matchScore < 50 ? 'low' : ''}`}
            title={`전체 매칭률: ${matchScore}%`}
          >
            매칭률 {matchScore}%
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

        {(simScore !== null || compatScore !== null || prioScore !== null || locScore !== null) && (
          <div className="card__subScores">
            {simScore !== null && (
              <div className="subScore">
                <span className="subScore__label">조건 일치</span>
                <span className="subScore__value">{simScore}%</span>
              </div>
            )}
            {compatScore !== null && (
              <div className="subScore">
                <span className="subScore__label">입양자 적합도</span>
                <span className="subScore__value">{compatScore}%</span>
              </div>
            )}
            {prioScore !== null && (
              <div className="subScore subScore--soft">
                <span className="subScore__label">우선 필요</span>
                <span className="subScore__value">{prioScore}%</span>
              </div>
            )}
            {locScore !== null && (
              <div className="subScore subScore--soft">
                <span className="subScore__label">거리 편의</span>
                <span className="subScore__value">{locScore}%</span>
              </div>
            )}
          </div>
        )}

        {reasonBadges.length > 0 && (
          <div className="card__reasonsBlock">
            <div className="card__reasons">
              {reasonBadges.map((r, i) => {
                const score = Number(r.score ?? 0);
                let cls = 'card__reasonBadge card__reasonBadge--neutral';

                if (!Number.isNaN(score)) {
                  if (score > 0) {
                    cls =
                      'card__reasonBadge ' +
                      (score >= 0.4
                        ? 'card__reasonBadge--positive-strong'
                        : 'card__reasonBadge--positive-light');
                  } else if (score < 0) {
                    cls =
                      'card__reasonBadge ' +
                      (score <= -0.4
                        ? 'card__reasonBadge--negative-strong'
                        : 'card__reasonBadge--negative-light');
                  }
                }

                const labelText = (r.label || '기타').trim();

                return (
                  <span key={i} className={cls} title={r.reason || ''}>
                    {labelText.length > 24 ? `${labelText.slice(0, 22)}…` : labelText}
                  </span>
                );
              })}
            </div>

            <ul className="card__reasonDetails">
              {reasonObjects.map((r, idx) => {
                if (!r || !r.reason) return null;
                return <li key={idx}>{r.reason}</li>;
              })}
            </ul>
          </div>
        )}

        <button className="btn btn--light" onClick={() => onOpen(animal)}>
          상세보기
        </button>
      </div>
    </div>
  );
}
