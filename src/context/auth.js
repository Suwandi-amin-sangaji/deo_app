import { router, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import * as SecureStore from 'expo-secure-store';
const AuthContext = createContext(null);
export function useAuth() {
  return useContext(AuthContext);
}




export function AuthProvider(props) {
  const [user, setAuth] = useState(null);
  const segments = useSegments();
  const hasCheckedUser = useRef(false);






  const chekingUser = async () => {
    if (hasCheckedUser.current) return;

    try {
      const jsonValue = await SecureStore.getItemAsync(process.env.EXPO_PUBLIC_ASYNC_STORAGE_NAME);
      const restoredUser = jsonValue != null ? JSON.parse(jsonValue) : null;
      setAuth(restoredUser);
      hasCheckedUser.current = true;
    } catch (e) {
      console.error(e);
    }
  };



  useEffect(() => {
    chekingUser(); // Memanggil fungsi untuk memeriksa pengguna
    //console.log(segments)
    const inAuthGroup = segments[0] === '(auth)';
    const ProtectedTabsChildren = ['internal'];
    if (segments[1] && segments[1].includes(ProtectedTabsChildren) && !user) {
      router.replace('/auth/login');
    }
  }, [user, segments]);






  return (
    <AuthContext.Provider value={{ setAuth, user }}>
      {props.children}
    </AuthContext.Provider>
  );
}
