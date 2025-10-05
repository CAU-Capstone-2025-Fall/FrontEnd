import React, { useEffect, useMemo, useState } from 'react';
import { getAnimals, getAnimalCount, getAnimalById } from '../api/animals';
import Filters from '../components/Filters';
import AnimalCard from '../components/AnimalCard';
import AnimalDetail from '../components/AnimalDetail';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 6;

export default function BrowseAll({ favorites, setFavorites }) {
  const [tab, setTab] = useState('browse'); // "browse" | "fav"

  // 필터 기본값
  const [filters, setFilters] = useState({
    keyword: '',
    species: '모든 동물',
    breed: '모든 품종',
    doName: '모든 지역',
    gun: '',
    sex: '',
    neuterYn: '',
  });

  // 목록/선택/페이지 상태
  const [animals, setAnimals] = useState([]);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);

  // 페이지네이션 계산용
  const [totalCount, setTotalCount] = useState(null); // null = 총량 모름
  const [lastPageSize, setLastPageSize] = useState(0); // 방금 받은 페이지의 아이템 수

  // 찜 객체 맵(id → animal) : 어떤 페이지에서 찜하든 Favorites에서 보이도록
  const [favMap, setFavMap] = useState({});

  const totalPages = useMemo(
    () => (typeof totalCount === 'number' ? Math.ceil(totalCount / PAGE_SIZE) : null),
    [totalCount]
  );

  // 필터 UI 변경
  const applyChange = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  };

  // ★ 필터가 바뀌면 totalCount를 초기화(=다시 늘어날 수 있게)
  useEffect(() => {
    setTotalCount(null);
  }, [JSON.stringify(filters)]);

  // 쿼리 만들기
  const buildQuery = () => {
    const q = { limit: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE };

    if (filters.species !== '모든 동물') q.upkind_nm = filters.species;
    if (filters.breed !== '모든 품종') q.kind_nm = filters.breed;

    // 도 / 군·구
    if (filters.doName !== '모든 지역' && !filters.gun) q.org_name = filters.doName;
    if (filters.doName !== '모든 지역' && filters.gun)
      q.org_name = `${filters.doName} ${filters.gun}`;

    // 성별
    if (filters.sex) q.sex_cd = filters.sex;

    if (filters.neuterYn) q.neuterYn = filters.neuterYn;

    // 임시 키워드(백엔드가 지원할 때만)
    if (filters.keyword) q.search = filters.keyword;

    return q;
  };

  // 목록 로딩
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const query = buildQuery();

      // 로딩 시작 : 총량 모르게(unknown) 초기화
      setTotalCount((prev) => (typeof prev === 'number' && page > 1 ? prev : null));

      const [list, cnt] = await Promise.all([
        getAnimals(query),
        getAnimalCount({ ...query, limit: 0, skip: 0 }).catch(() => null),
      ]);

      if (cancelled) return;

      const data = list || [];
      setAnimals(data);
      setLastPageSize(data.length);

      if (typeof cnt === 'number') {
        setTotalCount(cnt);
      } else {
        // count 엔드포인트가 없을 때: 마지막 페이지가 꽉 차지 않으면 "여기까지가 끝"으로 추정
        if (data.length < PAGE_SIZE) {
          setTotalCount((page - 1) * PAGE_SIZE + data.length);
        } else {
          setTotalCount(null); // 아직 끝 모름 → hasMore로 '다음' 허용 여부 결정
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [page, JSON.stringify(filters)]); // eslint-disable-line

  // 하트 토글(객체 보존)
  const toggleFav = (animal) => {
    const id = animal.desertionNo;
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    setFavMap((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = animal;
      return next;
    });
  };

  // Favorites 진입 시, 맵에 없는 아이디는 개별 조회로 채움
  useEffect(() => {
    if (tab !== 'fav') return;
    const missing = favorites.filter((id) => !favMap[id]);
    if (missing.length === 0) return;

    Promise.all(missing.map((id) => getAnimalById(id)))
      .then((arr) =>
        setFavMap((prev) => {
          const next = { ...prev };
          arr.forEach((a) => a?.desertionNo && (next[a.desertionNo] = a));
          return next;
        })
      )
      .catch(console.error);
  }, [tab, favorites]); // eslint-disable-line

  // Favorites 렌더용 배열 (언제 찜했든 순서대로)
  const favAnimals = useMemo(
    () => favorites.map((id) => favMap[id]).filter(Boolean),
    [favorites, favMap]
  );

  // Favorites에서는 필터 숨기고 그리드만 꽉 채우기
  const contentClass = 'browse__content' + (tab === 'fav' ? ' browse__content--full' : '');

  return (
    <section className="browse">
      <div className="browse__head">
        <h2>Find Your Perfect Pet</h2>
        <p>조건을 선택하고 보호소 동물을 살펴보세요.</p>

        <div className="tabs">
          <button
            className={`tab ${tab === 'browse' ? 'is-active' : ''}`}
            onClick={() => setTab('browse')}
          >
            Browse All
          </button>
          <button
            className={`tab ${tab === 'fav' ? 'is-active' : ''}`}
            onClick={() => setTab('fav')}
          >
            Favorites ({favorites.length})
          </button>
        </div>
      </div>

      <div className={contentClass}>
        {tab === 'browse' && <Filters value={filters} onChange={applyChange} />}

        {/* 결과 영역 + 페이지네이션을 분리 */}
        <div className="result-shell">
          <div className="result-content grid">
            {(tab === 'browse' ? animals : favAnimals).map((a) => (
              <AnimalCard
                key={a.desertionNo}
                animal={a}
                onOpen={setSelected}
                onToggleFav={toggleFav}
                isFav={favorites.includes(a.desertionNo)}
              />
            ))}

            {tab === 'fav' && favAnimals.length === 0 && (
              <div className="empty">찜한 동물이 없습니다. 하트를 눌러 추가해보세요!</div>
            )}

            {/* 검색 결과 없음 메시지: browse 탭에서만, 결과 0건일 때 중앙 */}
            {tab === 'browse' && animals.length === 0 && (
              <div className="no-results">검색 결과가 없습니다</div>
            )}
          </div>

          {/* 페이지네이션은 항상 하단에 고정 노출 */}
          {tab === 'browse' && (
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={totalPages} // 0이면 버튼 1개 비활성
              hasMore={typeof totalCount !== 'number' && lastPageSize === PAGE_SIZE}
              isEmpty={animals.length === 0}
            />
          )}
        </div>
      </div>

      <AnimalDetail animal={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
