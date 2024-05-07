import { router, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import * as SecureStore from 'expo-secure-store';

const InternalAuthContext = createContext(null);
export function useInternalAuth() {
  return useContext(InternalAuthContext);
}


export function InternalAuthProvider(props) {

  const segments = useSegments();
  const [loadingCheck, SetLoadingCheck ] = useState(false);


  const chekingUser = async () => {
    SetLoadingCheck(true);
    try {
      const jsonValue = await SecureStore.getItemAsync(process.env.EXPO_PUBLIC_ASYNC_STORAGE_NAME);
      const restoredUser = jsonValue != null ? JSON.parse(jsonValue) : null;
      if(!restoredUser){
        router.replace('/auth/internal-login');
      }
      else{
        SetLoadingCheck(false);
      }
    } catch (e) {
      console.error(e);
      router.replace('/auth/internal-login');
    }
  };


  useEffect(() => {
    console.log(' INI CHECK')
    chekingUser()
  }, [segments]);


  //HIDDEN TRICK SHOW MENU BEFORE CHECK USER
  // YORI GEOVANNI
  if(loadingCheck){
    return null
  }


  return (
    <InternalAuthContext.Provider value={{  }}>
      {props.children}
    </InternalAuthContext.Provider>
  );
}
