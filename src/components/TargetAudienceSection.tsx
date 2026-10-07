import { TARGET_AUDIENCE } from '@/src/data/productData';

interface TargetAudienceSectionProps {
  onOpenOrder: () => void;
}

export default function TargetAudienceSection({ onOpenOrder }: TargetAudienceSectionProps) {
  return (
    <section id="target-audience" className="py-14 sm:py-20 bg-[#F5EFEB] border-b border-[#E8DFC8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <p className="text-base sm:text-lg font-bold text-[#2D6A4F] mb-2">
            간편하고 든든한 일상
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1B4332] tracking-tight mb-4">
            이런 분들께 좋아요
          </h2>
          <p className="text-lg sm:text-xl text-[#4A574C] leading-relaxed [text-wrap:balance]">
            복잡한 준비 없이, 일상에서 간편하게 식사를 챙기고 싶을 때 추천합니다.
          </p>
        </div>

        {/* 3 Prominent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-14">
          {TARGET_AUDIENCE.map((item) => (
            <div
              key={item.id}
              className="bg-[#FFFFFF] rounded-3xl p-7 sm:p-8 border border-[#E3D9C4] shadow-xs flex flex-col justify-between hover:border-[#2D6A4F]/40 transition-colors"
            >
              <div>
                {/* Large numbering */}
                <div className="text-3xl sm:text-4xl font-black text-[#2D6A4F]/30 mb-4">
                  0{item.id}
                </div>

                <h3 className="text-2xl sm:text-2xl font-extrabold text-[#1B4332] leading-snug mb-2">
                  {item.title}
                </h3>

                <p className="text-base sm:text-lg font-bold text-[#2D6A4F] mb-4">
                  {item.subtitle}
                </p>

                <p className="text-base sm:text-lg text-[#526053] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F2ECE0] flex items-center gap-2 text-sm sm:text-base font-semibold text-[#1B4332]">
                <span className="w-2 h-2 rounded-full bg-[#2D6A4F]"></span>
                <span>하루 한 포 간편 식사 대용</span>
              </div>
            </div>
          ))}
        </div>

        {/* Encouraging CTA Box */}
        <div className="bg-[#FAF8F5] rounded-3xl p-8 sm:p-10 border border-[#E5DCB7] text-center max-w-3xl mx-auto">
          <p className="text-xl sm:text-2xl font-extrabold text-[#1B4332] mb-3">
            오늘 아침, 굶지 말고 생식 한 잔으로 든든하게 시작하세요
          </p>
          <p className="text-base sm:text-lg text-[#556457] mb-6">
            보틀에 붓고 흔들면 30초 만에 속 편한 한 끼가 완성됩니다.
          </p>
          <button
            type="button"
            onClick={onOpenOrder}
            className="w-full sm:w-auto px-8 py-4 text-lg sm:text-xl font-extrabold text-white bg-[#2D6A4F] hover:bg-[#1B4332] active:scale-[0.98] transition-all rounded-2xl shadow-md cursor-pointer"
          >
            지금 바로 주문하기
          </button>
        </div>
      </div>
    </section>
  );
}
