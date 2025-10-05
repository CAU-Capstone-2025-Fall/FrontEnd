export default function ReviewDetail({ item, onBack, onEdit, onDelete, busy }) {
  return (
    <div className="review-detail">
      <button className="ghost" onClick={onBack}>
        ← 목록
      </button>
      <h2 className="title">{item.title}</h2>
      <div className="sub">
        <span className="author">{item.authorName}</span>
        <span className="date">{new Date(item.createdAt).toLocaleString()}</span>
      </div>

      <p className="body" style={{ whiteSpace: 'pre-wrap' }}>
        {item.body}
      </p>

      {item.images?.length ? (
        <div className="gallery">
          {item.images.map((src, i) => (
            <img key={i} src={src} alt={`이미지 ${i + 1}`} />
          ))}
        </div>
      ) : null}

      <div className="actions">
        <button onClick={onEdit}>수정</button>
        <button className="danger" onClick={onDelete} disabled={busy}>
          삭제
        </button>
      </div>
    </div>
  );
}
