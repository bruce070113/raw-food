import { useAuth } from '@/src/contexts/AuthContext';

interface NavbarProps {
  onOpenOrder: () => void;
  onOpenAdmin: () => void;
  onOpenAuth: () => void;
}

export default function Navbar({ onOpenOrder, onOpenAdmin, onOpenAuth }: NavbarProps) {
  const { currentUser, nickname, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8DFC8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1B4332] flex items-center gap-2"
            aria-label="자연온 생식 홈으로 이동"
          >
            <span className="inline-block w-3.5 h-3.5 rounded-full bg-[#2D6A4F]"></span>
            자연온 생식
          </a>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-base font-semibold text-[#40534C]">
          <a
            href="#ingredients"
            className="hover:text-[#1B4332] transition-colors py-1"
          >
            50가지 원재료
          </a>
          <a
            href="#target-audience"
            className="hover:text-[#1B4332] transition-colors py-1"
          >
            추천 대상
          </a>
          <a
            href="#how-to-drink"
            className="hover:text-[#1B4332] transition-colors py-1"
          >
            섭취 방법
          </a>
          <a
            href="#product"
            className="hover:text-[#1B4332] transition-colors py-1"
          >
            상품 안내
          </a>
        </nav>

        {/* Zone 3: User Status & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Welcome Notice when logged in */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#EAF2EC] border border-[#CDE1D2] text-[#1B4332]">
                <span className="text-emerald-700 font-bold text-sm sm:text-base">🌿</span>
                <span className="text-sm sm:text-base font-extrabold tracking-tight">
                  {nickname || '쟌느'}님 환영합니다
                </span>
              </div>
              <button
                type="button"
                onClick={() => logout()}
                className="text-xs sm:text-sm font-semibold text-[#667768] hover:text-[#1B4332] px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
                title="로그아웃"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-3.5 py-2 text-xs sm:text-sm font-bold text-[#1B4332] bg-[#EFE9DC] hover:bg-[#E5DEC9] transition-colors rounded-xl border border-[#DCD1B9] cursor-pointer"
            >
              로그인 / 회원가입
            </button>
          )}

          {/* Admin orders shortcut for seller */}
          <button
            type="button"
            onClick={onOpenAdmin}
            className="px-3 py-2 text-xs sm:text-sm font-extrabold text-[#1B4332] bg-[#EFE9DC] hover:bg-[#E3D9C4] transition-colors rounded-xl border border-[#D5C9AF] cursor-pointer flex items-center gap-1.5"
            title="판매자 전용 주문관리 화면 열기"
          >
            <span>📦</span>
            <span className="hidden xs:inline">주문관리</span>
          </button>

          {/* Prominent Order Button */}
          <button
            type="button"
            onClick={onOpenOrder}
            className="px-4 sm:px-6 py-2.5 text-base sm:text-lg font-bold text-white bg-[#2D6A4F] hover:bg-[#1B4332] active:scale-[0.98] transition-all rounded-xl shadow-sm whitespace-nowrap cursor-pointer"
          >
            주문하기
          </button>
        </div>
      </div>
    </header>
  );
}
