/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import Navbar from '@/src/components/Navbar';
import HeroSection from '@/src/components/HeroSection';
import IngredientsSection from '@/src/components/IngredientsSection';
import TargetAudienceSection from '@/src/components/TargetAudienceSection';
import HowToDrinkSection from '@/src/components/HowToDrinkSection';
import ProductOrderSection from '@/src/components/ProductOrderSection';
import OrderModal from '@/src/components/OrderModal';
import SellerOrderManagement from '@/src/components/SellerOrderManagement';
import AuthModal from '@/src/components/AuthModal';
import MobileStickyCta from '@/src/components/MobileStickyCta';
import Footer from '@/src/components/Footer';

function MainApp() {
  const { currentUser } = useAuth();
  const [currentView, setCurrentView] = useState<'store' | 'seller'>('store');
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authPromptMessage, setAuthPromptMessage] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [pendingOrderAfterAuth, setPendingOrderAfterAuth] = useState(false);

  // Requirement: "주문하려면 먼저 회원가입하고 로그인하게 해 줘."
  const handleOpenOrder = (qty: number = 1) => {
    setOrderQuantity(qty);

    if (!currentUser) {
      setAuthPromptMessage('주문하시려면 먼저 로그인이나 회원가입을 해주세요.');
      setPendingOrderAfterAuth(true);
      setIsAuthOpen(true);
      return;
    }

    setIsOrderOpen(true);
  };

  const handleCloseOrder = () => {
    setIsOrderOpen(false);
  };

  const handleAuthSuccess = () => {
    // If user clicked order before logging in, proceed straight to the order form
    if (pendingOrderAfterAuth) {
      setPendingOrderAfterAuth(false);
      setIsOrderOpen(true);
    }
  };

  // If seller wants to view the order management dashboard
  if (currentView === 'seller') {
    return (
      <SellerOrderManagement onBackToStore={() => setCurrentView('store')} />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#242A24] font-sans antialiased selection:bg-[#2D6A4F] selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar
        onOpenOrder={() => handleOpenOrder(1)}
        onOpenAdmin={() => setCurrentView('seller')}
        onOpenAuth={() => {
          setAuthPromptMessage('');
          setPendingOrderAfterAuth(false);
          setIsAuthOpen(true);
        }}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. Hero: "하루한잔, 간편한 한끼" + 큰 주문하기 버튼 */}
        <HeroSection onOpenOrder={() => handleOpenOrder(1)} />

        {/* 2. 국내산 50가지 곡물, 채소 소개 */}
        <IngredientsSection />

        {/* 3. 이런 분들께 좋아요 3가지 */}
        <TargetAudienceSection onOpenOrder={() => handleOpenOrder(1)} />

        {/* 4. 물이나 우유에 타서 드세요 (1 -> 2 -> 3 순서표시) */}
        <HowToDrinkSection />

        {/* 5. 상품 1개와 가격, 큰 "주문하기" 버튼 */}
        <ProductOrderSection onOpenOrder={handleOpenOrder} />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setCurrentView('seller')} />

      {/* Mobile Sticky Order Bar (< 15% viewport cap) */}
      <MobileStickyCta onOpenOrder={() => handleOpenOrder(1)} />

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthOpen}
        promptMessage={authPromptMessage}
        onClose={() => {
          setIsAuthOpen(false);
          setPendingOrderAfterAuth(false);
        }}
        onSuccess={handleAuthSuccess}
      />

      {/* Real Firestore Order Modal with Mock Payment flow */}
      <OrderModal
        isOpen={isOrderOpen}
        initialQuantity={orderQuantity}
        onClose={handleCloseOrder}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
