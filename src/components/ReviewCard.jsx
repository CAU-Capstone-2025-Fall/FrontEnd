export default function ReviewCard({ item, onClick }) {
  const thumb = item.images?.[0];
  return (
    <article className="review-card" onClick={onClick} role="button" tabIndex={0}>
      {thumb ? (
        <img src={thumb} alt={item.title} className="thumb" />
      ) : (
        <div className="thumb placeholder">No Image</div>
      )}
      <div className="meta">
        <h3 className="title">{item.title}</h3>
        <div className="sub">
          <span className="author">{item.authorName}</span>
          <span className="date">{new Date(item.createdAt).toLocaleString()}</span>
        </div>
      </div>
    </article>
  );
}
