import { useState } from 'react';
import { cleanImage } from '../api/gpt_image';

const ImageEditTest = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleEdit = async () => {
    if (!file) {
      alert('이미지를 업로드하세요.');
      return;
    }

    setLoading(true);
    setEditedImage(null);

    try {
      const result = await cleanImage(file);
      setEditedImage(result);
    } catch (err) {
      console.error(err);
      alert('API 호출 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>GPT Image Clean Test</h1>

      {/* 파일 업로드 */}
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {/* 원본 미리보기 */}
      {preview && (
        <div style={{ marginTop: '20px' }}>
          <p>원본 이미지</p>
          <img
            src={preview}
            alt="preview"
            style={{ maxWidth: '512px', border: '1px solid #ccc' }}
          />
        </div>
      )}

      {/* 요청 버튼 */}
      <button onClick={handleEdit} disabled={loading} style={{ marginTop: '20px' }}>
        {loading ? '처리 중...' : '이미지 클린업 실행'}
      </button>

      {/* 클린업 결과 */}
      {editedImage && (
        <div style={{ marginTop: '20px' }}>
          <p>결과 이미지</p>
          <img
            src={editedImage}
            alt="edited"
            style={{ maxWidth: '512px', border: '1px solid #ccc' }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageEditTest;
