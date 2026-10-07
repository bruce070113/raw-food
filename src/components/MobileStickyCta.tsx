import { MAIN_PRODUCT } from '@/src/data/productData';

interface MobileStickyCtaProps {
  onOpenOrder: () => void;
}

export default function MobileStickyCta({ onOpenOrder }: MobileStickyCtaProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E8DFC8] px-4 py-3 shadow-lg">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div>
          <p className="text-xs text-[#58685B] font-medium">100% 국내산 50곡</p>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-[#1B4332] tabular-nums">
              {MAIN_PRODUCT.salePrice.toLocaleString()}원
            </span>
            <span className="text-xs text-[#2D6A4F] font-bold">무료배송</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenOrder}
          className="px-7 py-3 text-lg font-extrabold text-white bg-[#2D6A4F] hover:bg-[#1B4332] active:scale-[0.98] transition-all rounded-xl shadow-md whitespace-nowrap cursor-pointer"
        >
          주문하기
        </button>
      </div>
    </div>
  );
}
