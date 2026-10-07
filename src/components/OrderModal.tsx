import { useState, useEffect } from 'react';
import { MAIN_PRODUCT } from '@/src/data/productData';
import { createRealOrder, OrderItem, PAYMENT_METHOD_LABELS } from '@/src/services/orderService';
import { useAuth } from '@/src/contexts/AuthContext';

interface OrderModalProps {
  isOpen: boolean;
  initialQuantity?: number;
  onClose: () => void;
  onOrderCreated?: (order: OrderItem) => void;
}

type OrderStep = 'SHIPPING_INFO' | 'MOCK_PAYMENT' | 'COMPLETED';

export default function OrderModal({ isOpen, initialQuantity = 1, onClose, onOrderCreated }: OrderModalProps) {
  const { nickname } = useAuth();
  const [currentStep, setCurrentStep] = useState<OrderStep>('SHIPPING_INFO');

  // Shipping & Order form fields
  const [quantity, setQuantity] = useState(initialQuantity);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('문 앞에 놓아주세요');

  // Payment method selection: card, kakaopay, naverpay, tosspay, bank
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'kakaopay' | 'naverpay' | 'tosspay' | 'bank'>('card');
  
  // Card input fields with pre-filled test values requested by user
  const [cardNumber, setCardNumber] = useState('1111-2222-3333-4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('777');
  const [cardCompany, setCardCompany] = useState('국민카드');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<OrderItem | null>(null);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; address?: string; general?: string }>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('SHIPPING_INFO');
      setQuantity(initialQuantity);
      setCreatedOrder(null);
      setErrors({});
      setCopied(false);
      setCardNumber('1111-2222-3333-4444');
      setPaymentMethod('card');
      
      // Pre-fill name with user's nickname/displayName
      if (nickname) {
        setName((prev) => prev || nickname);
      }
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialQuantity, nickname]);

  if (!isOpen) return null;

  const totalPrice = MAIN_PRODUCT.salePrice * quantity;

  // Step 1 -> Step 2 validation
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; phone?: string; address?: string } = {};

    if (!name.trim()) {
      newErrors.name = '받는 분 성함을 입력해주세요.';
    }
    if (!phone.trim()) {
      newErrors.phone = '연락처(휴대폰 번호)를 입력해주세요.';
    }
    if (!address.trim()) {
      newErrors.address = '배송받으실 주소를 입력해주세요.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep('MOCK_PAYMENT');
  };

  // Step 2 -> Step 3: Execute Mock Payment and create real database record
  const handleExecutePayment = async () => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const order = await createRealOrder({
        customerName: name,
        customerPhone: phone,
        address: address,
        addressDetail: addressDetail,
        deliveryNote: deliveryNote,
        productName: MAIN_PRODUCT.name,
        quantity: quantity,
        unitPrice: MAIN_PRODUCT.salePrice,
        totalPrice: totalPrice,
        paymentMethod: paymentMethod,
      });

      setCreatedOrder(order);
      setCurrentStep('COMPLETED');
      if (onOrderCreated) {
        onOrderCreated(order);
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      setErrors({
        general: '결제 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOrderSummaryText = () => {
    if (!createdOrder) return '';
    return `[자연온 생식 주문완료]\n주문번호: ${createdOrder.orderNumber}\n상품: ${createdOrder.productName} (${createdOrder.quantity}박스)\n금액: ${createdOrder.totalPrice.toLocaleString()}원\n결제수단: ${PAYMENT_METHOD_LABELS[createdOrder.paymentMethod]}\n받는분: ${createdOrder.customerName} (${createdOrder.customerPhone})\n배송지: ${createdOrder.address} ${createdOrder.addressDetail}\n요청사항: ${createdOrder.deliveryNote}`;
  };

  const handleCopyOrder = () => {
    navigator.clipboard.writeText(getOrderSummaryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div className="bg-[#FAF8F5] rounded-3xl w-full max-w-lg border-2 border-[#E5DEC9] shadow-2xl overflow-hidden my-4 max-h-[95vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="px-6 py-4.5 bg-[#F5EFEB] border-b border-[#E3D9C4] flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#2D6A4F] bg-[#EAF2EC] px-2 py-0.5 rounded-full">
                {currentStep === 'SHIPPING_INFO' && '1단계: 배송정보'}
                {currentStep === 'MOCK_PAYMENT' && '2단계: 가짜 결제'}
                {currentStep === 'COMPLETED' && '주문완료'}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1B4332]">
                {currentStep === 'SHIPPING_INFO' && '생식 주문서 작성'}
                {currentStep === 'MOCK_PAYMENT' && '연습용 결제하기'}
                {currentStep === 'COMPLETED' && '주문완료'}
              </h3>
            </div>
            <p className="text-xs text-[#5D6D5F] mt-0.5">
              {currentStep === 'MOCK_PAYMENT' ? '실제 돈이 빠져나가지 않는 안전한 모의 결제' : '100% 국내산 50곡 순수생식'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white text-[#4A574C] hover:text-[#1B4332] text-xl font-bold flex items-center justify-center border border-[#E0D5BE] transition-colors cursor-pointer shrink-0"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          {/* ================= STEP 1: SHIPPING INFO ================= */}
          {currentStep === 'SHIPPING_INFO' && (
            <form onSubmit={handleProceedToPayment} className="space-y-5">
              {/* Product Info Card */}
              <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-base sm:text-lg text-[#1B4332]">
                    {MAIN_PRODUCT.name}
                  </p>
                  <p className="text-xs sm:text-sm text-[#677769]">
                    30포 (1개월분) + 트라이탄 보틀 무료 증정
                  </p>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-[#F5EFEB] text-[#1B4332] font-black text-base border border-[#DDD3BC] flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold text-base text-[#1B4332] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-8 h-8 rounded-lg bg-[#F5EFEB] text-[#1B4332] font-black text-base border border-[#DDD3BC] flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#1B4332] mb-1">
                    받는 분 성함 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="예: 쟌느"
                    className="w-full px-4 py-3 text-base bg-white border border-[#DDD3BC] rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 text-[#242A24]"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#1B4332] mb-1">
                    휴대폰 번호 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="예: 010-1234-5678"
                    className="w-full px-4 py-3 text-base bg-white border border-[#DDD3BC] rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 text-[#242A24]"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#1B4332] mb-1">
                    배송지 주소 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="기본 주소 (예: 서울특별시 서초구 자연대로 123)"
                    className="w-full px-4 py-3 text-base bg-white border border-[#DDD3BC] rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 text-[#242A24] mb-2"
                  />
                  <input
                    type="text"
                    value={addressDetail}
                    onChange={(e) => setAddressDetail(e.target.value)}
                    placeholder="상세 주소 (동, 호수 등)"
                    className="w-full px-4 py-3 text-base bg-white border border-[#DDD3BC] rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 text-[#242A24]"
                  />
                  {errors.address && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#1B4332] mb-1">
                    배송 요청사항
                  </label>
                  <select
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                    className="w-full px-4 py-3 text-base bg-white border border-[#DDD3BC] rounded-xl focus:outline-none focus:border-[#2D6A4F] text-[#242A24]"
                  >
                    <option value="문 앞에 놓아주세요">문 앞에 놓아주세요</option>
                    <option value="배송 전 미리 연락 바랍니다">배송 전 미리 연락 바랍니다</option>
                    <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
                    <option value="택배함에 보관해주세요">택배함에 보관해주세요</option>
                  </select>
                </div>
              </div>

              {/* Price & Next Step Button */}
              <div className="pt-2 border-t border-[#E3D9C4]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base font-bold text-[#4B5A4D]">
                    결제 예정 금액 ({quantity}박스)
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-[#2D6A4F] tabular-nums">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 text-xl font-extrabold text-white bg-[#2D6A4F] hover:bg-[#1B4332] active:scale-[0.98] transition-all rounded-2xl shadow-lg cursor-pointer"
                >
                  다음: 결제하기 (연습용) →
                </button>
              </div>
            </form>
          )}

          {/* ================= STEP 2: MOCK PAYMENT SCREEN ================= */}
          {currentStep === 'MOCK_PAYMENT' && (
            <div className="space-y-5">
              {/* Big Notice Banner: "실제로 결제되지 않는 연습용 입니다" */}
              <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl text-center shadow-xs">
                <p className="text-base sm:text-lg font-black text-amber-900 flex items-center justify-center gap-1.5">
                  <span className="text-xl">⚠️</span>
                  <span>실제로 결제되지 않는 연습용 입니다</span>
                </p>
                <p className="text-xs sm:text-sm text-amber-700 font-medium mt-1">
                  실제 카드 승인이나 계좌 출금이 발생하지 않으니 안심하고 테스트하세요!
                </p>
              </div>

              {/* Order Summary Recap */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5DCB7] space-y-2 text-sm">
                <div className="flex justify-between border-b border-[#F5EFEB] pb-2">
                  <span className="text-[#647565]">주문 상품</span>
                  <span className="font-bold text-[#1B4332]">{MAIN_PRODUCT.name} x {quantity}박스</span>
                </div>
                <div className="flex justify-between border-b border-[#F5EFEB] pb-2">
                  <span className="text-[#647565]">받는 분 / 주소</span>
                  <span className="font-medium text-[#242A24] text-right truncate max-w-[220px]">
                    {name} ({address})
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-bold text-[#1B4332]">최종 결제 금액</span>
                  <span className="text-2xl font-black text-[#2D6A4F] tabular-nums">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* Payment Methods Selection */}
              <div>
                <label className="block text-sm font-bold text-[#1B4332] mb-2">
                  결제 수단 선택
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  {/* Credit Card */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      paymentMethod === 'card'
                        ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-sm'
                        : 'bg-white text-[#384639] border-[#DDD3BC] hover:bg-[#F9F6F0]'
                    }`}
                  >
                    <span className="text-lg">💳</span>
                    <span className="text-xs font-extrabold">신용/체크카드</span>
                  </button>

                  {/* Kakao Pay */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('kakaopay')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      paymentMethod === 'kakaopay'
                        ? 'bg-[#FEE500] text-[#191919] border-[#FEE500] font-black shadow-sm ring-2 ring-[#FEE500]/50'
                        : 'bg-white text-[#384639] border-[#DDD3BC] hover:bg-[#F9F6F0]'
                    }`}
                  >
                    <span className="text-lg">🟡</span>
                    <span className="text-xs font-extrabold">카카오페이</span>
                  </button>

                  {/* Naver Pay */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('naverpay')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      paymentMethod === 'naverpay'
                        ? 'bg-[#03C75A] text-white border-[#03C75A] font-black shadow-sm'
                        : 'bg-white text-[#384639] border-[#DDD3BC] hover:bg-[#F9F6F0]'
                    }`}
                  >
                    <span className="text-lg">🟢</span>
                    <span className="text-xs font-extrabold">네이버페이</span>
                  </button>

                  {/* Toss Pay */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('tosspay')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      paymentMethod === 'tosspay'
                        ? 'bg-[#0064FF] text-white border-[#0064FF] font-black shadow-sm'
                        : 'bg-white text-[#384639] border-[#DDD3BC] hover:bg-[#F9F6F0]'
                    }`}
                  >
                    <span className="text-lg">🔵</span>
                    <span className="text-xs font-extrabold">토스페이</span>
                  </button>
                </div>
              </div>

              {/* PAYMENT DETAILS PANEL ACCORDING TO SELECTION */}

              {/* 1. Credit Card (Pre-filled 1111-2222-3333-4444) */}
              {paymentMethod === 'card' && (
                <div className="bg-white p-5 rounded-2xl border border-[#DDD3BC] space-y-3.5 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE0]">
                    <span className="font-bold text-sm text-[#1B4332]">가상 신용카드 정보</span>
                    <select
                      value={cardCompany}
                      onChange={(e) => setCardCompany(e.target.value)}
                      className="text-xs font-bold bg-[#F5EFEB] border border-[#D5C9AF] rounded-lg px-2.5 py-1 text-[#1B4332]"
                    >
                      <option value="국민카드">국민카드</option>
                      <option value="신한카드">신한카드</option>
                      <option value="현대카드">현대카드</option>
                      <option value="삼성카드">삼성카드</option>
                      <option value="농협카드">농협카드</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B4332] mb-1">
                      카드번호 (연습용 번호 자동 입력됨)
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1111-2222-3333-4444"
                      className="w-full px-4 py-2.5 font-mono text-base font-bold bg-[#FAF8F5] border-2 border-[#2D6A4F]/40 rounded-xl focus:outline-none focus:border-[#2D6A4F] text-[#1B4332]"
                    />
                    <p className="text-[11px] text-[#2D6A4F] font-semibold mt-1">
                      ✓ 연습용 가상 번호(1111-2222-3333-4444)가 안전하게 세팅되어 있습니다.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1B4332] mb-1">
                        유효기간
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 text-sm font-mono bg-[#FAF8F5] border border-[#DDD3BC] rounded-xl text-[#242A24]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1B4332] mb-1">
                        CVC (3자리)
                      </label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="777"
                        className="w-full px-3 py-2 text-sm font-mono bg-[#FAF8F5] border border-[#DDD3BC] rounded-xl text-[#242A24]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Kakao Pay */}
              {paymentMethod === 'kakaopay' && (
                <div className="bg-[#FFFDE6] p-5 rounded-2xl border-2 border-[#FEE500] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#FEE500] flex items-center justify-center font-black text-xs text-black">
                      K
                    </span>
                    <span className="font-black text-base text-[#191919]">카카오페이 간편결제 (연습용)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#4E4400] leading-relaxed">
                    카카오페이 머니 / 등록된 카드로 결제하는 가상 시뮬레이션입니다.<br />
                    실제 결제창 연결 없이 <strong>"결제하기"</strong> 버튼을 누르면 즉시 가짜 결제가 승인됩니다.
                  </p>
                </div>
              )}

              {/* 3. Naver Pay */}
              {paymentMethod === 'naverpay' && (
                <div className="bg-[#EBFBF3] p-5 rounded-2xl border-2 border-[#03C75A] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#03C75A] flex items-center justify-center font-black text-xs text-white">
                      N
                    </span>
                    <span className="font-black text-base text-[#02441F]">네이버페이 간편결제 (연습용)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#055728] leading-relaxed">
                    네이버페이 포인트 / 간편 머니로 결제하는 가상 시뮬레이션입니다.<br />
                    실제 비용 발생 없이 안전하게 주문 테스트가 진행됩니다.
                  </p>
                </div>
              )}

              {/* 4. Toss Pay */}
              {paymentMethod === 'tosspay' && (
                <div className="bg-[#EFF6FF] p-5 rounded-2xl border-2 border-[#0064FF] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#0064FF] flex items-center justify-center font-black text-xs text-white">
                      T
                    </span>
                    <span className="font-black text-base text-[#00388F]">토스페이 간편결제 (연습용)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#1E429F] leading-relaxed">
                    토스 원클릭 송금 및 체크카드로 결제하는 가상 시뮬레이션입니다.<br />
                    실제 토스 계좌 출금 없이 가상 주문번호가 생성됩니다.
                  </p>
                </div>
              )}

              {/* General error message if any */}
              {errors.general && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  {errors.general}
                </div>
              )}

              {/* Action Buttons: Back + Execute Mock Payment */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep('SHIPPING_INFO')}
                  disabled={isSubmitting}
                  className="w-full sm:w-1/3 py-3.5 px-4 text-base font-bold text-[#4B5A4D] bg-[#EFE9DC] hover:bg-[#E5DEC9] rounded-2xl transition-all cursor-pointer text-center"
                >
                  ← 배송정보 수정
                </button>

                <button
                  type="button"
                  onClick={handleExecutePayment}
                  disabled={isSubmitting}
                  className="w-full sm:w-2/3 py-4 sm:py-4.5 text-lg sm:text-xl font-extrabold text-white bg-[#2D6A4F] hover:bg-[#1B4332] active:scale-[0.98] disabled:opacity-50 transition-all rounded-2xl shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>연습 결제 승인 중...</span>
                    </>
                  ) : (
                    `${totalPrice.toLocaleString()}원 결제하기 (연습용)`
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: ORDER COMPLETED SCREEN ================= */}
          {currentStep === 'COMPLETED' && createdOrder && (
            <div className="space-y-5">
              {/* Completed Hero */}
              <div className="text-center py-2">
                <div className="w-16 h-16 rounded-full bg-[#EAF2EC] text-[#2D6A4F] text-3xl font-black flex items-center justify-center mx-auto mb-3 shadow-xs">
                  ✓
                </div>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] mb-1">
                  주문완료
                </h4>
                <p className="text-sm text-[#5E6D60]">
                  가상 결제가 승인되고 주문이 성공적으로 접수되었습니다!
                </p>
              </div>

              {/* Order Number Callout (Format: ORD-20261001-3843) */}
              <div className="p-4 bg-[#F5EFEB] border-2 border-[#2D6A4F]/30 rounded-2xl text-center">
                <p className="text-xs font-bold text-[#5F7061] mb-1">
                  발급된 공식 주문번호
                </p>
                <p className="text-xl sm:text-2xl font-black font-mono text-[#1B4332] tracking-wider">
                  {createdOrder.orderNumber}
                </p>
              </div>

              {/* Receipt Summary */}
              <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] space-y-3 text-sm sm:text-base">
                <div className="flex justify-between border-b border-[#F2ECE0] pb-2">
                  <span className="font-bold text-[#1B4332]">주문 상품</span>
                  <span className="font-semibold text-right">{createdOrder.productName} ({createdOrder.quantity}박스)</span>
                </div>
                <div className="flex justify-between border-b border-[#F2ECE0] pb-2">
                  <span className="font-bold text-[#1B4332]">최종 결제 금액</span>
                  <span className="font-black text-[#2D6A4F] text-lg tabular-nums">
                    {createdOrder.totalPrice.toLocaleString()}원 (무료 배송)
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#F2ECE0] pb-2">
                  <span className="font-bold text-[#1B4332]">결제 수단</span>
                  <span className="font-medium text-[#242A24]">
                    {PAYMENT_METHOD_LABELS[createdOrder.paymentMethod]}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#F2ECE0] pb-2">
                  <span className="font-bold text-[#1B4332]">받는 분</span>
                  <span>{createdOrder.customerName} ({createdOrder.customerPhone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-[#1B4332] shrink-0 mr-2">배송 주소</span>
                  <span className="text-right text-[#4D5A4F]">{createdOrder.address} {createdOrder.addressDetail}</span>
                </div>
              </div>

              {/* Safe Notice */}
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl text-center">
                ※ 본 주문은 <strong>연습용 가짜 결제</strong>이므로 실제로 금액이 청구되지 않았습니다.
              </div>

              {/* Quick Communication Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleCopyOrder}
                  className="py-3 px-3 bg-white hover:bg-[#F8F5EE] text-[#1B4332] font-bold text-xs sm:text-sm border border-[#DDD3BC] rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{copied ? '✓ 복사되었습니다' : '📋 주문내역 복사'}</span>
                </button>
                <a
                  href={`sms:01012345678?body=${encodeURIComponent(getOrderSummaryText())}`}
                  className="py-3 px-3 bg-[#EAF2EC] hover:bg-[#DCEADA] text-[#2D6A4F] font-bold text-xs sm:text-sm border border-[#C5DDCB] rounded-xl transition-colors flex items-center justify-center gap-1.5 text-center"
                >
                  <span>💬 사장님께 문자 전송</span>
                </a>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-4 text-lg font-extrabold text-white bg-[#2D6A4F] hover:bg-[#1B4332] rounded-2xl transition-all cursor-pointer shadow-md"
              >
                주문 확인 및 닫기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
