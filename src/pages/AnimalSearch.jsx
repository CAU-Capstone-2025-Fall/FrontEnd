import { useEffect, useMemo, useState } from 'react';
import { getAnimals } from '../api/animals';

function fmtDate(yyyymmdd) {
  if (!yyyymmdd || yyyymmdd.length !== 8) return yyyymmdd || '';
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
}
function pickImg(item) {
  return item?.popfile1 || item?.popfile2 || '';
}
function Row({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 8 }}>
      <div style={{ opacity: 0.7 }}>{label}</div>
      <div>{value}</div>
    </div>
  );
}

export default function AnimalSearch() {
  // 데이터 상태
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // 검색 폼
  const [form, setForm] = useState({
    start_date: '',
    end_date: '',
    happen_place: '',
    upkind_nm: '',
    kind_nm: '',
    sex_cd: '',
    care_name: '',
    org_name: '',
    limit: 50,
    skip: 0,
  });

  // 첫 로드
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const res = await getAnimals({});
        setData(res);
      } catch (e) {
        setErr(String(e.message || e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onSearch = async () => {
    try {
      setLoading(true);
      setErr('');
      const res = await getAnimals({
        start_date: form.start_date,
        end_date: form.end_date,
        happen_place: form.happen_place,
        upkind_nm: form.upkind_nm,
        kind_nm: form.kind_nm,
        sex_cd: form.sex_cd,
        care_name: form.care_name,
        org_name: form.org_name,
        limit: form.limit,
        skip: form.skip,
      });
      setData(res);
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  const onReset = async () => {
    setForm({
      start_date: '',
      end_date: '',
      happen_place: '',
      upkind_nm: '',
      kind_nm: '',
      sex_cd: '',
      care_name: '',
      org_name: '',
      limit: 50,
      skip: 0,
    });
    await onSearch();
  };

  // 왼쪽 정렬 + 세로 카드 리스트 레이아웃
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 860, // 화면 왼쪽에 한 줄로 보이게 폭 제한
        margin: '0', // 왼쪽 정렬 (가운데 정렬 원하면 margin:'0 auto')
        padding: 16,
        boxSizing: 'border-box',
        display: 'grid',
        gap: 16,
      }}
    >
      <h1 style={{ margin: 0 }}>동물 검색</h1>

      {/* 검색 폼: 한 줄씩 세로 정렬 */}
      <div style={{ display: 'grid', gap: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input
            name="start_date"
            placeholder="start_date (YYYY-MM-DD)"
            value={form.start_date}
            onChange={onChange}
          />
          <input
            name="end_date"
            placeholder="end_date (YYYY-MM-DD)"
            value={form.end_date}
            onChange={onChange}
          />
        </div>

        <input
          name="happen_place"
          placeholder="happen_place"
          value={form.happen_place}
          onChange={onChange}
        />
        <input
          name="upkind_nm"
          placeholder="upkind_nm"
          value={form.upkind_nm}
          onChange={onChange}
        />
        <input name="kind_nm" placeholder="kind_nm" value={form.kind_nm} onChange={onChange} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input
            name="sex_cd"
            placeholder="sex_cd (M/F/Q)"
            value={form.sex_cd}
            onChange={onChange}
          />
          <input
            name="care_name"
            placeholder="care_name"
            value={form.care_name}
            onChange={onChange}
          />
        </div>
        <input name="org_name" placeholder="org_name" value={form.org_name} onChange={onChange} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input
            name="limit"
            type="number"
            min="1"
            placeholder="limit"
            value={form.limit}
            onChange={onChange}
          />
          <input
            name="skip"
            type="number"
            min="0"
            placeholder="skip"
            value={form.skip}
            onChange={onChange}
          />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={onSearch}>
            검색
          </button>
          <button type="button" onClick={onReset}>
            초기화
          </button>
        </div>
      </div>

      {/* 상태 */}
      {loading && <div>불러오는 중...</div>}
      {err && <div style={{ color: 'tomato' }}>{err}</div>}

      {/* 카드 리스트 */}
      <div style={{ display: 'grid', gap: 12 }}>
        {data?.length === 0 && !loading && !err && (
          <div style={{ opacity: 0.7 }}>검색 결과가 없습니다.</div>
        )}

        {data?.map((item) => {
          const img = pickImg(item);
          const title = item?.kindFullNm || `${item?.upKindNm || ''} ${item?.kindNm || ''}`.trim();
          const subtitle = `공고번호: ${item?.noticeNo || '-'} | 유기번호: ${item?.desertionNo || '-'}`;

          return (
            <article
              key={item?.id || item?.desertionNo}
              style={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr',
                gap: 12,
                padding: 12,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                alignItems: 'start',
              }}
            >
              {/* 썸네일 */}
              <div
                style={{
                  width: 160,
                  height: 120,
                  borderRadius: 10,
                  overflow: 'hidden',
                  background: 'rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {img ? (
                  <img
                    src={img}
                    alt={title || '동물 이미지'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span style={{ opacity: 0.6, fontSize: 12 }}>이미지 없음</span>
                )}
              </div>

              {/* 내용 */}
              <div style={{ display: 'grid', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{title || '동물'}</div>
                  <div style={{ opacity: 0.7, fontSize: 13 }}>{subtitle}</div>
                </div>

                <div style={{ display: 'grid', gap: 6 }}>
                  <Row label="발견일" value={fmtDate(item?.happenDt)} />
                  <Row label="발견장소" value={item?.happenPlace} />
                  <Row label="색상" value={item?.colorCd} />
                  <Row
                    label="성별/중성화"
                    value={[item?.sexCd, item?.neuterYn].filter(Boolean).join(' / ')}
                  />
                  <Row
                    label="나이/몸무게"
                    value={[item?.age, item?.weight].filter(Boolean).join(' / ')}
                  />
                  <Row
                    label="공고기간"
                    value={[fmtDate(item?.noticeSdt), fmtDate(item?.noticeEdt)]
                      .filter(Boolean)
                      .join(' ~ ')}
                  />
                  <Row
                    label="보호소"
                    value={[item?.careNm, item?.careTel].filter(Boolean).join(' / ')}
                  />
                  <Row label="주소" value={item?.careAddr} />
                  <Row label="기관" value={item?.orgNm} />
                  {item?.specialMark && <Row label="특이사항" value={item.specialMark} />}
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  {img && (
                    <a href={img} target="_blank" rel="noreferrer" style={{ fontSize: 13 }}>
                      원본 이미지
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* 필요하면 JSON 원문 보기 토글 */}
      {/* <details>
        <summary>원문 JSON 보기</summary>
        <pre style={{ whiteSpace: 'pre-wrap', background:'#0f172a', color:'#e5e7eb', padding:12, borderRadius:8 }}>
          {useMemo(() => JSON.stringify(data, null, 2), [data])}
        </pre>
      </details> */}
    </div>
  );
}
