import { useState } from 'react';
import productBoxImage from '@/src/assets/images/product_saengsik_box_1791342955488.jpg';
import { MAIN_PRODUCT } from '@/src/data/productData';

interface ProductOrderSectionProps {
  onOpenOrder: (quantity: number) => void;
}

export default function ProductOrderSection({ onOpenOrder }: ProductOrderSectionProps) {
  const [quantity, setQuantity] = useState(1);

  const totalPrice = MAIN_PRODUCT.salePrice * quantity;

  return (
    <section id="product" className="py-14 sm:py-24 bg-[#F5EFEB] border-b border-[#E8DFC8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <p className="text-base sm:text-lg font-bold text-[#2D6A4F] mb-2">
            정직하게 만든 단 하나의 생식
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1B4332] tracking-tight mb-4">
            상품 안내 및 주문
          </h2>
          <p className="text-lg sm:text-xl text-[#4A574C] leading-relaxed [text-wrap:balance]">
            1개월 동안 든든하게 드실 수 있는 30포 구성입니다.
          </p>
        </div>

        {/* Product Purchase Card */}
        <div className="bg-[#FFFFFF] rounded-3xl border-2 border-[#E1D6BD] overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Product Image Column */}
            <div className="lg:col-span-5 bg-[#FAF7F2] p-6 sm:p-10 flex flex-col justify-center items-center border-b lg:border-b-0 lg:border-r border-[#E8DFC8]">
              <div className="w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-[#E5DEC9] bg-[#EFE9DC] mb-4">
                <img
                  src={productBoxImage}
                  alt="자연온 50곡 순수생식 30포 박스 및 보틀"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full text-center">
                <span className="inline-block text-sm sm:text-base font-bold text-[#2D6A4F] bg-[#EAF2EC] px-4 py-1.5 rounded-full mb-2">
                  🎁 첫 주문 감사 이벤트
                </span>
                <p className="text-base sm:text-lg font-bold text-[#1B4332]">
                  {MAIN_PRODUCT.specialGift}
                </p>
              </div>
            </div>

            {/* Product Details & Purchase Form */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <p className="text-sm sm:text-base font-semibold text-[#576859] mb-1">
                  일반가공식품 (생식기타가공품)
                </p>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1B4332] mb-2 leading-tight">
                  {MAIN_PRODUCT.name}
                </h3>
                <p className="text-base sm:text-lg text-[#556356] mb-6">
                  {MAIN_PRODUCT.subtitle} · {MAIN_PRODUCT.capacity}
                </p>

                {/* Price Display */}
                <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-[#EBE3D0] mb-6">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-lg sm:text-xl line-through text-[#8E9B90]">
                      {MAIN_PRODUCT.originalPrice.toLocaleString()}원
                    </span>
                    <span className="text-sm sm:text-base font-bold text-[#D9534F] bg-[#FDF2F2] px-2 py-0.5 rounded">
                      {MAIN_PRODUCT.discountRate}% 할인
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1B4332] tabular-nums">
                      {MAIN_PRODUCT.salePrice.toLocaleString()}
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#1B4332]">
                      원
                    </span>
                    <span className="text-sm sm:text-base font-bold text-[#2D6A4F] ml-3">
                      ({MAIN_PRODUCT.shipping})
                    </span>
                  </div>
                </div>

                {/* Key Points */}
                <div className="space-y-2 mb-8">
                  {MAIN_PRODUCT.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-base sm:text-lg text-[#3E4C40]">
                      <span className="w-5 h-5 rounded-full bg-[#2D6A4F] text-white text-xs font-bold flex items-center justify-center shrink-0">
                        ✓
                      </span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center justify-between p-4 bg-[#F5EFEB] rounded-2xl border border-[#E3D8BF] mb-6">
                  <span className="text-lg sm:text-xl font-bold text-[#1B4332]">
                    주문 수량
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-11 h-11 rounded-xl bg-white text-[#1B4332] font-black text-xl border border-[#D7CCA9] disabled:opacity-40 hover:bg-[#FAF8F5] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                      aria-label="수량 감소"
                    >
                      -
                    </button>
                    <span className="text-2xl font-black text-[#1B4332] w-10 text-center tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      disabled={quantity >= 10}
                      className="w-11 h-11 rounded-xl bg-white text-[#1B4332] font-black text-xl border border-[#D7CCA9] disabled:opacity-40 hover:bg-[#FAF8F5] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                      aria-label="수량 증가"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-4 px-2">
                  <span className="text-lg font-bold text-[#4B5A4D]">총 결제 예정 금액</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#2D6A4F] tabular-nums">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenOrder(quantity)}
                  className="w-full py-5 text-xl sm:text-2xl font-extrabold text-white bg-[#2D6A4F] hover:bg-[#1B4332] active:scale-[0.98] transition-all rounded-2xl shadow-lg hover:shadow-xl cursor-pointer"
                >
                  주문하기
                </button>
                <p className="text-center text-xs sm:text-sm text-[#728373] mt-3">
                  평일 오후 2시 이전 주문 시 당일 무료 발송됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Spec Table */}
        <div className="mt-10 bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#E5DEC7] text-sm sm:text-base text-[#4E5D50]">
          <h4 className="font-bold text-[#1B4332] text-lg mb-4">
            식품위생법에 따른 상품 정보 고시
          </h4>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
            <div className="flex justify-between border-b border-[#F2ECE0] pb-2">
              <dt className="font-semibold text-[#1B4332]">식품의 유형</dt>
              <dd>생식기타가공품</dd>
            </div>
            <div className="flex justify-between border-b border-[#F2ECE0] pb-2">
              <dt className="font-semibold text-[#1B4332]">생산자 및 소재지</dt>
              <dd>자연온푸드 / 대한민국</dd>
            </div>
            <div className="flex justify-between border-b border-[#F2ECE0] pb-2">
              <dt className="font-semibold text-[#1B4332]">내용량</dt>
              <dd>900g (30g x 30포)</dd>
            </div>
            <div className="flex justify-between border-b border-[#F2ECE0] pb-2">
              <dt className="font-semibold text-[#1B4332]">원재료명 및 함량</dt>
              <dd>국내산 곡물·채소 50종 100%</dd>
            </div>
            <div className="flex justify-between border-b border-[#F2ECE0] pb-2">
              <dt className="font-semibold text-[#1B4332]">보관 방법</dt>
              <dd>직사광선을 피하고 서늘한 실온 보관</dd>
            </div>
            <div className="flex justify-between border-b border-[#F2ECE0] pb-2">
              <dt className="font-semibold text-[#1B4332]">소비자 상담실</dt>
              <dd>1588-0000</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-[#7B8B7C]">
            * 본 제품은 알레르기 유발 물질인 대두, 메밀을 함유하고 있으니 특이체질은 원료명을 확인 후 섭취하시기 바랍니다.
          </p>
        </div>
      </div>
    </section>
  );
}
