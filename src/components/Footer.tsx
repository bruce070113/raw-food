interface FooterProps {
  onOpenAdmin?: () => void;
}

export default function Footer({ onOpenAdmin }: FooterProps) {
  return (
    <footer className="bg-[#EFE8DC] border-t border-[#DFD5BF] py-12 pb-24 md:pb-12 text-[#516053]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8 pb-8 border-b border-[#D7CCA9]">
          <div>
            <p className="text-2xl font-extrabold text-[#1B4332] mb-2">자연온 생식</p>
            <p className="text-base text-[#445246] max-w-md">
              자연에서 거둔 국내산 50가지 곡물과 채소 그대로, 매일 아침 간편하고 든든한 일상을 선물합니다.
            </p>
          </div>

          <div className="text-sm space-y-1">
            <p className="font-bold text-[#1B4332] text-base mb-1">고객 상담 및 주문 안내</p>
            <p className="text-lg font-extrabold text-[#2D6A4F]">080-123-4567</p>
            <p>평일 09:00 - 18:00 (점심시간 12:00 - 13:00 / 주말·공휴일 휴무)</p>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="mt-2 text-xs font-bold text-[#1B4332] underline hover:text-[#2D6A4F] cursor-pointer"
              >
                [사장님 전용] 실시간 주문 접수 내역 확인하기 →
              </button>
            )}
          </div>
        </div>

        <div className="text-xs sm:text-sm text-[#738475] space-y-2">
          <p>
            상호명: 자연온푸드 주식회사 · 대표: 송은정 · 사업자등록번호: 123-45-67890 · 통신판매업신고: 제2026-서울강남-01234호
          </p>
          <p>
            소재지: 서울특별시 서초구 자연대로 50번길 12, 자연온빌딩 4층
          </p>
          <p className="text-[#849586] pt-2">
            ※ 안내: 본 제품은 질병의 예방 및 치료를 위한 의약품이나 건강기능식품이 아니며, 국내산 곡물과 채소를 동결건조한 일반가공식품(생식기타식품)입니다.
          </p>
          <p className="pt-2 text-xs">
            © 2026 자연온 생식. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
