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

export default function AnimalCard({ animal, onOpen, onToggleFav, isFav, aiMode, rank }) {
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
  // ---- reasonBadges 정렬 ----
  const sortedReasonBadges = [...reasonBadges].sort((a, b) => {
    const scoreA = Number(a.score ?? 0);
    const scoreB = Number(b.score ?? 0);

    // 1) 가점 우선
    if (scoreA > 0 && scoreB <= 0) return -1;
    if (scoreA <= 0 && scoreB > 0) return 1;

    // 2) 감점 다음
    if (scoreA < 0 && scoreB >= 0) return -1;
    if (scoreA >= 0 && scoreB < 0) return 1;

    // 3) 같은 그룹 안에서는:
    //    - 가점: 큰 점수 먼저
    //    - 감점: 절댓값 큰 점수 먼저
    //    - 중립: 동일
    if (scoreA > 0 && scoreB > 0) return scoreB - scoreA; // 가점 내림차순
    if (scoreA < 0 && scoreB < 0) return Math.abs(scoreB) - Math.abs(scoreA); // 감점 절대값 내림차순

    return 0; // 중립끼리는 그대로
  });

  return (
    <div className="card">
      <div className="card__imgWrap" onClick={() => onOpen(animal)} role="button">
        <img src={imgSrc} alt={animal.kindNm || 'animal'} />

        {typeof rank === 'number' && (
          <span
            className={`card__score ${
              rank === 1
                ? 'card__score--1'
                : rank === 2
                  ? 'card__score--2'
                  : rank === 3
                    ? 'card__score--3'
                    : ''
            }`}
            title={`추천 순위 ${rank}위`}
          >
            {rank}위
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
                <span className="subScore__label">취향 매칭</span>
                <span className="subScore__value">{simScore}%</span>
              </div>
            )}
            {compatScore !== null && (
              <div className="subScore">
                <span className="subScore__label">주거환경과의 적합도</span>
                <span className="subScore__value">{compatScore}%</span>
              </div>
            )}
          </div>
        )}

        {reasonBadges.length > 0 && (
          <div className="card__reasonsBlock">
            <div className="card__reasons">
              {sortedReasonBadges.map((r, i) => {
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

        {isAIImage && (
          <div className="ai-generated-box">
            <span className="ai-generated-tag">
              AI 생성 이미지
              <span className="ai-generated-tag__icon" aria-hidden="true">
                i
              </span>
            </span>
            <p className="ai-generated-desc">
              해당 이미지는 AI가 원본 이미지를 기반으로 생성한, 동물을 깨끗하게 개선한 사진입니다.
              상세보기를 누르거나 AI 이미지 버튼을 OFF하면 원본 이미지를 확인할 수 있습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
