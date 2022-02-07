import { createContext, useCallback, useContext } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

import api from 'services/api';

interface LoginProps {
  username: string;
  password: string;
}

interface ContextProps {
  login(data: LoginProps): Promise<void>;
  logout(): void;
}

const Auth = createContext<ContextProps>({} as ContextProps);

const AuthProvider = ({ children }) => {
  const { push } = useRouter();

  const handleLogin = useCallback(
    async ({ username, password }: LoginProps) => {
      await api.get('/api/pessoa', {
        auth: {
          username,
          password,
        },
      });

      Cookies.set('username', username);
      Cookies.set('password', password);

      push('/pessoas');
    },
    [push],
  );

  const handleLogout = useCallback(() => {
    Cookies.remove('username');
    Cookies.remove('password');

    push('/auth/login');
  }, [push]);

  return (
    <Auth.Provider value={{ login: handleLogin, logout: handleLogout }}>
      {children}
    </Auth.Provider>
  );
};

function useAuth() {
  const context = useContext(Auth);

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
