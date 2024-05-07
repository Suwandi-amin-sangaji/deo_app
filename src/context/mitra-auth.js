import { router, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import * as SecureStore from 'expo-secure-store';

const MitraAuthContext = createContext(null);
export function useMitraAuth() {
  return useContext(MitraAuthContext);
}




export function MitraAuthProvider(props) {

  const segments = useSegments();

  const chekingUser = async () => {
    try {
      const jsonValue = await SecureStore.getItemAsync(process.env.EXPO_PUBLIC_ASYNC_MITRA_ACCOUNT_STORAGE_NAME);
      const restoredUser = jsonValue != null ? JSON.parse(jsonValue) : null;
      if(!restoredUser){
        router.replace('/auth/mitra-login');
      }
    } catch (e) {
      console.error(e);
      router.replace('/auth/mitra-login');
    }
  };


  useEffect(() => {
    chekingUser()
  }, [segments]);


  return (
    <MitraAuthContext.Provider value={{  }}>
      {props.children}
    </MitraAuthContext.Provider>
  );
}
