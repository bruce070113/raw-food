import { PREPARATION_STEPS } from '@/src/data/productData';

export default function HowToDrinkSection() {
  return (
    <section id="how-to-drink" className="py-14 sm:py-20 bg-[#FAF8F5] border-b border-[#E8DFC8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <p className="text-base sm:text-lg font-bold text-[#2D6A4F] mb-2">
            단 30초면 완성되는 간편함
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1B4332] tracking-tight mb-4">
            물이나 우유에 타서 드세요
          </h2>
          <p className="text-lg sm:text-xl text-[#4A574C] leading-relaxed [text-wrap:balance]">
            불이나 조리기구 없이, 언제 어디서나 간편하게 완성됩니다.
          </p>
        </div>

        {/* 1 -> 2 -> 3 Sequence Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative mb-12 sm:mb-16">
          {PREPARATION_STEPS.map((step, index) => (
            <div
              key={step.step}
              className="bg-[#FFFFFF] rounded-3xl p-7 sm:p-8 border-2 border-[#E5DCC5] shadow-xs relative flex flex-col justify-between"
            >
              <div>
                {/* Step indicator header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#2D6A4F] text-white flex items-center justify-center font-black text-2xl shadow-xs">
                    {step.step}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#2D6A4F] bg-[#EAF2EC] px-3 py-1 rounded-full">
                    STEP 0{step.step}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-2xl font-extrabold text-[#1B4332] mb-3">
                  {step.title}
                </h3>

                <p className="text-lg sm:text-xl font-bold text-[#354336] leading-relaxed mb-4">
                  {step.action}
                </p>
              </div>

              {/* Useful tip box */}
              <div className="mt-4 p-4 rounded-2xl bg-[#F6F1E7] border border-[#E8DFC8]">
                <p className="text-xs sm:text-sm font-extrabold text-[#1B4332] mb-1">
                  💡 섭취 팁
                </p>
                <p className="text-sm sm:text-base text-[#576458] leading-normal">
                  {step.tip}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Taste Pairing Guide */}
        <div className="bg-[#EFE9DC] rounded-3xl p-6 sm:p-10 border border-[#DDD3BC]">
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#1B4332] text-center mb-6">
            기호에 맞게 선택해보세요
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E3D8BF] text-center">
              <span className="text-3xl mb-2 block">💧</span>
              <p className="text-lg font-bold text-[#1B4332] mb-1">시원한 물 200ml</p>
              <p className="text-sm sm:text-base text-[#5C6A5D]">
                곡물과 채소 본연의 맑고 깔끔한 맛을 즐기실 때
              </p>
            </div>
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E3D8BF] text-center">
              <span className="text-3xl mb-2 block">🥛</span>
              <p className="text-lg font-bold text-[#1B4332] mb-1">우유 또는 두유 200ml</p>
              <p className="text-sm sm:text-base text-[#5C6A5D]">
                더욱 진하고 부드러운 고소함과 묵직한 포만감
              </p>
            </div>
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E3D8BF] text-center">
              <span className="text-3xl mb-2 block">🍯</span>
              <p className="text-lg font-bold text-[#1B4332] mb-1">꿀 or 조청 반 스푼</p>
              <p className="text-sm sm:text-base text-[#5C6A5D]">
                달콤하고 친숙한 미숫가루 느낌으로 드실 때
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
