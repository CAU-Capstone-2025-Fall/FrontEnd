import { useEffect, useState } from 'react';
import { getReport } from '../api/report';
import '../css/report.css';

// -----------------------------------------------------
// LIME → raw_input 매핑
// -----------------------------------------------------
const FEATURE_MAP = {
  연령: '연령',
  '가족 구성원 수': '가족 구성원 수',
  주택규모: '주택규모',
  '월평균 가구소득': '월평균 가구소득',

  남성: '성별_1',
  여성: '성별_2',

  아파트: '주택형태_1',
  '단독/다가구': '주택형태_2',
  '연립/빌라/다세대': '주택형태_3',
  '기타 주거형태': '주택형태_4',

  화이트칼라: '화이트칼라',
  블루칼라: '블루칼라',
  자영업: '자영업',
  비경제활동층: '비경제활동층',
  '기타 직업군': '기타',
};

// -----------------------------------------------------
// 한글 라벨링
// -----------------------------------------------------
const LABEL_KO = {
  연령: '연령',
  '가족 구성원 수': '가족 구성원 수',
  주택규모: '주택 규모(평수)',
  '월평균 가구소득': '월평균 가구 소득',

  성별_1: '남성',
  성별_2: '여성',

  주택형태_1: '아파트',
  주택형태_2: '단독/다가구',
  주택형태_3: '연립/빌라/다세대',
  주택형태_4: '기타 주거형태',

  화이트칼라: '화이트칼라',
  블루칼라: '블루칼라',
  자영업: '자영업',
  비경제활동층: '비경제활동층',
  기타: '기타 직업군',

  '향후 반려동물 사육의향': '향후 반려동물 사육 의향',
};

function cleanLimeKey(key) {
  return key.replace(/<=.*$/, '').replace(/>.*$/, '').trim();
}

function getPercentileMessage(p) {
  if (p >= 85) return `전체 사용자 중 상위 ${100 - p}%로, 매우 안전한 편입니다.`;
  if (p >= 70) return `전체 사용자 중 상위 ${100 - p}%로, 비교적 안전한 수준입니다.`;
  if (p >= 50) return `전체 사용자 중 ${100 - p}% 수준으로, 보통 위험도입니다.`;
  if (p >= 30) {
    return `전체 대비 상위 ${100 - p}%로, 주의가 필요한 수준입니다.`;
  }
  return `전체 대비 하위 ${100 - p}% 위험군으로, 상당히 높은 위험 수준입니다.`;
}

// LIME 필터
function filterLime(lime, raw) {
  const result = [];
  Object.entries(lime).forEach(([rawKey, weight]) => {
    const cleanKey = cleanLimeKey(rawKey);
    const mapped = FEATURE_MAP[cleanKey];

    if (!mapped) {
      result.push([cleanKey, weight]);
      return;
    }

    if (raw[mapped] === 1 || raw[mapped] === '1') {
      result.push([cleanKey, weight]);
    }
  });

  return result;
}

// LIME 강도별 CSS class
function getLimeClass(weight) {
  const absVal = Math.abs(weight);
  if (absVal >= 0.2) {
    return weight > 0 ? 'lime-item lime-strong-pos' : 'lime-item lime-strong-neg';
  } else if (absVal >= 0.1) {
    return weight > 0 ? 'lime-item lime-pos' : 'lime-item lime-neg';
  } else {
    return weight > 0 ? 'lime-item lime-weak-pos' : 'lime-item lime-weak-neg';
  }
}

// Interaction 강도별 CSS class
function getInteractionClass(score) {
  const absVal = Math.abs(score);
  if (absVal >= 0.2) {
    return score > 0
      ? 'interaction-item interaction-strong-pos'
      : 'interaction-item interaction-strong-neg';
  } else if (absVal >= 0.1) {
    return score > 0 ? 'interaction-item interaction-pos' : 'interaction-item interaction-neg';
  } else {
    return score > 0
      ? 'interaction-item interaction-weak-pos'
      : 'interaction-item interaction-weak-neg';
  }
}

