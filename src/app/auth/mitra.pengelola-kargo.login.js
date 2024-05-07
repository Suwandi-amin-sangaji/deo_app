import { Platform, View, TextInput, SafeAreaView, KeyboardAvoidingView, Text, Image, ScrollView, TouchableOpacity, Button } from "react-native";
import React, { useState, useEffect, useMemo, useRef, Fragment } from 'react'
import { Stack, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
import get from 'lodash/get';
import IconPng from "@assets/icon.png";
import * as Google from 'expo-auth-session/providers/google';




const TITLE = 'LOGIN - PENGELOLA KARGO';
const INTERNAL_DATA_NAME = process.env.EXPO_PUBLIC_ASYNC_MITRA_ACCOUNT_PENGELOLAH_KAGO;
const BACKEND_LOGIN_URL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/mitra-pengelola-kargo/login`;
const REDIRECT_SUCCESS = '/mitra-content/pengelola-kargo';





const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}






export default () => {
  const [{ isLoading, isError, data }, setState] = useState({ isLoading: false, isError: false, data: null });
  const [showError, setShowError] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: process.env.EXPO_PUBLIC_EXPO_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    selectAccount: true,
  });




  const loginToServer = async (googleResponse) => {
    try {
      setState((e) => {
        return {
          ...e,
          isLoading: true,
          isError: false,
          data: null
        }
      });

      setShowError(false);
      const device_id = await SecureStore.getItemAsync('deviceId');
      const { data } = await axios({
        url: BACKEND_LOGIN_URL,
        method: 'POST',
        data: {
          device_id: device_id,
          token: googleResponse
        }
      });

      const saveData = JSON.stringify(data);
      await SecureStore.setItemAsync(INTERNAL_DATA_NAME, saveData);
      setTimeout(() => {
        router.replace(REDIRECT_SUCCESS);
      }, 500);

    } catch (err) {
      console.log(err);
      setState((e) => {
        return {
          ...e,
          isLoading: false,
          isError: true,
          data: null
        }
      });
      if (err.response) {
        const errorMessage = get(err, ['response', 'data', 'error', 'message'], 'TERJADI KESALAHAN INTERNAL, SILAHKAN COBA BEBERAPA SAAT LAGI');
        setShowError(errorMessage);
      } else {
        setShowError('TERJADI KESALAHAN INTERNAL, SILAHKAN HUBUNGI ADMIN');
      }
    }
  }

  const loginDev = async () => {
    try {
      setState((e) => {
        return {
          ...e,
          isLoading: true,
          isError: false,
          data: null
        }
      });

      setShowError(false);
      const device_id = await SecureStore.getItemAsync('deviceId');
      const { data } = await axios({
        url: `${process.env.EXPO_PUBLIC_BACKEND_URL}/yori-android/${process.env.EXPO_PUBLIC_ASYNC_STORAGE_DEV_LOGIN_PATH}`,
        method: 'POST',
        data: {
          device_id: device_id
        }
      });

      const saveData = JSON.stringify(data);
      await SecureStore.setItemAsync(INTERNAL_DATA_NAME, saveData);
      setTimeout(() => {
        router.replace(REDIRECT_SUCCESS);
      }, 500);

    } catch (err) {
      console.log(err);
      setState((e) => {
        return {
          ...e,
          isLoading: false,
          isError: true,
          data: null
        }
      });
      if (err.response) {
        const errorMessage = get(err, ['response', 'data', 'error', 'message'], 'TERJADI KESALAHAN INTERNAL, SILAHKAN COBA BEBERAPA SAAT LAGI');
        setShowError(errorMessage);
      } else {
        setShowError('TERJADI KESALAHAN INTERNAL, SILAHKAN HUBUNGI ADMIN');
      }
    }
  }



  useEffect(() => {
    if (response?.type === 'success') {
      const googleResponse = response.params;
      loginToServer(googleResponse);
    }
  }, [response]);





  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />
      <View className={classNames(
        Platform.OS === 'android' ? 'mt-8' : '',
        //   Platform.OS === 'android' ? 'px-2' : 'px-4',
        'flex-row items-center justify-between bg-gray-700 py-4'
      )}>

        <View className="ml-6 space-y-0 flex-row items-center space-x-4">
          <View className=" items-center justify-center">
            <Image source={IconPng} style={{ width: 55, height: 55, borderRadius: 55 / 2 }} resizeMode="cover" />
          </View>
          <View>
            <Text className="text-xl text-white font-bold">{TITLE}</Text>
            <Text className="text-md text-white font-normal">BLU UPBU DEO SORONG - DEO AIRPORT</Text>
          </View>
        </View>
      </View>

      {showError && (<View className=" items-center justify-center mt-8 rounded-lg p-4 mx-10 border border-red-600">
        <Text className="font-normal" onPress={() => setShowError(null)}>{showError}</Text>
      </View>)}


      <View className="flex-1 items-center justify-center flex-col">
        {isLoading ? (<LoadingSubmit />) : (<Fragment>
          <View className="flex-row space-x-2">
            <TouchableOpacity className=" p-2 flex-col bg-slate-500 rounded" onPress={() => router.canGoBack() ? router.back() : router.push('/mitra')}>
              <Text className="text-white ">KEMBALI</Text>
            </TouchableOpacity>
            {__DEV__ ? (<TouchableOpacity className=" p-2 flex-col bg-red-700 rounded" onPress={() => loginDev()}>
              <Text className="text-white ">LOGIN DEV</Text>
            </TouchableOpacity>) : (<TouchableOpacity className=" p-2 flex-col bg-red-700 rounded" onPress={() => promptAsync()}>
              <Text className="text-white ">{TITLE}</Text>
            </TouchableOpacity>)}
          </View>
          <Text className="text-xs mt-2">klik tombol login untuk masuk</Text>
        </Fragment>)}
      </View>


      <View className=" absolute bottom-0 w-full">
        <View className=" items-center justify-center mb-12">
          <Text className="text-lg font-bold text-slate-700">KEMENTERIAN PERHUBUNGAN</Text>
          <Text className="text font-bold  text-slate-700">DIREKTORAT JENDERAL PERHUBUNGAN UDARA</Text>
          <Text className="text-sm font-bold  text-slate-700">BLU UPBU KELAS I DEO SORONG</Text>
          <Text className="text-lg font-bold  text-slate-700">2023</Text>
        </View>
      </View>
    </SafeAreaView>)






}












const LoadingSubmit = () => {
  return (<View className=" items-center justify-center flex-col mt-8">
    <Text>CHECK USER CREDENTIALS ...</Text>
  </View>)
}