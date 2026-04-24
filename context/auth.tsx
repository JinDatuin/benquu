import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

type User = {
  id: string;
  username: string;
  avatar?: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('loggedIn').then((val) => {
      if (val === 'true') {
        AsyncStorage.getItem('user').then((userStr) => {
          if (userStr) {
            setUser(JSON.parse(userStr));
            setIsLoggedIn(true);
          }
        });
      }
    });
  }, []);

  const login = async (userData: User) => {
    await AsyncStorage.setItem('loggedIn', 'true');
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('loggedIn');
    await AsyncStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