export default function RecommandContainer({ user, surveyVersion }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const u = user ?? localStorage.getItem('userId');
        if (!u) return setErr('로그인이 필요합니다.');

        const res = await getReport(u);
        if (!res || res.success !== true) return setErr('리포트가 없습니다.');

        console.log('REPORT', res.data);
        setReport(res.data);
      } catch (e) {
        setErr('불러오기 실패: ' + e.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user, surveyVersion]);

  if (loading) return <div className="report-wrapper">로딩 중...</div>;
  if (err) return <div className="report-wrapper">{err}</div>;
  if (!report) return <div className="report-wrapper">리포트 없음</div>;

  const raw = report.raw_input || {};
  const lime = report.lime || {};
  const interaction = report.interaction || [];

  const prob = report.probability || 0;
  const percentile = report.percentile ?? null;
  const summary = report.summary || null;

  const recommendations = report.recommendations
    ? JSON.parse(report.recommendations).recommendations
    : [];

  const limeFiltered = filterLime(lime, raw)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, 5);

  const riskLevel = prob < 0.3 ? 'low' : prob < 0.6 ? 'mid' : 'high';

  return (
    <div className="report-wrapper">
      <h2>반려동물 유기 위험도 리포트</h2>

      {/* -------------------------------- 위험도 */}
      <section className="report-card">
        <h3>유기 충동을 겪을 가능성</h3>
        <p className={`prob-result ${riskLevel}`}>
          <b>{Math.round(prob * 100)}%</b> ({prob.toFixed(4)})
        </p>

        <div className="prob-bar">
          <div className="prob-fill" style={{ width: `${prob * 100}%` }}></div>
        </div>
      </section>

      {/* -------------------------------- Percentile */}
      {percentile !== null && (
        <section className="report-card">
          <h3>전체 사용자 대비 안전 위치</h3>

          <p>{getPercentileMessage(percentile)}</p>

          <div className="percentile-bar">
            <div className="percentile-fill" style={{ width: `${percentile}%` }}></div>
          </div>
        </section>
      )}

      {/* -------------------------------- Summary */}
      {summary && (
        <section className="report-card summary-card">
          <h3>분석 요약</h3>
          {/* GPT가 두 단락으로 주면 CSS에서 pre-line으로 줄바꿈 유지 */}
          <p className="summary-text">{summary}</p>
        </section>
      )}

      {/* -------------------------------- 행동 가이드 */}
      {recommendations.length > 0 && (
        <section className="report-card">
          <h3>유기 위험도를 낮추기 위한 행동 가이드</h3>

          <ul className="rec-list">
            {recommendations.map((item, idx) => (
              <li key={idx} className="rec-item">
                <div className="rec-title">{item.title}</div>
                <div className="rec-detail">{item.detail}</div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* -------------------------------- Interaction Top 3 */}
      {interaction.length > 0 && (
        <section className="report-card">
          <h3>주요 상호작용 요인 Top 3</h3>

          <ul className="interaction-list">
            {interaction.map(([groups, score]) => {
              const cls = getInteractionClass(score);
              return (
                <li key={groups.join('-')} className={cls}>
                  <span className="interaction-label">{groups.join(' × ')}</span>
                  <span className="interaction-score">{score.toFixed(4)}</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* -------------------------------- LIME */}
      <section className="report-card">
        <h3>LIME 영향 요인 Top 5</h3>
        <ul className="lime-list">
          {limeFiltered.map(([feat, weight]) => (
            <li key={feat} className={getLimeClass(weight)}>
              <span>{feat}</span>
              <b>{weight.toFixed(4)}</b>
            </li>
          ))}
        </ul>
      </section>

      {/* -------------------------------- 입력 정보 */}
      <section className="report-card">
        <h3>입력 정보</h3>

        <div className="input-grid">
          {Object.entries(raw).map(([key, value]) => {
            if (value === 0 || value === '0') return null;

            const label = LABEL_KO[key] || key;
            const isHighlighted = limeFiltered.some(([feat]) => FEATURE_MAP[feat] === key);

            return (
              <div key={key} className={`input-item ${isHighlighted ? 'highlight' : ''}`}>
                <span className="input-label">{label}</span>
                <span className="input-value">{value}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
