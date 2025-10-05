export default function HeroSection({ onScrollToBrowse, onRightTile }) {
  return (
    <section className="hero">
      <div className="hero__container">
        <div className="hero__left">
          <div className="hero__chips">
            <span className="chip">#1 사용자 맞춤 반려동물 추천</span>
            <span className="chip">#2 생성형모델을 통해 개선된 사진</span>
          </div>
          <h1 className="hero__title">당신과 어울리는 반려동물을 찾아봐요</h1>
          <p className="hero__desc">
            ‘마음잇다’에서는 생성형 모델을 통해 개선된 보호소 동물들의 사진을 원본과 함께
            보여드립니니다. 당신과 함께라면 동물들은 바로 그 사진 속 모습으로 함께 해줄 거에요. 어떤
            아이가 당신에게 적합할지 고민이라면 바로 몇가지 질문에 대답하여 보호소 동물과
            매칭되어보세요. 당신의 환경과 성격 등, 개인화된 정보로 딱 맞는 아이를 알려드릴게요!
          </p>

          <div className="hero__stats">
            <div>
              <b>500+</b>
              <span>오늘 추가된 입양대상동물</span>
            </div>
            <div>
              <b>95%</b>
              <span>입양률</span>
            </div>
            <div>
              <b>24/7</b>
              <span>챗봇상담</span>
            </div>
          </div>
        </div>

        <div className="hero__right">
          <button className="tile--cta tile--adopt" onClick={onScrollToBrowse}>
            <span>바로 보호소 동물 입양하러 가기</span>
          </button>
          <button className="tile--cta tile--recommend" onClick={onRightTile}>
            <span>보호소 동물 추천받기(다른 페이지)</span>
          </button>
        </div>
      </div>
    </section>
  );
}
