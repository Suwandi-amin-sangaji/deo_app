import { FontAwesome, FontAwesome5, MaterialIcons, Ionicons, Entypo, Fontisto, MaterialCommunityIcons, AntDesign, Octicons, Foundation } from "@expo/vector-icons";
import React, { useEffect, useContext, createContext, useState, Fragment } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, Redirect, Tabs, useSegments, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaLayout } from '@components/safe-area-layout';
import IconPng from "@assets/icon.png";
import axios from 'axios';





const TITLE  = 'PENGELOLA KARGO';
const INTERNAL_DATA_NAME = process.env.EXPO_PUBLIC_ASYNC_MITRA_ACCOUNT_PENGELOLAH_KAGO;
const BACKEND_LOGIN_URL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/mitra-pengelola-kargo`;
const REDIRECT_LOGIN = '/auth/mitra.pengelola-kargo.login';
const BASEPATH = '/mitra-content/pengelola-kargo';






const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}




const LayoutContext = createContext(null);
export function useLayoutContext() {
  return useContext(LayoutContext);
}





export default function Layout() {

  const baseApiUrl = `${BACKEND_LOGIN_URL}`;
  const [{ isLoading, isError, user }, setState] = useState({ isLoading: true, isError: false, user: null });
  const segment = useSegments();



  const renewToken = async (userData) => {
    try {
      const { data } = await axios({
        method: 'POST',
        url: `${baseApiUrl}/check-and-renew-token`,
        data: {
          token: userData.token,
        },
        headers: {
          Authorization: `Bearer ${userData.token}`
        }
      });
      const saveData = JSON.stringify(data);
      await SecureStore.setItemAsync(INTERNAL_DATA_NAME, saveData);
      setState((e) => {
        return {
          ...e,
          isLoading: false,
          user: data,
          isError: false
        }
      })
    }
    catch (e) {
      await SecureStore.deleteItemAsync(INTERNAL_DATA_NAME);
      setState((e) => {
        return {
          ...e,
          isLoading: false,
          user: null,
          isError: true
        }
      })
    }

  }




  const checkUser = async () => {
    const userStringData = await SecureStore.getItemAsync(INTERNAL_DATA_NAME);
    const userData = userStringData != null ? JSON.parse(userStringData) : null;
    if (!userData) {
      setState((e) => {
        return {
          ...e,
          isLoading: false
        }
      })
    } else {
      renewToken(userData);
    }
  }





  const logout = async () => {
    await SecureStore.deleteItemAsync(INTERNAL_DATA_NAME);
    setState((e) => {
      return {
        ...e,
        isLoading: false,
        user: null,
        isError: false
      }
    })
  }




  useEffect(() => {
    checkUser();
  }, [])





  if (isLoading) {
    return (<>
      <View className=" flex-1 items-center justify-center bg-white">
        <View className="mb-4">
        </View>
        <Text className=" text-slate-500 mb-2 font-normal text-lg lowercase">CHECK USER ...</Text>
      </View>
    </>)
  }




  if (!user) {
    return <Redirect href={REDIRECT_LOGIN} />;
  }



  return (
    <LayoutContext.Provider value={{
      user: user,
      baseApiUrl: baseApiUrl,
      logout: logout,
      title: TITLE,
      basepath : BASEPATH,
    }}>
      
      <Stack/>
    </LayoutContext.Provider>

  );
}

