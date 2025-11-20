import { create } from 'zustand';
import { getFavorites, addFavorite, removeFavorite } from '../api/favorite';
import { getAnimalById } from '../api/animals';
import { useAuthStore } from './useAuthStore';

// ---------- LocalStorage Keys ----------
const LS_IDS = 'fav:ids';
const LS_MAP = 'fav:map';

// ---------- Store ----------
export const useFavoriteStore = create((set, get) => ({
  ids: [],
  map: {},
  loading: false,
  error: null,
  _wired: false,

  // 1) 새로고침 직후: 로컬 하이드레이션
  initFromStorage: () => {
    try {
      const ids = JSON.parse(localStorage.getItem(LS_IDS) || '[]');
      const map = JSON.parse(localStorage.getItem(LS_MAP) || '{}');
      if (Array.isArray(ids) && map && typeof map === 'object') {
        set({ ids, map });
      }
    } catch {
      // 손상되었을 수 있으므로 무시
    }
  },

  // 2) 메모리 → 로컬 저장 + 브로드캐스트
  saveToStorage: () => {
    const { ids, map } = get();
    localStorage.setItem(LS_IDS, JSON.stringify(ids));
    localStorage.setItem(LS_MAP, JSON.stringify(map));
    localStorage.setItem('fav:changed', String(Date.now())); // 다른 탭 알림
  },

  // 3) 로컬 초기화 + 브로드캐스트
  clearStorage: () => {
    localStorage.removeItem(LS_IDS);
    localStorage.removeItem(LS_MAP);
    localStorage.setItem('fav:changed', String(Date.now()));
  },

  // 4) Auth 연동 (앱 부팅 시 1회)
  wireAuth: () => {
    if (get()._wired) return;
    set({ _wired: true });

    // 로컬스토리지 먼저 반영
    get().initFromStorage();

    // ✔ 로그인 여부는 서버에 묻지 말고 Zustand state로 판단
    const authState = useAuthStore.getState();
    const user = authState.user;

    if (!user) {
      // 로그인 안 된 상태면 서버에 절대 요청 보내지 말기!
      set({ ids: [], map: {} });
      get().clearStorage();
      return;
    }

    // ✔ 여기서만 서버 요청!
    (async () => {
      try {
        await get().loadFromServer();
        get().saveToStorage();
      } catch {
        set({ ids: [], map: {} });
        get().clearStorage();
      }
    })();

    // (C) 이후: user 변경 감지 (미들웨어 없이 단일 리스너 구독)
    useAuthStore.subscribe((state, prev) => {
      if (state.user === prev.user) return;

      if (state.user) {
        // 로그인됨
        (async () => {
          await get().loadFromServer();
          get().saveToStorage();
        })();
      } else {
        // 로그아웃됨
        set({ ids: [], map: {} });
        get().clearStorage();
      }
    });

    // (D) 포커스/스토리지 이벤트에서 재동기화
    const onFocus = () => {
      const user = useAuthStore.getState().user;

      if (user) {
        get()
          .loadFromServer()
          .then(get().saveToStorage)
          .catch(() => {});
      } else {
        get().initFromStorage();
      }
    };
    const onStorage = (e) => {
      if (e.key === 'fav:changed' || e.key === 'auth:changed') onFocus();
    };
    window.addEventListener('focus', onFocus);
    window.addEventListener('storage', onStorage);
  },

  // 5) 서버에서 즐겨찾기 동기화 (+ 상세 캐시 보충)
  loadFromServer: async () => {
    set({ loading: true, error: null });
    try {
      const ids = await getFavorites(); // axios 인스턴스에 withCredentials 설정됨
      set({ ids });

      // 상세 캐시 보충
      const missing = ids.filter((id) => !get().map[id]);
      if (missing.length) {
        const list = await Promise.all(missing.map((id) => getAnimalById(id).catch(() => null)));
        const next = { ...get().map };
        list.forEach((a) => {
          if (a && typeof a === 'object' && a.desertionNo) {
            const key = a.desertionNo;
            next[key] = a;
          }
        });
        set({ map: next });
      }
      set({ loading: false });
    } catch (e) {
      const msg =
        e && typeof e === 'object' && 'message' in e ? String(e.message) : '즐겨찾기 로드 실패';
      set({ loading: false, error: msg });
    }
  },

  // 6) 토글: 낙관적 업데이트 + 로컬 저장 + 서버 반영/롤백
  toggle: async (animal) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    const id = animal.desertionNo;
    const prevIds = get().ids;
    const isFav = prevIds.includes(id);

    // UI 낙관적 반영
    const nextIds = isFav ? prevIds.filter((x) => x !== id) : [...prevIds, id];
    const nextMap = { ...get().map };
    if (isFav) delete nextMap[id];
    else nextMap[id] = animal;

    set({ ids: nextIds, map: nextMap });
    get().saveToStorage();

    try {
      if (isFav) await removeFavorite(id);
      else await addFavorite(id);
    } catch {
      // 롤백
      const rollbackMap = { ...get().map };
      if (isFav) rollbackMap[id] = animal;
      else delete rollbackMap[id];
      set({ ids: prevIds, map: rollbackMap });
      get().saveToStorage();
      alert('즐겨찾기 저장에 실패했습니다.');
    }
  },
}));
