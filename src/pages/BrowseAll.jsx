import React, { useEffect, useMemo, useState } from 'react';
import { getAnimals, getAnimalCount, getAnimalById } from '../api/animals';
import Filters from '../components/Filters';
import AnimalCard from '../components/AnimalCard';
import AnimalDetail from '../components/AnimalDetail';
import Pagination from '../components/Pagination';
import { useFavoriteStore } from '../store/useFavoriteStore';

const PAGE_SIZE = 6;

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
  });
  const [animals, setAnimals] = useState([]);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(null);
  const [lastPageSize, setLastPageSize] = useState(0);

  // ✅ 전역 스토어 구독
  const { ids: favorites, map: favMap, toggle } = useFavoriteStore();

  const totalPages = useMemo(
    () => (typeof totalCount === 'number' ? Math.ceil(totalCount / PAGE_SIZE) : null),
    [totalCount]
  );

  const applyChange = (patch) => {
    setFilters((p) => ({ ...p, ...patch }));
    setPage(1);
  };

  useEffect(() => {
    setTotalCount(null);
  }, [JSON.stringify(filters)]);

  const buildQuery = () => {
    const q = { limit: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE };
    if (filters.species !== '모든 동물') q.upkind_nm = filters.species;
    if (filters.breed !== '모든 품종') q.kind_nm = filters.breed;
    if (filters.doName !== '모든 지역' && !filters.gun) q.org_name = filters.doName;
    if (filters.doName !== '모든 지역' && filters.gun)
      q.org_name = `${filters.doName} ${filters.gun}`;
    if (filters.sex) q.sex_cd = filters.sex;
    if (filters.neuterYn) q.neuterYn = filters.neuterYn;
    return q;
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const query = buildQuery();
      setTotalCount((prev) => (typeof prev === 'number' && page > 1 ? prev : null));
      const [list, cnt] = await Promise.all([
        getAnimals(query),
        getAnimalCount({ ...query, limit: 0, skip: 0 }).catch(() => null),
      ]);
      if (cancelled) return;
      const data = list || [];
      setAnimals(data);
      setLastPageSize(data.length);
      if (typeof cnt === 'number') setTotalCount(cnt);
      else setTotalCount(data.length < PAGE_SIZE ? (page - 1) * PAGE_SIZE + data.length : null);
    })();
    return () => {
      cancelled = true;
    };
  }, [page, JSON.stringify(filters)]); // eslint-disable-line

  // ✅ Favorites 탭 진입 시, map에 없는 id는 개별 조회로 보충 (함수형 setState로 안전하게)
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
        {tab === 'browse' && <Filters value={filters} onChange={applyChange} />}

        <div className="result-shell">
          <div className="result-content grid">
            {(tab === 'browse' ? animals : favAnimals).map((a) => (
              <AnimalCard
                key={a.desertionNo}
                animal={a}
                isFav={favorites.includes(a.desertionNo)}
                onOpen={setSelected}
                onToggleFav={() => toggle(a)}
              />
            ))}

            {tab === 'fav' && favAnimals.length === 0 && (
              <div className="empty">찜한 동물이 없습니다. 하트를 눌러 추가해보세요!</div>
            )}

            {tab === 'browse' && animals.length === 0 && (
              <div className="no-results">검색 결과가 없습니다</div>
            )}
          </div>

          {tab === 'browse' && (
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={totalPages}
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
