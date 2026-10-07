import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address: string;
  addressDetail: string;
  deliveryNote: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  paymentMethod: 'bank' | 'card' | 'kakaopay' | 'naverpay' | 'tosspay';
  status: 'PENDING_PAYMENT' | 'PAID' | 'PREPARING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export const PAYMENT_METHOD_LABELS: Record<OrderItem['paymentMethod'], string> = {
  card: '신용/체크카드 (연습용 결제)',
  kakaopay: '카카오페이 (연습용 결제)',
  naverpay: '네이버페이 (연습용 결제)',
  tosspay: '토스페이 (연습용 결제)',
  bank: '무통장 입금 (가상계좌)',
};

export const STATUS_LABELS: Record<OrderItem['status'], { label: string; color: string; bg: string }> = {
  PENDING_PAYMENT: { label: '입금 대기', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  PAID: { label: '결제 완료', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  PREPARING: { label: '배송 준비', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  SHIPPED: { label: '배송 중', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  COMPLETED: { label: '배송 완료', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  CANCELLED: { label: '주문 취소', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
};

export async function createRealOrder(data: {
  customerName: string;
  customerPhone: string;
  address: string;
  addressDetail: string;
  deliveryNote: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  paymentMethod: 'bank' | 'card' | 'kakaopay' | 'naverpay' | 'tosspay';
}): Promise<OrderItem> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
  // Format requested by user: ORD-YYYYMMDD-3843
  const orderNumber = `ORD-${dateStr}-${randomSuffix}`;
  const docId = `ord_${Date.now()}_${randomSuffix}`;

  const newOrder: OrderItem = {
    id: docId,
    orderNumber,
    customerName: data.customerName.trim(),
    customerPhone: data.customerPhone.trim(),
    address: data.address.trim(),
    addressDetail: data.addressDetail.trim(),
    deliveryNote: data.deliveryNote.trim() || '문 앞에 놓아주세요',
    productName: data.productName,
    quantity: data.quantity,
    unitPrice: data.unitPrice,
    totalPrice: data.totalPrice,
    paymentMethod: data.paymentMethod,
    status: data.paymentMethod === 'bank' ? 'PENDING_PAYMENT' : 'PAID',
    createdAt: now.toISOString(),
  };

  const path = `orders/${docId}`;
  try {
    await setDoc(doc(db, 'orders', docId), newOrder);
    return newOrder;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchAllOrders(): Promise<OrderItem[]> {
  const path = 'orders';
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data() as OrderItem);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export function subscribeOrders(
  onOrdersUpdated: (orders: OrderItem[]) => void,
  onError?: (err: unknown) => void
) {
  const path = 'orders';
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const orders = snapshot.docs.map((d) => d.data() as OrderItem);
      onOrdersUpdated(orders);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderItem['status'],
  existingOrder: OrderItem
): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      ...existingOrder,
      status: newStatus,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
