import React from 'react';

function displayAge(ageStr) {
  if (!ageStr) return '-';
  const has60 = /60\s*일\s*미만|60일미만/.test(ageStr);
  const m = ageStr.match(/(\d{4})/);
  if (m) {
    const birthYear = parseInt(m[1], 10);
    const y = new Date().getFullYear();
    let years = y - birthYear;
    if (years <= 0) years = 1;
    return `${years}살${has60 ? '(60일미만)' : ''}`;
  }
  return ageStr.trim();
}

export default function AnimalDetail({ animal, onClose }) {
  if (!animal) return null;

  const hideSpecial =
    typeof animal.specialMark === 'string' && /^\d+-\d+$/.test(animal.specialMark.trim());

  const images = [animal.popfile1, animal.popfile2].filter(Boolean);
  const title = `[${animal.upKindNm || '-'}] ${animal.kindNm || '-'}`;

  return (
    <div className="modal__backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <strong>동물 상세정보</strong>
          <button className="modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="detail">
          {/* 왼쪽: 큰 이미지 (여러 장 있을 경우 세로로) */}
          <div className="detail__img">
            {images.map((src, i) => (
              <img key={i} src={src} alt={`animal-${i}`} />
            ))}
            {String(animal.processState || '').includes('보호') && (
              <span className="badge">보호중</span>
            )}
          </div>

          {/* 오른쪽: 정보 */}
          <div className="detail__info">
            <div className="info__title">{title}</div>
            <div className="info__meta">
              {animal.kindFullNm || '-'} · {displayAge(animal.age)} · {animal.weight || '-'}
            </div>

            <div className="info">
              <div className="info__row">
                <div>공고번호</div>
                <div>{animal.desertionNo || '-'}</div>
              </div>
              <div className="info__row">
                <div>발생장소</div>
                <div>{animal.happenPlace || '-'}</div>
              </div>
              <div className="info__row">
                <div>보호센터</div>
                <div>{animal.careNm || '-'}</div>
              </div>
              <div className="info__row">
                <div>연락처</div>
                <div>{animal.careTel || '-'}</div>
              </div>
              <div className="info__row">
                <div>관할기관</div>
                <div>{animal.orgNm || '-'}</div>
              </div>
              <div className="info__row">
                <div>보호장소</div>
                <div>{animal.careAddr || '-'}</div>
              </div>
              <div className="info__row">
                <div>중성화</div>
                <div>{animal.neuterYn || '-'}</div>
              </div>
              {!hideSpecial && (
                <div className="info__row">
                  <div>특징</div>
                  <div>{animal.specialMark || '-'}</div>
                </div>
              )}
            </div>

            <div className="cta">
              <a
                className="btn btn--light"
                onClick={() => {
                  const phone = (animal.careTel || '').replaceAll('-', '');
                  if (!phone) return alert('전화번호가 없습니다.');
                  navigator.clipboard
                    .writeText(phone)
                    .then(() => alert('전화번호가 복사되었습니다!'))
                    .catch(() => alert('복사에 실패했습니다.'));
                }}
              >
                보호센터 전화번호 복사하기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
