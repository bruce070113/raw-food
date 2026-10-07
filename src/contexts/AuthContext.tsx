import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/src/lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  nickname: string;
  isAuthReady: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  translateAuthError: (code: string) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const translateAuthError = (code: string): string => {
    switch (code) {
      case 'auth/email-already-in-use':
        return '이미 사용 중인 이메일입니다. 이미 가입하셨다면 로그인해주세요.';
      case 'auth/invalid-email':
        return '올바른 이메일 주소를 입력해주세요. (예: name@example.com)';
      case 'auth/weak-password':
        return '비밀번호는 6자 이상이어야 합니다. 더 길게 입력해주세요.';
      case 'auth/user-not-found':
        return '가입되지 않은 이메일입니다. 회원가입을 먼저 진행해주세요.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return '비밀번호가 맞지 않거나 이메일이 잘못되었습니다. 다시 확인해주세요.';
      case 'auth/too-many-requests':
        return '비밀번호를 여러 번 잘못 입력하여 잠시 잠겼습니다. 1~2분 뒤 다시 시도해주세요.';
      case 'auth/network-request-failed':
        return '인터넷 연결이 원활하지 않습니다. 네트워크를 확인해주세요.';
      case 'auth/operation-not-allowed':
        return '이메일/비밀번호 로그인이 설정 중입니다. Firebase Console에서 Email/Password 제공자를 사용 설정해주세요.';
      default:
        return '로그인 또는 회원가입 중 문제가 발생했습니다. 다시 시도해주세요.';
    }
  };

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const register = async (email: string, pass: string, name: string) => {
    const finalName = name.trim() || '쟌느';
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, {
      displayName: finalName,
    });
    // Force local user object refresh so displayName is immediately visible
    setCurrentUser({ ...userCredential.user, displayName: finalName } as User);
  };

  const logout = async () => {
    await signOut(auth);
  };

  // Return displayName or default "쟌느" if user is logged in
  const nickname = currentUser?.displayName || (currentUser ? '쟌느' : '');

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        nickname,
        isAuthReady,
        login,
        register,
        logout,
        translateAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
