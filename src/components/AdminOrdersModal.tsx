import { useState, useEffect } from 'react';
import {
  OrderItem,
  subscribeOrders,
  updateOrderStatus,
  STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
} from '@/src/services/orderService';

interface AdminOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminOrdersModal({ isOpen, onClose }: AdminOrdersModalProps) {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    const unsubscribe = subscribeOrders(
      (updatedOrders) => {
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
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStatusChange = async (order: OrderItem, newStatus: OrderItem['status']) => {
    setUpdatingId(order.id);
    try {
      await updateOrderStatus(order.id, newStatus, order);
    } catch (err) {
      console.error('Failed to update order status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = statusFilter === 'ALL' || ord.status === statusFilter;
    const matchesSearch =
      searchTerm.trim() === '' ||
      ord.customerName.includes(searchTerm) ||
      ord.customerPhone.includes(searchTerm) ||
      ord.orderNumber.includes(searchTerm) ||
      ord.address.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const totalAmount = orders.reduce((sum, ord) => sum + (ord.status !== 'CANCELLED' ? ord.totalPrice : 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'PENDING_PAYMENT').length;
  const paidCount = orders.filter((o) => o.status === 'PAID').length;
  const preparingCount = orders.filter((o) => o.status === 'PREPARING').length;
  const completedCount = orders.filter((o) => o.status === 'COMPLETED').length;

  const handleExportCsv = () => {
    if (orders.length === 0) return;
    const headers = ['주문번호', '주문일시', '고객명', '연락처', '주소', '상세주소', '요청사항', '수량', '결제금액', '결제수단', '상태'];
    const rows = orders.map((o) => [
      o.orderNumber,
      o.createdAt,
      o.customerName,
      o.customerPhone,
      `"${o.address}"`,
      `"${o.addressDetail}"`,
      `"${o.deliveryNote}"`,
      o.quantity,
      o.totalPrice,
      o.paymentMethod,
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
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#FAF8F5] rounded-3xl w-full max-w-4xl border-2 border-[#E5DEC9] shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-[#F5EFEB] border-b border-[#E3D9C4] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1B4332]">
                실시간 주문 관리 (사장님 전용)
              </h3>
              <p className="text-xs sm:text-sm text-[#5D6D5F]">
                외부 손님이 사이트에서 주문하면 즉시 여기에 실시간으로 표시됩니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white text-[#4A574C] hover:text-[#1B4332] text-xl font-bold flex items-center justify-center border border-[#E0D5BE] transition-colors cursor-pointer"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* Top Summary Bar */}
        <div className="p-4 sm:p-6 bg-[#FAF8F5] border-b border-[#E8DFC8] grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          <div className="bg-white p-3.5 rounded-2xl border border-[#E8DFC8]">
            <p className="text-xs text-[#6B7C6D] font-medium">총 주문 접수</p>
            <p className="text-xl sm:text-2xl font-black text-[#1B4332] tabular-nums mt-0.5">
              {orders.length}건
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-[#E8DFC8]">
            <p className="text-xs text-[#6B7C6D] font-medium">총 주문 금액</p>
            <p className="text-xl sm:text-2xl font-black text-[#2D6A4F] tabular-nums mt-0.5">
              {totalAmount.toLocaleString()}원
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-[#E8DFC8]">
            <p className="text-xs text-[#6B7C6D] font-medium">입금대기 / 결제완료</p>
            <p className="text-xl sm:text-2xl font-black text-amber-700 tabular-nums mt-0.5">
              {pendingCount} / {paidCount}건
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-[#E8DFC8]">
            <p className="text-xs text-[#6B7C6D] font-medium">배송준비 / 완료</p>
            <p className="text-xl sm:text-2xl font-black text-indigo-700 tabular-nums mt-0.5">
              {preparingCount} / {completedCount}건
            </p>
          </div>
        </div>

        {/* Filter and Export Bar */}
        <div className="p-4 bg-[#F7F2E8] border-b border-[#E8DFC8] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'bg-white text-[#4A574C] hover:bg-[#EFE8DC]'
              }`}
            >
              전체 ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('PENDING_PAYMENT')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'PENDING_PAYMENT'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-white text-[#4A574C] hover:bg-[#EFE8DC]'
              }`}
            >
              입금대기 ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('PAID')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'PAID'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white text-[#4A574C] hover:bg-[#EFE8DC]'
              }`}
            >
              결제완료 ({paidCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('PREPARING')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'PREPARING'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-white text-[#4A574C] hover:bg-[#EFE8DC]'
              }`}
            >
              배송준비 ({preparingCount})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="고객명, 연락처, 주문번호 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 text-xs sm:text-sm bg-white border border-[#DCD1BA] rounded-lg focus:outline-none focus:border-[#2D6A4F]"
            />
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={orders.length === 0}
              className="px-3 py-1.5 text-xs font-bold bg-white hover:bg-[#F2ECE0] text-[#1B4332] border border-[#D5C8AC] rounded-lg transition-colors cursor-pointer disabled:opacity-40"
            >
              📥 엑셀(CSV) 저장
            </button>
          </div>
        </div>

        {/* Orders List Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <span className="inline-block w-8 h-8 border-3 border-[#2D6A4F] border-t-transparent rounded-full animate-spin mb-3"></span>
              <p className="text-sm font-bold text-[#4B5A4D]">주문 데이터를 실시간 동기화 중...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#EAE2D0]">
              <p className="text-3xl mb-2">📦</p>
              <p className="text-lg font-bold text-[#1B4332] mb-1">
                {orders.length === 0 ? '아직 접수된 주문이 없습니다' : '조건에 맞는 주문이 없습니다'}
              </p>
              <p className="text-xs sm:text-sm text-[#6C7C6D]">
                외부 고객이 메인 페이지에서 "주문하기"를 누르고 주문을 제출하면 여기에 즉시 나타납니다.
              </p>
            </div>
          ) : (
            filteredOrders.map((ord) => {
              const statusCfg = STATUS_LABELS[ord.status];
              const formattedDate = new Date(ord.createdAt).toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl p-5 border border-[#E3D9C4] shadow-xs space-y-3 hover:border-[#2D6A4F]/40 transition-colors"
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F2ECE0] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm sm:text-base font-bold text-[#1B4332]">
                        {ord.orderNumber}
                      </span>
                      <span className="text-xs text-[#8A9B8C]">· {formattedDate}</span>
                    </div>

                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusCfg.bg} ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                      <select
                        value={ord.status}
                        disabled={updatingId === ord.id}
                        onChange={(e) => handleStatusChange(ord, e.target.value as OrderItem['status'])}
                        className="text-xs font-bold bg-[#FAF8F5] border border-[#D5C9AF] rounded-lg px-2 py-1 text-[#1B4332] focus:outline-none cursor-pointer"
                      >
                        <option value="PENDING_PAYMENT">입금 대기</option>
                        <option value="PAID">결제 완료</option>
                        <option value="PREPARING">배송 준비</option>
                        <option value="SHIPPED">배송 중</option>
                        <option value="COMPLETED">배송 완료</option>
                        <option value="CANCELLED">주문 취소</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer and Order Content */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <p className="font-bold text-[#1B4332] text-base flex items-center gap-2">
                        <span>{ord.customerName}</span>
                        <a
                          href={`tel:${ord.customerPhone}`}
                          className="text-xs text-[#2D6A4F] bg-[#EAF2EC] px-2 py-0.5 rounded hover:underline"
                        >
                          전화걸기 ({ord.customerPhone})
                        </a>
                        <a
                          href={`sms:${ord.customerPhone}`}
                          className="text-xs text-[#2D6A4F] bg-[#EAF2EC] px-2 py-0.5 rounded hover:underline"
                        >
                          문자
                        </a>
                      </p>
                      <p className="text-[#4E5E50] leading-snug">
                        📍 {ord.address} {ord.addressDetail}
                      </p>
                      <p className="text-xs text-[#718273]">
                        요청: {ord.deliveryNote}
                      </p>
                    </div>

                    <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#ECE4D2] flex flex-col justify-between">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-bold text-[#1B4332]">
                          {ord.productName}
                        </span>
                        <span className="font-bold text-base text-[#1B4332]">
                          {ord.quantity}박스 (30포 x {ord.quantity})
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline text-xs text-[#627364]">
                        <span>결제수단: {PAYMENT_METHOD_LABELS[ord.paymentMethod] || ord.paymentMethod}</span>
                        <span className="text-base font-black text-[#2D6A4F] tabular-nums">
                          {ord.totalPrice.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F5EFEB] border-t border-[#E3D9C4] flex items-center justify-between text-xs sm:text-sm text-[#5C6E5E] shrink-0">
          <span>🟢 Firestore 실시간 동기화 활성화됨</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#1B4332] text-white font-bold rounded-xl hover:bg-[#2D6A4F] transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
