export default function Pagination({ page, setPage, totalPages, hasMore }) {
  const block = 9;
  const blockIdx = Math.floor((page - 1) / block);
  const start = blockIdx * block + 1;

  // 결과 없음일 때는 버튼 1개만 노출
  if (totalPages === 0) {
    return (
      <div className="pagination">
        <button className="pagebtn" disabled>
          1
        </button>
      </div>
    );
  }

  const end = totalPages ? Math.min(start + block - 1, totalPages) : start + block - 1;

  const canPrev = page > 1;
  const canNext = totalPages ? page < totalPages : !!hasMore;

  return (
    <div className="pagination">
      <button className="pagebtn" disabled={!canPrev} onClick={() => setPage(page - 1)}>
        ‹
      </button>

      {Array.from({ length: end - start + 1 }).map((_, i) => {
        const p = start + i;
        const disabled = totalPages ? p > totalPages : false;
        return (
          <button
            key={p}
            className={`pagebtn ${p === page ? 'is-active' : ''}`}
            disabled={disabled}
            onClick={() => setPage(p)}
          >
            {p}
          </button>
        );
      })}

      <button className="pagebtn" disabled={!canNext} onClick={() => setPage(page + 1)}>
        ›
      </button>
    </div>
  );
}
