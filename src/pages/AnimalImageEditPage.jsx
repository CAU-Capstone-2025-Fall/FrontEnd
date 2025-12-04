import { useEffect, useState } from 'react';
import { getAnimals } from '../api/animals';
import { cleanImage } from '../api/gpt_image';
import Pagination from '../components/Pagination';
import '../css/AnimalImageEditPage.css';

const PAGE_SIZE = 12;

function AnimalImageEditPage() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [previewMap, setPreviewMap] = useState({});

  const [page, setPage] = useState(1);
  const [lastPageSize, setLastPageSize] = useState(0);

  // 모달 UI
  const [showModal, setShowModal] = useState(false);
  const [currentAnimal, setCurrentAnimal] = useState(null);
  const [customPrompt, setCustomPrompt] = useState('');

  // 전/후 이미지 상태
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const totalPages = null;

  // ============================
  // 데이터 불러오기
  // ============================
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
        if (!cancelled) setError('동물 목록을 가져오는 데 실패했습니다.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAnimals();
    return () => {
      cancelled = true;
    };
  }, [page]);

  // ============================
  // 모달 열기
  // ============================
  const openPromptModal = (animal) => {
    setCurrentAnimal(animal);
    setCustomPrompt('');
    setPreviewImage(null);
    setHasGenerated(false);
    setShowModal(true);
  };

  // ============================
  // 수정 실행
  // ============================
  const executeCleanWithPrompt = async () => {
    if (!currentAnimal) return;
    try {
      setIsProcessing(true);
      setProcessingId(currentAnimal.desertionNo);

      const newImgUrl = await cleanImage(currentAnimal.desertionNo, customPrompt);

      setPreviewImage(newImgUrl);
      setHasGenerated(true);
    } catch (e) {
      alert('이미지 수정 중 오류 발생');
    } finally {
      setIsProcessing(false);
      setProcessingId(null);
    }
  };

  // ============================
  // 다시 수정하기
  // ============================
  const redoPrompt = () => {
    setPreviewImage(null);
    setHasGenerated(false);
    setCustomPrompt('');
  };

  // ============================
  // 완료 → 리스트에 적용
  // ============================
  const finishEditing = () => {
    setPreviewMap((prev) => ({
      ...prev,
      [currentAnimal.desertionNo]: previewImage,
    }));

    setShowModal(false);
    setPreviewImage(null);
    setCustomPrompt('');
    setHasGenerated(false);
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  // ============================
  // JSX RETURN
  // ============================
  return (
    <div className="page-container">
      <h1>동물 이미지 수정 페이지</h1>
      {/* 카드 리스트 */}
      <div className="animal-grid">
        {animals.map((animal) => {
          const { desertionNo, popfile1, kindCd, age, noticeNo, orgNm } = animal;
          const preview = previewMap[desertionNo];

          return (
            <div key={desertionNo} className="animal-card">
              <div className="animal-image-box">
                <img src={preview || popfile1} alt={desertionNo} />
              </div>

              <div className="animal-info">
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

              {preview && <div className="preview-success">새 이미지 생성됨</div>}

              <button
                className="edit-btn"
                disabled={processingId === desertionNo}
                onClick={() => openPromptModal(animal)}
              >
                {processingId === desertionNo ? '수정 중…' : '이미지 수정 요청'}
              </button>
            </div>
          );
        })}

        {animals.length === 0 && <div className="empty-box">수정할 이미지가 없습니다.</div>}
      </div>

      {/* 페이지네이션 */}
      <div className="pagination-center">
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          hasMore={lastPageSize === PAGE_SIZE}
          isEmpty={animals.length === 0 && page === 1}
        />
      </div>

      {/* ============================
          모달 UI
      ============================ */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className={`modal-content ${previewImage ? 'xlarge' : 'large'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button className="modal-close-btn" onClick={() => setShowModal(false)}>
              ✕
            </button>

            <div className="modal-body">
              {/* LEFT SIDE */}
              <div className="modal-left">
                {!isProcessing && !previewImage && (
                  <img src={currentAnimal?.popfile1} className="modal-original-img" />
                )}

                {isProcessing && (
                  <div className="modal-loading">
                    <div className="spinner"></div>
                    <p>이미지 수정 중…</p>
                  </div>
                )}

                {previewImage && (
                  <div className="modal-compare">
                    <div>
                      <p className="compare-label">Before</p>
                      <img src={currentAnimal?.popfile1} />
                    </div>
                    <div>
                      <p className="compare-label">After</p>
                      <img src={previewImage} />
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT SIDE */}
              <div className="modal-right">
                {!hasGenerated && (
                  <>
                    <h2>프롬프트 설정</h2>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="예: 털의 진흙 제거를 강조해줘."
                    />

                    <div className="keyword-box">
                      {[
                        'more dirt removal',
                        'preserve fur texture',
                        'keep lighting unchanged',
                        'reduce stain',
                      ].map((kw) => (
                        <button
                          key={kw}
                          className="keyword-btn"
                          onClick={() => setCustomPrompt((prev) => prev + ' ' + kw)}
                        >
                          {kw}
                        </button>
                      ))}
                    </div>

                    <button className="exec-btn" onClick={executeCleanWithPrompt}>
                      이미지 수정 실행
                    </button>
                  </>
                )}

                {hasGenerated && (
                  <>
                    <button className="exec-btn" onClick={redoPrompt}>
                      다시 수정하기
                    </button>
                    <button className="exec-btn save-btn" onClick={finishEditing}>
                      완료 (새 이미지 적용)
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnimalImageEditPage;
