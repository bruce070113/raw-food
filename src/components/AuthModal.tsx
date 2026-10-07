import { useState, useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialMode?: 'login' | 'register';
  promptMessage?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
  promptMessage,
}: AuthModalProps) {
  const { login, register, translateAuthError } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  const [name, setName] = useState('쟌느');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage('');
      setPassword('');
      setConfirmPassword('');
      setIsSubmitting(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('이메일을 입력해주세요.');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('올바른 이메일 형식을 적어주세요. (예: user@naver.com)');
      return;
    }

    // Password length validation (explicit user requirement: 6자 이상)
    if (password.length < 6) {
      setErrorMessage(`비밀번호는 최소 6자 이상이어야 합니다. (지금은 ${password.length}자예요)`);
      return;
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setErrorMessage('비밀번호와 비밀번호 확인이 서로 다릅니다. 다시 맞춰주세요.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(cleanEmail, password);
      } else {
        await register(cleanEmail, password, name.trim() || '쟌느');
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      console.error('Auth error:', err);
      const friendlyMsg = translateAuthError(firebaseError.code || '');
      setErrorMessage(friendlyMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div className="bg-[#FAF8F5] rounded-3xl w-full max-w-md border-2 border-[#E5DEC9] shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-5 bg-[#F5EFEB] border-b border-[#E3D9C4] flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-extrabold text-[#1B4332]">
              {mode === 'login' ? '로그인' : '간편 회원가입'}
            </h3>
            <p className="text-xs text-[#5D6D5F] mt-0.5">
              자연온 생식과 함께하는 건강한 한 끼
            </p>
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

        {/* Notice banner if user tried to order */}
        {promptMessage && (
          <div className="bg-[#EAF2EC] border-b border-[#D2E3D6] px-5 py-3 text-xs sm:text-sm font-semibold text-[#1B4332] flex items-center gap-2">
            <span>💡</span>
            <span>{promptMessage}</span>
          </div>
        )}

        {/* Tab switcher */}
        <div className="p-4 pt-5 px-6">
          <div className="grid grid-cols-2 bg-[#EFE9DC] p-1 rounded-2xl border border-[#DDD3BC]">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`py-2.5 text-sm sm:text-base font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#1B4332] shadow-xs'
                  : 'text-[#637265] hover:text-[#1B4332]'
              }`}
            >
              로그인
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage('');
              }}
              className={`py-2.5 text-sm sm:text-base font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#1B4332] shadow-xs'
                  : 'text-[#637265] hover:text-[#1B4332]'
              }`}
            >
              회원가입
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Friendly Error Box */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-800 font-medium leading-relaxed flex items-start gap-2">
              <span className="text-base shrink-0">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Nickname for Register */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-bold text-[#1B4332] mb-1">
                이름 / 닉네임
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 쟌느"
                className="w-full px-4 py-3 text-base bg-white border border-[#DDD3BC] rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 text-[#242A24]"
              />
              <p className="text-xs text-[#7A8A7C] mt-1">
                로그인 시 상단에 "{name || '쟌느'}님 환영합니다"로 표시됩니다.
              </p>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-[#1B4332] mb-1">
              이메일 주소 <span className="text-rose-600">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="예: jeanne@example.com"
              className="w-full px-4 py-3 text-base bg-white border border-[#DDD3BC] rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 text-[#242A24]"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-bold text-[#1B4332]">
                비밀번호 <span className="text-rose-600">*</span>
              </label>
              <span className="text-xs text-[#718273]">
                6자 이상 필수
              </span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6자 이상 입력해주세요"
                className="w-full px-4 py-3 text-base bg-white border border-[#DDD3BC] rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 text-[#242A24] pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6D7D6F] px-1 py-1 hover:text-[#1B4332] cursor-pointer"
              >
                {showPassword ? '숨김' : '보기'}
              </button>
            </div>
            {password.length > 0 && password.length < 6 && (
              <p className="text-xs text-amber-700 mt-1 font-medium">
                ⚠️ 아직 {password.length}자예요. 6자 이상 적어주셔야 안전해요!
              </p>
            )}
          </div>

          {/* Confirm Password (Register mode only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-bold text-[#1B4332] mb-1">
                비밀번호 확인 <span className="text-rose-600">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 한 번 더 적어주세요"
                className="w-full px-4 py-3 text-base bg-white border border-[#DDD3BC] rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 text-[#242A24]"
              />
              {confirmPassword.length > 0 && confirmPassword !== password && (
                <p className="text-xs text-rose-600 mt-1 font-medium">
                  ⚠️ 위에서 입력한 비밀번호와 일치하지 않아요.
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 text-lg font-extrabold text-white bg-[#2D6A4F] hover:bg-[#1B4332] active:scale-[0.98] disabled:opacity-50 transition-all rounded-2xl shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>처리 중입니다...</span>
                </>
              ) : mode === 'login' ? (
                '로그인하고 계속하기'
              ) : (
                '회원가입 완료하기'
              )}
            </button>
          </div>

          {/* Helper switcher link */}
          <div className="text-center pt-2">
            {mode === 'login' ? (
              <p className="text-xs sm:text-sm text-[#5B6B5D]">
                아직 계정이 없으신가요?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage('');
                  }}
                  className="font-bold text-[#2D6A4F] underline hover:text-[#1B4332] cursor-pointer"
                >
                  간편 회원가입하기
                </button>
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-[#5B6B5D]">
                이미 가입하셨나요?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                  }}
                  className="font-bold text-[#2D6A4F] underline hover:text-[#1B4332] cursor-pointer"
                >
                  로그인하기
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
