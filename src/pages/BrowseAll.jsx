import React, { useEffect, useMemo, useState } from 'react';
import { getAnimals, getAnimalCount, getAnimalById } from '../api/animals';
import Filters from '../components/Filters';
import AnimalCard from '../components/AnimalCard';
import AnimalDetail from '../components/AnimalDetail';
import { useFavoriteStore } from '../store/useFavoriteStore';

const PAGE_SIZE = 12;

export default function BrowseAll() {
  const [tab, setTab] = useState('browse');
  const [filters, setFilters] = useState({
    keyword: '',
    species: '모든 동물',
    breed: '모든 품종',
    doName: '모든 지역',
    gun: '',
    sex: '',
    neuterYn: '',
    ageMin: 0,
    ageMax: 15,
    aiMode: true,
  });

  const [animals, setAnimals] = useState([]);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { ids: favorites, map: favMap, toggle } = useFavoriteStore();

  const applyChange = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    // 필터 바뀌면 리스트 초기화 + 첫 페이지부터 다시
    setPage(1);
    setAnimals([]);
    setTotalCount(null);
    setHasMore(false);
  };

  const buildQuery = (pageNum) => {
    const q = { limit: PAGE_SIZE, skip: (pageNum - 1) * PAGE_SIZE };
    if (filters.species !== '모든 동물') q.upkind_nm = filters.species;
    if (filters.breed !== '모든 품종') q.kind_nm = filters.breed;
    if (filters.doName !== '모든 지역' && !filters.gun) q.org_name = filters.doName;
    if (filters.doName !== '모든 지역' && filters.gun)
      q.org_name = `${filters.doName} ${filters.gun}`;
    if (filters.sex) q.sex_cd = filters.sex;
    if (filters.neuterYn) q.neuterYn = filters.neuterYn;
    if (filters.ageMax) q.start_age = filters.ageMin;
    if (filters.ageMax) q.end_age = filters.ageMax;
    return q;
  };

  // 동물 리스트 로딩 (browse 탭에서만)
  useEffect(() => {
    if (tab !== 'browse') return;

    let cancelled = false;
    (async () => {
      const query = buildQuery(page);
      setIsLoadingMore(true);

      const [list, cnt] = await Promise.all([
        getAnimals(query),
        getAnimalCount({ ...query, limit: 0, skip: 0 }).catch(() => null),
      ]);

      if (cancelled) return;
      const data = list || [];

      setAnimals((prev) => (page === 1 ? data : [...prev, ...data]));

      if (typeof cnt === 'number') {
        setTotalCount(cnt);
        const loadedCount = (page - 1) * PAGE_SIZE + data.length;
        setHasMore(loadedCount < cnt);
      } else {
        // 총 개수를 못 받아온 경우: 한 페이지 꽉 찼으면 더 있을 수 있다고 가정
        setTotalCount(null);
        setHasMore(data.length === PAGE_SIZE);
      }

      setIsLoadingMore(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [tab, page, JSON.stringify(filters)]); // eslint-disable-line

  // ✅ 즐겨찾기 탭 진입 시, map에 없는 id는 개별 조회로 보충
  useEffect(() => {
    if (tab !== 'fav') return;
    const missing = favorites.filter((id) => !favMap[id]);
    if (!missing.length) return;

    Promise.all(missing.map((id) => getAnimalById(id)))
      .then((arr) => {
        useFavoriteStore.setState((state) => {
          const next = { ...state.map };
          arr.forEach((a) => a?.desertionNo && (next[a.desertionNo] = a));
          return { map: next };
        });
      })
      .catch(console.error);
  }, [tab, favorites, favMap]);

  const favAnimals = useMemo(
    () => favorites.map((id) => favMap[id]).filter(Boolean),
    [favorites, favMap]
  );

  const contentClass = 'browse__content' + (tab === 'fav' ? ' browse__content--full' : '');

  const listToRender = tab === 'browse' ? animals : favAnimals;

  return (
    <section className="browse">
      <div className="browse__head">
        <h2>보호소 입양 대상 동물</h2>
        <p>조건을 선택하고 보호소 동물을 살펴보세요.</p>
        <div className="tabs">
          <button
            className={`tab ${tab === 'browse' ? 'is-active' : ''}`}
            onClick={() => setTab('browse')}
          >
            전체
          </button>
          <button
            className={`tab ${tab === 'fav' ? 'is-active' : ''}`}
            onClick={() => setTab('fav')}
          >
            찜한 동물 ({favorites.length})
          </button>
        </div>
      </div>

      <div className={contentClass}>
        {/* 왼쪽 필터: 스크롤해도 따라오게(sticky) */}
        {tab === 'browse' && <Filters value={filters} onChange={applyChange} />}

        <div className="result-shell">
          <div className="result-content grid">
            {listToRender.map((a) => (
              <AnimalCard
                key={a.desertionNo}
                animal={a}
                isFav={favorites.includes(a.desertionNo)}
                onOpen={setSelected}
                onToggleFav={() => toggle(a)}
                aiMode={filters.aiMode}
              />
            ))}

            {tab === 'fav' && favAnimals.length === 0 && (
              <div className="empty">찜한 동물이 없습니다. 하트를 눌러 추가해보세요!</div>
            )}

            {tab === 'browse' && animals.length === 0 && !isLoadingMore && (
              <div className="no-results">검색 결과가 없습니다</div>
            )}
          </div>

          {/* 더보기 버튼 (browse 탭 전용) */}
          {tab === 'browse' && hasMore && animals.length > 0 && (
            <div className="load-more-wrap">
              <button
                className="load-more-btn"
                onClick={() => setPage((p) => p + 1)}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? '불러오는 중...' : '더보기'}
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimalDetail animal={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
