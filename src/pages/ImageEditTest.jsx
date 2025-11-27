import React, { useEffect, useState } from 'react';
import { getAnimals } from '../api/animals';
import { cleanImage } from '../api/gpt_image';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 12;

function AnimalImageEditPage() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [previewMap, setPreviewMap] = useState({});

  const [page, setPage] = useState(1);
  const [lastPageSize, setLastPageSize] = useState(0);

  const totalPages = null;

  useEffect(() => {
    let cancelled = false;

    const fetchAnimals = async () => {
      try {
        setLoading(true);
        setError('');

        const query = {
          limit: PAGE_SIZE,
          skip: (page - 1) * PAGE_SIZE,
        };

        const list = await getAnimals(query);
        if (cancelled) return;

        const filtered = (list || []).filter(
          (a) => a.createdImg === null || a.createdImg === undefined
        );

        setAnimals(filtered);
        setLastPageSize(filtered.length);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setError('동물 목록을 가져오는 데 실패했습니다.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchAnimals();
    return () => {
      cancelled = true;
    };
  }, [page]);

  const handleCleanClick = async (animal) => {
    if (!animal?.desertionNo) return;

    try {
      setProcessingId(animal.desertionNo);
      const newImgUrl = await cleanImage(animal.desertionNo);

      setPreviewMap((prev) => ({
        ...prev,
        [animal.desertionNo]: newImgUrl,
      }));
    } catch (e) {
      console.error(e);
      console.error('response data:', e.response?.data);
      alert('이미지 수정 중 오류가 발생했어요.');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '16px' }}>
      <h1>동물 이미지 수정 페이지</h1>
      <p>createdImg가 null인 아이들만, popfile1 기준으로 수정합니다.</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '16px',
          marginTop: '16px',
        }}
      >
        {animals.map((animal) => {
          const { desertionNo, popfile1, kindCd, age, noticeNo, orgNm } = animal;
          const preview = previewMap[desertionNo];

          return (
            <div
              key={desertionNo}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '8px',
              }}
            >
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  overflow: 'hidden',
                  borderRadius: '4px',
                  border: '1px solid #eee',
                  marginBottom: '8px',
                }}
              >
                <img
                  src={preview || popfile1}
                  alt={desertionNo}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                <div>
                  <b>공고번호</b> {noticeNo || '-'}
                </div>
                <div>
                  <b>유기번호</b> {desertionNo}
                </div>
                <div>
                  <b>품종</b> {kindCd || '-'}
                </div>
                <div>
                  <b>나이</b> {age || '-'}
                </div>
                <div>
                  <b>센터</b> {orgNm || '-'}
                </div>
              </div>

              {preview && (
                <div
                  style={{
                    fontSize: '11px',
                    color: '#008000',
                    marginBottom: '4px',
                  }}
                >
                  새 이미지가 생성되었습니다 (미리보기).
                </div>
              )}

              <button
                style={{
                  width: '100%',
                  padding: '8px',
                  fontSize: '14px',
                  cursor: processingId === desertionNo ? 'default' : 'pointer',
                }}
                disabled={processingId === desertionNo}
                onClick={() => handleCleanClick(animal)}
              >
                {processingId === desertionNo ? '수정 중...' : '이미지 수정 요청'}
              </button>
            </div>
          );
        })}

        {animals.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0' }}>
            이 페이지에는 수정할 이미지가 없습니다.
          </div>
        )}
      </div>

      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          hasMore={lastPageSize === PAGE_SIZE}
          isEmpty={animals.length === 0 && page === 1}
        />
      </div>
    </div>
  );
}

export default AnimalImageEditPage;
