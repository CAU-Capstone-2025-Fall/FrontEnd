import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css';
import heroIntro from '../assets/firstimage_intro_1.png';
import heroBrowse from '../assets/recommend_btn_1.png';
import heroReport from '../assets/report_img_1.png';
import beforeDogImg from '../assets/dog_2.jpg';
import afterDogImg from '../assets/dog_1.jpg';

const HERO_IMAGES = [
  {
    src: heroIntro, // 첫인상 공작소 소개 이미지
    alt: '첫인상 공작소 소개 일러스트',
  },
  {
    src: heroBrowse, // 입양 하러가기 이미지
    alt: '보호소 입양 대상 동물 일러스트',
  },
  {
    src: heroReport, // 매칭 & 리포트 이미지
    alt: '입양동물 매칭과 유기위험도 리포트 일러스트',
  },
];

function useInView(options) {
  const [visible, setVisible] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        obs.unobserve(entry.target);
      }
    }, options);

    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);

  return [ref, visible];
}

export default function HomePage() {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0); // 0 ~ 2
  const slidesCount = 3;

  const toPrev = () => setSlide((s) => (s - 1 + slidesCount) % slidesCount);
  const toNext = () => setSlide((s) => (s + 1) % slidesCount);

  const scrollToIntro = () => {
    const el = document.getElementById('site-intro');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 각 섹션 애니메이션용 hook
  const [statsRef, statsVisible] = useInView({ threshold: 0.2 });
  const [goal1Ref, goal1Visible] = useInView({ threshold: 0.2 });
  const [goal2Ref, goal2Visible] = useInView({ threshold: 0.2 });
  const [cardsRef, cardsVisible] = useInView({ threshold: 0.2 });

  const currentImage = HERO_IMAGES[slide];
  const prevImage = HERO_IMAGES[(slide + HERO_IMAGES.length - 1) % HERO_IMAGES.length];
  const nextImage = HERO_IMAGES[(slide + 1) % HERO_IMAGES.length];

  return (
    <main className="home">
      {/* ================== 1. 히어로 슬라이드 ================== */}
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__text">
            {slide === 0 && (
              <div className="hero__slide hero__slide--active">
                <p className="hero__eyebrow">입양 전을 더 책임감 있게</p>
                <h1 className="hero__title">첫인상 공작소</h1>
                <p className="hero__subtitle">
                  유기동물이 줄어드는 세상을 위해,
                  <br />
                  입양률 증가와 파양률 감소까지 함께 고민하는 서비스예요.
                </p>

                <div className="hero__actions">
                  <button className="btn" onClick={scrollToIntro}>
                    사이트 소개 보기
                  </button>
                </div>
              </div>
            )}

            {slide === 1 && (
              <div className="hero__slide hero__slide--active">
                <p className="hero__eyebrow">입양을 고민하고 있다면</p>
                <h1 className="hero__title">보호소 입양 대상 동물</h1>
                <p className="hero__subtitle">
                  전국 보호소의 입양 대기 동물을 한눈에 보고,
                  <br />
                  필터를 활용해 나와 잘 맞는 친구를 찾아보세요.
                  <br />
                  AI로 촬영 환경이 좋지 않은 사진도 더 깨끗하고 선명하게 보여드려요.
                </p>

                <div className="hero__actions">
                  <button className="btn" onClick={() => navigate('/browse')}>
                    입양 하러가기
                  </button>
                </div>
              </div>
            )}

            {slide === 2 && (
              <div className="hero__slide hero__slide--active">
                <p className="hero__eyebrow">입양 전, 나와의 궁합 먼저 확인</p>
                <h1 className="hero__title">
                  입양동물 매칭 &<br />
                  유기 위험도 리포트
                </h1>
                <p className="hero__subtitle">
                  설문을 통해 입양 희망자의 생활 패턴과 성향을 분석하고,
                  <br />
                  나에게 맞는 동물 추천과 유기 위험도 리포트를 함께 제공합니다.
                </p>

                <div className="hero__actions">
                  <button className="btn" onClick={() => navigate('/recommend')}>
                    지금 바로 설문하기
                  </button>
                </div>
              </div>
            )}

            <div className="hero__dots">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  className={`hero__dot ${slide === idx ? 'is-active' : ''}`}
                  onClick={() => setSlide(idx)}
                />
              ))}
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__visualMain">
              <img src={currentImage.src} alt={currentImage.alt} />
            </div>

            <p className="hero__visualCaption">
              {slide === 0 && (
                <>
                  해당 이미지는 실제 입양 대상 동물인 공고번호 <strong>428349202500501</strong>번
                  고양이의 사진을 개선한 이미지입니다.
                </>
              )}
              {slide === 1 && (
                <>
                  해당 이미지는 실제 입양 대상 동물인 공고번호 <strong>445479202500857</strong>번
                  강아지의 사진을 개선한 이미지입니다.
                </>
              )}
              {slide === 2 && (
                <>
                  해당 이미지는 실제 입양 대상 동물인 공고번호 <strong>444457202500527</strong>번
                  강아지의 사진을 개선한 이미지입니다.
                </>
              )}
            </p>

            <button
              className="hero__thumb hero__thumb--left"
              onClick={toPrev}
              aria-label="이전 슬라이드"
            >
              <img src={prevImage.src} alt={prevImage.alt} />
            </button>

            <button
              className="hero__thumb hero__thumb--right"
              onClick={toNext}
              aria-label="다음 슬라이드"
            >
              <img src={nextImage.src} alt={nextImage.alt} />
            </button>
          </div>
        </div>
      </section>
      {/* ================== 2. 통계 섹션 ================== */}
      <section
        id="site-intro"
        ref={statsRef}
        className={`section section--stats ${statsVisible ? 'is-visible' : ''}`}
      >
        <div className="section__inner">
          <div className="section__titleBlock">
            <h2>왜 &ldquo;첫인상 공작소&rdquo;가 필요한가요?</h2>
            <p>
              2017년부터 매년 발생하는 유기동물은 10만 마리 이상. 이 중 실제로 입양되는 동물은 약
              20%에 불과해요.
            </p>
          </div>

          <div className="stats__layout">
            <div className="stats__chart stats__chart--bar">
              <div className="statsBars">
                {/* 2016 */}
                <div className="statsBar">
                  <div className="statsBar__value">89,732</div>
                  <div className="statsBar__col" style={{ '--v': 0.74 }} />
                  <div className="statsBar__year">2016</div>
                </div>

                {/* 2017 */}
                <div className="statsBar">
                  <div className="statsBar__value">102,593</div>
                  <div className="statsBar__col" style={{ '--v': 0.85 }} />
                  <div className="statsBar__year">2017</div>
                </div>

                {/* 2018 */}
                <div className="statsBar">
                  <div className="statsBar__value">121,077</div>
                  <div className="statsBar__col statsBar__col--max" style={{ '--v': 1 }} />
                  <div className="statsBar__year">2018</div>
                </div>
              </div>

              <p className="stats__caption">
                2016년 이후 매년 10만 마리 이상의 유기동물이 발생하고 있어요.
              </p>
            </div>

            <div className="stats__chart stats__chart--pie">
              <div className="pie">
                <div className="pie__ring">
                  <div className="pie__value">20%</div>
                  <div className="pie__label">입양된 동물 비율</div>
                </div>
              </div>

              <div className="pieLegend">
                <div className="pieLegend__item">
                  <span className="pieLegend__dot pieLegend__dot--adopt" />
                  <span>입양된 동물</span>
                </div>
                <div className="pieLegend__item">
                  <span className="pieLegend__dot pieLegend__dot--remain" />
                  <span>그 외 (보호·안락사 등)</span>
                </div>
              </div>

              <p className="stats__caption">전체 유기동물 중 실제 입양 비율</p>
            </div>
          </div>
        </div>
      </section>
      {/* ================== 3. 목적 1 섹션 ================== */}
      <section
        ref={goal1Ref}
        className={`section section--goal ${goal1Visible ? 'is-visible' : ''}`}
      >
        <div className="section__inner">
          <h2>첫인상 공작소의 목적 ①</h2>
          <p className="section__lead">
            실제 보호소 동물의 모습을 더 많은 사람들에게 정확하게 보여주고, &ldquo;첫 인상&rdquo;을
            개선해 입양의 허들을 조금이라도 낮추는 것이 목표예요.
          </p>

          {/* 사진 2장 + 설명 레이아웃 */}
          <div className="goal1">
            {/* 왼쪽: 전/후 사진 2장 */}
            <div className="goal1__photos">
              <figure className="goal1__photo">
                <img src={beforeDogImg} alt="보호소에서 촬영된 원본 강아지 사진" />
                <figcaption>공고번호 경기-화성-2025-00922번 강아지의 보호소 사진1</figcaption>
              </figure>

              <figure className="goal1__photo">
                <img src={afterDogImg} alt="보정된 강아지 사진 예시" />
                <figcaption>공고번호 경기-화성-2025-00922번 강아지의 보호소 사진2</figcaption>
              </figure>
            </div>

            <div className="goal2__text">
              <p>
                이 두 장의 사진은 모두 <span className="goal1__highlight">같은 강아지</span>입니다.
                하지만 촬영 환경과 각도만 달라져도 보호소 동물의{' '}
                <span className="goal1__highlight">첫인상은 완전히 달라</span> 보입니다.
              </p>

              <p>
                국내외 사례에 따르면, 보호 동물을{' '}
                <span className="goal1__highlight">깨끗하고 정돈된 이미지</span>로 보여줄수록
                입양률이 실제로 상승합니다. 첫인상 공작소는 생성형 모델을 활용해{' '}
                <span className="goal1__highlight">동물의 고유한 모습은 그대로 유지</span>하면서,
                오염·어수선한 배경 등만 최소화한 사진으로 동물을 소개합니다. 이를 통해{' '}
                <span className="goal1__highlight">
                  보호소 동물의 ‘첫인상’을 개선하고 입양 기회를 늘리는 것
                </span>
                이 우리의 목표입니다.
              </p>
            </div>
          </div>

          <div className="section__cta">
            <button className="btn" onClick={() => navigate('/browse')}>
              지금 바로 입양하러 가기
            </button>
          </div>
        </div>
      </section>
      {/* ================== 4. 목적 2 섹션 ================== */}
      <section
        ref={goal2Ref}
        className={`section section--goal2 ${goal2Visible ? 'is-visible' : ''}`}
      >
        <div className="section__inner section__inner--split">
          <div className="goal2__mock">
            {/* 리포트 UI 예시 박스 */}
            <div className="reportMock reportMock--layout">
              {/* 왼쪽: 간단 매칭 카드 2개 */}
              <div className="reportMock__left">
                <div className="miniCard">
                  <div className="miniCard__rank">
                    <span className="miniCard__rankBadge">1위</span>
                  </div>
                  <div className="miniCard__img" />
                  <div className="miniCard__body">
                    <div className="miniCard__title">한국 고양이</div>
                    <div className="miniCard__meta">1살(60일 미만) · 경기도 광주시</div>

                    <div className="miniCard__stats">
                      <div>
                        <span className="miniCard__statLabel">취향 매칭</span>
                        <strong className="miniCard__statValue">54%</strong>
                      </div>
                      <div>
                        <span className="miniCard__statLabel">주거환경 적합도</span>
                        <strong className="miniCard__statValue">77%</strong>
                      </div>
                    </div>

                    <div className="miniCard__tags">
                      <span className="miniTag miniTag--primary">크기 적합도</span>
                      <span className="miniTag miniTag--primary">지역 근접성</span>
                      <span className="miniTag miniTag--danger">알레르기 위험</span>
                    </div>
                  </div>
                </div>

                <div className="miniCard miniCard--secondary">
                  <div className="miniCard__rank">
                    <span className="miniCard__rankBadge miniCard__rankBadge--sub">2위</span>
                  </div>
                  <div className="miniCard__img miniCard__img--dim" />
                  <div className="miniCard__body">
                    <div className="miniCard__title">한국 고양이</div>
                    <div className="miniCard__meta">1살(60일 미만) · 경기도 평택시</div>

                    <div className="miniCard__stats">
                      <div>
                        <span className="miniCard__statLabel">취향 매칭</span>
                        <strong className="miniCard__statValue">53%</strong>
                      </div>
                      <div>
                        <span className="miniCard__statLabel">주거환경 적합도</span>
                        <strong className="miniCard__statValue">77%</strong>
                      </div>
                    </div>

                    <div className="miniCard__tags">
                      <span className="miniTag miniTag--primary">크기 적합도</span>
                      <span className="miniTag miniTag--primary">지역 근접성</span>
                      <span className="miniTag miniTag--danger">알레르기 위험</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 오른쪽: 유기 위험도 리포트 패널 */}
              <div className="reportMock__right">
                <div className="riskPanel">
                  <h3 className="riskPanel__title">반려동물 유기 위험도 리포트</h3>

                  <div className="riskPanel__block">
                    <div className="riskPanel__row">
                      <span>유기 충동을 겪을 가능성</span>
                      <span className="riskPanel__percent">36%</span>
                    </div>
                    <div className="riskPanel__bar">
                      <div className="riskPanel__barFill" style={{ width: '36%' }} />
                    </div>
                    <div className="riskPanel__subValue">(0.3571)</div>
                  </div>

                  <div className="riskPanel__block">
                    <div className="riskPanel__label">전체 사용자 대비 안전 위치</div>
                    <div className="riskPanel__rankText">상위 57%</div>
                    <p className="riskPanel__desc">
                      기본적인 준비는 되어 있어요. 관심과 시간을 조금만 보태면 훨씬 더 좋은 보호자가
                      되실 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="goal2__text">
            <h2>첫인상 공작소의 목적 ②</h2>
            <p className="section__lead">
              설문 결과를 바탕으로 입양 희망자의 생활 환경과 성향을 분석하고, 유기 위험도 리포트와
              함께 &ldquo;나와 잘 맞는 동물&rdquo;을 추천해요.
            </p>
            <p>
              무조건 &ldquo;입양하세요&rdquo;가 아니라, 책임 있는 입양이 이루어질 수 있도록 입양 전
              고민 포인트와 주의사항을 리포트 형태로 안내합니다.
            </p>

            <div className="section__cta">
              <button className="btn" onClick={() => navigate('/recommend')}>
                지금 바로 설문하러 가기
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* ================== 5. 마지막 진입 카드 섹션 ================== */}
      <section
        ref={cardsRef}
        className={`section section--entryCards ${cardsVisible ? 'is-visible' : ''}`}
      >
        <div className="section__inner">
          <h2>첫인상 공작소, 어디서 시작할까요?</h2>
          <div className="entryCards">
            <button className="entryCard" onClick={() => navigate('/browse')}>
              <div className="entryCard__title">보호소</div>
              <p className="entryCard__desc">입양 대상 동물을 먼저 둘러볼게요.</p>
              <div className="entryCard__icon">→</div>
            </button>

            <button className="entryCard" onClick={() => navigate('/recommend')}>
              <div className="entryCard__title">반려동물 추천</div>
              <p className="entryCard__desc">나에게 맞는 동물을 설문으로 찾아보고 싶어요.</p>
              <div className="entryCard__icon">→</div>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
