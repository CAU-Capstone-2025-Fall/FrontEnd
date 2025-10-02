import { useState } from 'react';
import { requestImageEdit } from '../api/image_edit';

const ImageEditTest = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [editedImage, setEditedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEdit = async () => {
    if (!imageUrl || !prompt) {
      alert('이미지 URL과 프롬프트를 입력하세요.');
      return;
    }

    setLoading(true);
    setEditedImage(null);

    try {
      const imgSrc = await requestImageEdit(imageUrl, prompt);
      setEditedImage(imgSrc); // b64 → data url 변환된 값 들어옴
    } catch (err) {
      alert('API 호출 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Image Edit Test</h1>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="이미지 URL 입력"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          style={{ width: '400px', marginRight: '10px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="프롬프트 입력"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: '400px', marginRight: '10px' }}
        />
      </div>

      <button onClick={handleEdit} disabled={loading}>
        {loading ? '생성 중...' : '이미지 편집 요청'}
      </button>

      <div style={{ marginTop: '20px' }}>
        {editedImage && (
          <img
            src={editedImage}
            alt="Edited"
            style={{ maxWidth: '512px', border: '1px solid #ccc' }}
          />
        )}
      </div>
    </div>
  );
};

export default ImageEditTest;
