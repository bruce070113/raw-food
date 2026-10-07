import { useState, useEffect, useRef } from 'react';
import {
  OrderItem,
  subscribeOrders,
  updateOrderStatus,
  STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
} from '@/src/services/orderService';

interface SellerOrderManagementProps {
  onBackToStore: () => void;
}

export default function SellerOrderManagement({ onBackToStore }: SellerOrderManagementProps) {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [newOrderAlert, setNewOrderAlert] = useState<string | null>(null);

  const prevOrderCount = useRef<number | null>(null);

  useEffect(() => {
    setLoading(true);
    // Real-time Firestore onSnapshot listener
    // User requirement: "새 주문이 들어오면 내가 새로고침 안해도 자동으로 목록에 뜨게 해줘"
    const unsubscribe = subscribeOrders(
      (updatedOrders) => {
        // Detect if a brand new order arrived while viewing
        if (prevOrderCount.current !== null && updatedOrders.length > prevOrderCount.current) {
          const newest = updatedOrders[0];
          setNewOrderAlert(`🔔 새 주문이 접수되었습니다! [${newest.customerName}님 / ${newest.orderNumber}]`);
          setTimeout(() => setNewOrderAlert(null), 5000);
        }
        prevOrderCount.current = updatedOrders.length;
        setOrders(updatedOrders);
        setLoading(false);
      },
      (err) => {
        console.error('Error listening to orders:', err);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // One-click status change handler
  const handleSetStatus = async (order: OrderItem, newStatus: OrderItem['status']) => {
    if (order.status === newStatus) return;
    setUpdatingId(order.id);
    try {
      await updateOrderStatus(order.id, newStatus, order);
    } catch (err) {
      console.error('Failed to change status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'READY' && (ord.status === 'PAID' || ord.status === 'PREPARING' || ord.status === 'PENDING_PAYMENT')) ||
      ord.status === statusFilter;

    const matchesSearch =
      searchTerm.trim() === '' ||
      ord.customerName.includes(searchTerm) ||
      ord.customerPhone.includes(searchTerm) ||
      ord.orderNumber.includes(searchTerm) ||
      ord.address.includes(searchTerm);

    return matchesStatus && matchesSearch;
  });

  const totalRevenue = orders.reduce(
    (sum, o) => (o.status !== 'CANCELLED' ? sum + o.totalPrice : sum),
    0
  );
  const readyCount = orders.filter(
    (o) => o.status === 'PAID' || o.status === 'PREPARING' || o.status === 'PENDING_PAYMENT'
  ).length;
  const shippingCount = orders.filter((o) => o.status === 'SHIPPED').length;
  const completedCount = orders.filter((o) => o.status === 'COMPLETED').length;

  const handleExportCsv = () => {
    if (orders.length === 0) return;
    const headers = ['주문번호', '주문일시', '고객명', '연락처', '주소', '상세주소', '상품명', '수량', '결제금액', '결제수단', '상태'];
    const rows = orders.map((o) => [
      o.orderNumber,
      o.createdAt,
      o.customerName,
      o.customerPhone,
      `"${o.address}"`,
      `"${o.addressDetail}"`,
      o.productName,
      o.quantity,
      o.totalPrice,
      PAYMENT_METHOD_LABELS[o.paymentMethod] || o.paymentMethod,
      STATUS_LABELS[o.status].label,
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `자연온생식_주문목록_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F6F3EE] text-[#242A24] pb-16">
      {/* Top Banner Navigation */}
      <header className="bg-white border-b border-[#E3D9C4] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToStore}
              className="px-3.5 py-2 text-sm font-bold text-[#1B4332] bg-[#F2EDE2] hover:bg-[#EAE2D2] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>← 스토어 화면으로</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1B4332] flex items-center gap-2">
              <span>판매자 주문관리 대시보드</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Real-time Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EAF2EC] text-[#2D6A4F] text-xs sm:text-sm font-bold rounded-xl border border-[#CDE1D2]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden sm:inline">실시간 자동 동기화 켜짐</span>
              <span className="sm:hidden">실시간</span>
            </div>

            <button
              type="button"
              onClick={handleExportCsv}
              disabled={orders.length === 0}
              className="px-3.5 py-2 text-xs sm:text-sm font-bold bg-[#FAF8F5] hover:bg-[#F0EAE0] text-[#1B4332] border border-[#D5C8AC] rounded-xl transition-colors cursor-pointer disabled:opacity-40"
            >
              📥 엑셀(CSV) 다운로드
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Real-time New Order Floating Toast Alert */}
        {newOrderAlert && (
          <div className="bg-[#2D6A4F] text-white p-4 rounded-2xl shadow-lg flex items-center justify-between animate-bounce">
            <span className="text-base font-extrabold">{newOrderAlert}</span>
            <button
              type="button"
              onClick={() => setNewOrderAlert(null)}
              className="text-white/80 hover:text-white text-sm font-bold ml-4"
            >
              닫기 ✕
            </button>
          </div>
        )}

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E3D9C4] shadow-xs">
            <p className="text-xs sm:text-sm text-[#6C7C6D] font-bold">전체 주문 건수</p>
            <p className="text-2xl sm:text-3xl font-black text-[#1B4332] tabular-nums mt-1">
              {orders.length}건
            </p>
            <p className="text-xs text-[#829283] mt-1">누적 주문량</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E3D9C4] shadow-xs">
            <p className="text-xs sm:text-sm text-[#6C7C6D] font-bold">발송 대기 (접수/결제완료)</p>
            <p className="text-2xl sm:text-3xl font-black text-amber-700 tabular-nums mt-1">
              {readyCount}건
            </p>
            <p className="text-xs text-amber-600 font-semibold mt-1">배송 처리 필요</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E3D9C4] shadow-xs">
            <p className="text-xs sm:text-sm text-[#6C7C6D] font-bold">현재 배송 중</p>
            <p className="text-2xl sm:text-3xl font-black text-purple-700 tabular-nums mt-1">
              {shippingCount}건
            </p>
            <p className="text-xs text-purple-600 font-semibold mt-1">배송 진행 중</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E3D9C4] shadow-xs">
            <p className="text-xs sm:text-sm text-[#6C7C6D] font-bold">배송 완료</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-700 tabular-nums mt-1">
              {completedCount}건
            </p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">총 매출: {totalRevenue.toLocaleString()}원</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E3D9C4] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
          {/* Status Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'bg-[#F5EFEB] text-[#4F5F51] hover:bg-[#EBE2D0]'
              }`}
            >
              전체 ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('READY')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                statusFilter === 'READY'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-[#F5EFEB] text-[#4F5F51] hover:bg-[#EBE2D0]'
              }`}
            >
              발송대기 ({readyCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('SHIPPED')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                statusFilter === 'SHIPPED'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-[#F5EFEB] text-[#4F5F51] hover:bg-[#EBE2D0]'
              }`}
            >
              배송중 ({shippingCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('COMPLETED')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                statusFilter === 'COMPLETED'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-[#F5EFEB] text-[#4F5F51] hover:bg-[#EBE2D0]'
              }`}
            >
              배송완료 ({completedCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="주문자 성함, 연락처, 주문번호 검색"
              className="w-full md:w-72 px-4 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#D5C9AF] rounded-xl focus:outline-none focus:border-[#2D6A4F] text-[#242A24]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#88978A] hover:text-[#1B4332]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ================= ORDER TABLE (표) ================= */}
        {/* User requirement: "주문번호, 주문자, 상품, 금액, 상태를 표로 보여줘" */}
        <div className="bg-white rounded-2xl border border-[#E3D9C4] shadow-xs overflow-hidden">
          {loading ? (
            <div className="text-center py-20">
              <span className="inline-block w-8 h-8 border-3 border-[#2D6A4F] border-t-transparent rounded-full animate-spin mb-3"></span>
              <p className="text-sm font-bold text-[#4B5A4D]">주문 데이터를 실시간으로 가져오는 중입니다...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-4xl mb-3">📦</p>
              <p className="text-xl font-bold text-[#1B4332] mb-1">
                {orders.length === 0 ? '접수된 주문이 없습니다' : '조건에 일치하는 주문이 없습니다'}
              </p>
              <p className="text-sm text-[#6C7C6D] max-w-md mx-auto">
                스토어에서 고객이 [주문하기]를 누르고 결제하면 새로고침 없이 실시간으로 표에 즉시 나타납니다.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF7F2] border-b border-[#E3D9C4] text-xs font-extrabold text-[#475749] uppercase tracking-wider">
                    <th className="py-4 px-4 sm:px-5">주문번호 / 일시</th>
                    <th className="py-4 px-4 sm:px-5">주문자 정보</th>
                    <th className="py-4 px-4 sm:px-5">상품 및 수량</th>
                    <th className="py-4 px-4 sm:px-5">금액 / 결제수단</th>
                    <th className="py-4 px-4 sm:px-5 text-center">상태</th>
                    <th className="py-4 px-4 sm:px-5 text-center">상태 변경 버튼 (판매자용)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE8DA] text-sm">
                  {filteredOrders.map((ord) => {
                    const statusCfg = STATUS_LABELS[ord.status];
                    const isUpdating = updatingId === ord.id;
                    const formattedDate = new Date(ord.createdAt).toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <tr
                        key={ord.id}
                        className="hover:bg-[#FCFBF8] transition-colors"
                      >
                        {/* 1. 주문번호 / 일시 */}
                        <td className="py-4 px-4 sm:px-5 align-top">
                          <p className="font-mono font-bold text-sm text-[#1B4332] whitespace-nowrap">
                            {ord.orderNumber}
                          </p>
                          <p className="text-xs text-[#7B8B7C] mt-0.5 whitespace-nowrap">
                            {formattedDate}
                          </p>
                        </td>

                        {/* 2. 주문자 정보 */}
                        <td className="py-4 px-4 sm:px-5 align-top max-w-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-base text-[#1B4332]">
                              {ord.customerName}
                            </span>
                            <a
                              href={`tel:${ord.customerPhone}`}
                              className="text-xs font-semibold text-[#2D6A4F] bg-[#EAF2EC] px-2 py-0.5 rounded hover:underline whitespace-nowrap"
                            >
                              📞 {ord.customerPhone}
                            </a>
                          </div>
                          <p className="text-xs sm:text-sm text-[#4E5E50] leading-snug">
                            {ord.address} {ord.addressDetail}
                          </p>
                          {ord.deliveryNote && (
                            <p className="text-xs text-[#78897A] mt-0.5">
                              요청: {ord.deliveryNote}
                            </p>
                          )}
                        </td>

                        {/* 3. 상품 및 수량 */}
                        <td className="py-4 px-4 sm:px-5 align-top whitespace-nowrap">
                          <p className="font-bold text-[#1B4332]">
                            {ord.productName}
                          </p>
                          <p className="text-xs text-[#5C6D5E] font-medium mt-0.5">
                            총 <span className="font-bold text-[#2D6A4F]">{ord.quantity}박스</span> (30포 x {ord.quantity})
                          </p>
                        </td>

                        {/* 4. 금액 / 결제수단 */}
                        <td className="py-4 px-4 sm:px-5 align-top whitespace-nowrap">
                          <p className="font-black text-base text-[#1B4332] tabular-nums">
                            {ord.totalPrice.toLocaleString()}원
                          </p>
                          <p className="text-xs text-[#6B7C6D] mt-0.5">
                            {PAYMENT_METHOD_LABELS[ord.paymentMethod] || ord.paymentMethod}
                          </p>
                        </td>

                        {/* 5. 상태 */}
                        <td className="py-4 px-4 sm:px-5 align-top text-center whitespace-nowrap">
                          <span
                            className={`inline-block text-xs font-extrabold px-3 py-1 rounded-full border ${statusCfg.bg} ${statusCfg.color}`}
                          >
                            {statusCfg.label}
                          </span>
                        </td>

                        {/* 6. 상태 변경 버튼 (User requirement: 각 주문을 "배송중""배송완료"로 바꾸는 버튼) */}
                        <td className="py-4 px-4 sm:px-5 align-top text-center">
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 whitespace-nowrap">
                            {/* "배송중" 버튼 */}
                            <button
                              type="button"
                              disabled={isUpdating || ord.status === 'SHIPPED'}
                              onClick={() => handleSetStatus(ord, 'SHIPPED')}
                              className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                                ord.status === 'SHIPPED'
                                  ? 'bg-purple-100 text-purple-700 border border-purple-300 opacity-60 cursor-default'
                                  : 'bg-purple-600 hover:bg-purple-700 active:scale-95 text-white shadow-xs'
                              }`}
                            >
                              🚚 배송중
                            </button>

                            {/* "배송완료" 버튼 */}
                            <button
                              type="button"
                              disabled={isUpdating || ord.status === 'COMPLETED'}
                              onClick={() => handleSetStatus(ord, 'COMPLETED')}
                              className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                                ord.status === 'COMPLETED'
                                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 opacity-60 cursor-default'
                                  : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-xs'
                              }`}
                            >
                              ✅ 배송완료
                            </button>

                            {/* 기타 상태 드롭다운 (세부 변경용) */}
                            <select
                              value={ord.status}
                              disabled={isUpdating}
                              onChange={(e) => handleSetStatus(ord, e.target.value as OrderItem['status'])}
                              className="text-[11px] font-semibold bg-[#FAF8F5] border border-[#D5C9AF] rounded-lg px-2 py-1 text-[#3C4C3E] focus:outline-none cursor-pointer"
                              title="세부 상태 변경"
                            >
                              <option value="PENDING_PAYMENT">입금대기</option>
                              <option value="PAID">결제완료</option>
                              <option value="PREPARING">배송준비</option>
                              <option value="SHIPPED">배송중</option>
                              <option value="COMPLETED">배송완료</option>
                              <option value="CANCELLED">주문취소</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Real-time Notice Footer */}
        <div className="bg-[#EFE8DC] p-4 rounded-2xl border border-[#DCD1BA] flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-[#526354] gap-2">
          <p className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Firebase Firestore 실시간 데이터베이스 연결 중 · 새로고침을 하지 않아도 고객 주문이 즉시 들어옵니다.</span>
          </p>
          <button
            type="button"
            onClick={onBackToStore}
            className="text-xs font-bold text-[#1B4332] underline hover:text-[#2D6A4F] cursor-pointer"
          >
            스토어 페이지로 돌아가기 →
          </button>
        </div>
      </main>
    </div>
  );
}
