import { useState } from 'react';

export default function ReviewForm({ initial, onSubmit, onCancel, busy }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [body, setBody] = useState(initial?.body || '');
  const [files, setFiles] = useState([]);

  return (
    <form
      className="review-form"
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit({ title, body, files: Array.from(files) });
      }}
    >
      <label className="field">
        <span>제목</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          required
        />
      </label>

      <label className="field">
        <span>내용</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="후기를 입력하세요"
          rows={8}
          required
        />
      </label>

      <label className="field">
        <span>사진(여러장 선택 가능)</span>
        <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} />
      </label>

      <div className="actions">
        <button type="submit" disabled={busy} className="primary">
          {initial ? '수정 완료' : '등록'}
        </button>
        <button type="button" onClick={onCancel} disabled={busy}>
          취소
        </button>
      </div>
    </form>
  );
}
