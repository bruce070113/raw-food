import heroImage from '@/src/assets/images/hero_raw_grain_meal_1791342940501.jpg';
import { useAuth } from '@/src/contexts/AuthContext';

interface HeroSectionProps {
  onOpenOrder: () => void;
}

export default function HeroSection({ onOpenOrder }: HeroSectionProps) {
  const { currentUser, nickname } = useAuth();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5EFEB] to-[#FAF8F5] pt-8 sm:pt-14 pb-14 sm:pb-20 border-b border-[#E8DFC8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto">
          {/* Welcome greeting banner if logged in */}
          {currentUser && (
            <div className="inline-flex items-center gap-2 bg-[#EAF2EC] border border-[#C4DDD0] px-4 py-1.5 rounded-full mb-4 shadow-xs">
              <span className="text-emerald-700">🌿</span>
              <span className="text-sm sm:text-base font-extrabold text-[#1B4332]">
                {nickname || '쟌느'}님 환영합니다! 오늘 하루도 든든한 50곡 생식과 함께하세요
              </span>
            </div>
          )}

          {/* Subtle text label without pill enclosure */}
          <p className="text-base sm:text-xl font-bold tracking-wide text-[#2D6A4F] mb-3">
            100% 국내산 50가지 곡물 · 채소 원료
          </p>

          {/* Prompt requested primary large catchphrase */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#1B4332] tracking-tight leading-[1.15] mb-5 sm:mb-7 [text-wrap:balance]">
            하루한잔, 간편한 한끼
          </h1>

          {/* Subtext highlighting pure ingredients & convenience */}
          <p className="text-xl sm:text-2xl text-[#3D4A3E] font-medium leading-relaxed mb-8 sm:mb-10 max-w-2xl mx-auto [text-wrap:balance]">
            바쁜 일상 속, 물이나 우유에 흔들어 마시는 든든한 식사.<br className="hidden sm:inline" />
            자연 그대로 담아 속이 편안하고 구수한 곡물 본연의 맛을 전합니다.
          </p>

          {/* Prompt requested large "주문하기" button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 sm:mb-14">
            <button
              type="button"
              onClick={onOpenOrder}
              className="w-full sm:w-auto min-w-[240px] px-10 py-5 text-xl sm:text-2xl font-extrabold text-white bg-[#2D6A4F] hover:bg-[#1B4332] active:scale-[0.98] transition-all rounded-2xl shadow-lg hover:shadow-xl cursor-pointer"
            >
              주문하기
            </button>
            <a
              href="#ingredients"
              className="w-full sm:w-auto px-8 py-5 text-lg sm:text-xl font-bold text-[#1B4332] bg-[#E8E2D4] hover:bg-[#DDD6C5] transition-colors rounded-2xl text-center"
            >
              원재료 살펴보기
            </a>
          </div>
        </div>

        {/* Hero Visual Presentation */}
        <div className="relative rounded-3xl overflow-hidden shadow-md border border-[#E2D9C5] bg-[#EFE9DC] aspect-[16/9] sm:aspect-[21/9] max-w-4xl mx-auto">
          <img
            src={heroImage}
            alt="국내산 곡물과 신선한 채소로 만든 생식 음료"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent flex items-end p-5 sm:p-8">
            <div className="text-white">
              <p className="text-sm sm:text-base font-medium opacity-90 mb-1">
                자연 건조 분말 · 무가당 · 무착향료
              </p>
              <p className="text-xl sm:text-2xl font-bold tracking-tight">
                자연온 50곡 순수생식
              </p>
            </div>
          </div>
        </div>

        {/* 3 Core Highlights (Text-based, clean, highly readable) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 max-w-4xl mx-auto">
          <div className="bg-[#FFFFFF]/90 p-6 rounded-2xl border border-[#EAE3D2] text-center shadow-xs">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#2D6A4F] mb-1">
              국내산 50종
            </p>
            <p className="text-base sm:text-lg font-bold text-[#1B4332] mb-1">
              곡물 & 채소 가득
            </p>
            <p className="text-sm sm:text-base text-[#59655A] leading-normal">
              우리 땅에서 자란 통곡물, 채소, 버섯, 해조류
            </p>
          </div>

          <div className="bg-[#FFFFFF]/90 p-6 rounded-2xl border border-[#EAE3D2] text-center shadow-xs">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#2D6A4F] mb-1">
              단 30초
            </p>
            <p className="text-base sm:text-lg font-bold text-[#1B4332] mb-1">
              물이나 우유에 쏙
            </p>
            <p className="text-sm sm:text-base text-[#59655A] leading-normal">
              이지컷 1포를 넣고 흔들면 바로 완성
            </p>
          </div>

          <div className="bg-[#FFFFFF]/90 p-6 rounded-2xl border border-[#EAE3D2] text-center shadow-xs">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#2D6A4F] mb-1">
              0% 무첨가
            </p>
            <p className="text-base sm:text-lg font-bold text-[#1B4332] mb-1">
              자연 원료 고소함
            </p>
            <p className="text-sm sm:text-base text-[#59655A] leading-normal">
              합성보존료, 색소, 인공향료 일체 배제
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
