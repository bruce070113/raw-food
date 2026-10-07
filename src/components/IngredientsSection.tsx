import { useState } from 'react';
import ingredientsImage from '@/src/assets/images/grains_ingredients_flatlay_1791342967998.jpg';
import { INGREDIENTS_50 } from '@/src/data/productData';

export default function IngredientsSection() {
  const [showAllIngredients, setShowAllIngredients] = useState(false);

  return (
    <section id="ingredients" className="py-14 sm:py-20 bg-[#FAF8F5] border-b border-[#E8DFC8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <p className="text-base sm:text-lg font-bold text-[#2D6A4F] mb-2">
            땅의 정직함을 그대로
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1B4332] tracking-tight mb-4">
            국내산 50가지 곡물과 채소
          </h2>
          <p className="text-lg sm:text-xl text-[#4A574C] leading-relaxed [text-wrap:balance]">
            수입산 원료 없이, 100% 대한민국 땅에서 수확한 통곡물과 제철 채소를
            선별하여 깨끗하게 세척하고 분말화했습니다.
          </p>
        </div>

        {/* Visual Showcase Card */}
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#E8DFC8] overflow-hidden shadow-xs mb-10 sm:mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="h-64 sm:h-80 md:h-auto relative bg-[#F5EFEB]">
              <img
                src={ingredientsImage}
                alt="국내산 통곡물과 신선한 채소 원재료"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-10 flex flex-col justify-center">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] mb-4">
                원물 고유의 담백함과 은은한 고소함
              </h3>
              <p className="text-base sm:text-lg text-[#4D5A4F] leading-relaxed mb-6">
                인공 향료나 당류를 첨가하지 않아도, 현미와 서리태, 흑미, 단호박 등
                원재료가 어우러져 마실수록 깊고 담백한 곡물 본연의 풍미가 입안에 감돕니다.
              </p>

              <div className="space-y-3 border-t border-[#EFE8D8] pt-5">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#EAF2EC] text-[#2D6A4F] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <div>
                    <p className="text-base sm:text-lg font-bold text-[#1B4332]">100% 국내산 원료 원칙</p>
                    <p className="text-sm sm:text-base text-[#617063]">원산지 증명 가능한 우리 농산물만 고집합니다.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#EAF2EC] text-[#2D6A4F] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <div>
                    <p className="text-base sm:text-lg font-bold text-[#1B4332]">영양 손실을 줄인 건조 공법</p>
                    <p className="text-sm sm:text-base text-[#617063]">열에 약한 원료의 특성을 고려해 부드럽게 가공했습니다.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 50 Ingredients Breakdown */}
        <div className="bg-[#F6F1E7] rounded-3xl p-6 sm:p-10 border border-[#E3D9C2]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#DDD2B8]">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1B4332]">
                50가지 자연 원재료 전성분
              </h3>
              <p className="text-sm sm:text-base text-[#556456] mt-1">
                모든 원료는 100% 국내산입니다. (일반식품 표시사항 기준 준수)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAllIngredients(!showAllIngredients)}
              className="px-5 py-2.5 bg-[#FFFFFF] hover:bg-[#F2ECE0] text-[#1B4332] text-sm sm:text-base font-bold rounded-xl border border-[#D5C9AF] transition-colors self-start sm:self-auto cursor-pointer"
            >
              {showAllIngredients ? '간략히 보기 ▲' : '50가지 원료 전체 펼쳐보기 ▼'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {INGREDIENTS_50.map((group, index) => (
              <div
                key={index}
                className="bg-[#FFFFFF]/90 p-5 sm:p-6 rounded-2xl border border-[#E6DEC9]"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base sm:text-lg font-bold text-[#1B4332]">
                    {group.category}
                  </h4>
                  <span className="text-xs sm:text-sm font-semibold text-[#2D6A4F]">
                    국내산 {group.count}종
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item, i) => (
                    <span
                      key={i}
                      className="inline-block text-sm sm:text-base text-[#3C493E] bg-[#F5EFEB] px-2.5 py-1 rounded-lg"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {showAllIngredients && (
            <div className="mt-6 p-5 bg-[#FFFFFF] rounded-2xl border border-[#D8CEB7] text-sm sm:text-base text-[#465448] leading-relaxed">
              <p className="font-bold text-[#1B4332] mb-1">전성분 안내문</p>
              <p>
                현미(국내산), 발아현미(국내산), 찹쌀(국내산), 찰흑미(국내산), 서리태(국내산), 백태(국내산), 보리(국내산), 늘보리(국내산), 수수(국내산), 기장(국내산), 조(국내산), 율무(국내산), 팥(국내산), 메밀(국내산), 귀리(국내산), 케일(국내산), 신선초(국내산), 시금치(국내산), 양배추(국내산), 브로콜리(국내산), 쑥(국내산), 미나리(국내산), 샐러리(국내산), 청경채(국내산), 돌미나리(국내산), 상추(국내산), 쑥갓(국내산), 깻잎(국내산), 당근(국내산), 우엉(국내산), 연근(국내산), 무(국내산), 순무(국내산), 도라지(국내산), 더덕(국내산), 마(국내산), 단호박(국내산), 늙은호박(국내산), 토마토(국내산), 사과(국내산), 배(국내산), 감(국내산), 표고버섯(국내산), 느타리버섯(국내산), 새송이버섯(국내산), 영지버섯(국내산), 미역(국내산), 다시마(국내산), 김(국내산), 파래(국내산)
              </p>
              <p className="mt-2 text-xs text-[#718072]">
                * 본 제품은 질병의 예방 및 치료를 위한 의약품이나 건강기능식품이 아닌 일반가공식품(생식기타가공품)입니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
