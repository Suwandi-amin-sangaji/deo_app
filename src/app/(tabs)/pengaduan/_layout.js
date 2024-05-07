import { FontAwesome, FontAwesome5, MaterialIcons, Ionicons, Entypo, Fontisto, MaterialCommunityIcons, AntDesign, Octicons, Foundation } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { Platform, View, TextInput, SafeAreaView, KeyboardAvoidingView, Text, Image, ScrollView, TouchableOpacity, Button } from "react-native";
import React, { useState, useEffect, useMemo, useRef, Fragment , useContext, createContext,} from 'react'
import { Stack, router,Slot, Redirect, Tabs, useSegments } from 'expo-router';
import get from 'lodash/get';
import IconPng from "@assets/icon.png";
import * as Google from 'expo-auth-session/providers/google';




const TITLE = 'LAYANAN PENGADUAN PUBLIK';
const INTERNAL_DATA_NAME = process.env.EXPO_PUBLIC_ASYNC_MEMBER_ACCOUNT_PUBLIK;
const BACKEND_LOGIN_URL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/public-pengaduan/login`;
const baseApiUrl = `${process.env.EXPO_PUBLIC_BACKEND_URL}/public-pengaduan`;
const REDIRECT_SUCCESS = '/(tabs)/pengaduan';
const BASEPATH = '/(tabs)/pengaduan';


const LayoutContext = createContext(null);
export function useLayoutContext() {
  return useContext(LayoutContext);
}






const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ')
  }
  
  


  export default function Layout() {

    const [{isLoading, isError, user }, setState] = useState({isLoading : true, isError : false, user : null});
    const segment = useSegments();
  
  
  
    const renewToken = async(userData) =>{
      try{
        const { data } = await axios({
          method : 'POST',
          url : `${baseApiUrl}/check-and-renew-token`,
          data : {
            token : userData.token,
          },
          headers : {
            Authorization : `Bearer ${userData.token}`
          }
        });
        const saveData = JSON.stringify(data);
        await SecureStore.setItemAsync(INTERNAL_DATA_NAME, saveData);
        setState((e)=>{
          return {
            ...e,
            isLoading : false,
            user : data,
            isError : false
          }
        })
      }
      catch(e){
        await SecureStore.deleteItemAsync(INTERNAL_DATA_NAME);
        setState((e)=>{
          return {
            ...e,
            isLoading : false,
            user : null,
            isError : true
          }
        })
      }
  
    }
  
  
  
  
    const checkUser = async () => {
      const userStringData = await SecureStore.getItemAsync(INTERNAL_DATA_NAME);
      const userData = userStringData != null ? JSON.parse(userStringData) : null;
      if(!userData){
        setState((e)=>{
          return {
            ...e,
            isLoading : false
          }
        })
      }else{
        renewToken(userData);
      }
    }
  
  
  
  
  
    const logout = async() => {
      await SecureStore.deleteItemAsync(INTERNAL_DATA_NAME);
      setState((e)=>{
        return {
          ...e,
          isLoading : false,
          user : null,
          isError : false
        }
      })
    }




    
  
  
  
  
    useEffect(() => {
       checkUser();
    }, [])
  
  
  
  
  
    if(isLoading){
      return (<>
        <View className=" flex-1 items-center justify-center bg-white">
        <View className="mb-4">
        </View>
          <Text className=" text-slate-500 mb-2 font-normal text-lg lowercase">LOADING ...</Text>
        </View>
      </>)
    }
  
  
    if(!user){
      return (<>
        <LoginPublic setStateLayout={setState}/>
      </>);
    }
  
  
  console.log(user)
  
    return (
      <LayoutContext.Provider value={{
        user : user,
        baseApiUrl : baseApiUrl,
        logout : logout,
        title : TITLE,
        INTERNAL_DATA_NAME : INTERNAL_DATA_NAME,
        basepath : BASEPATH

        }}>
        
        <Slot/>
      </LayoutContext.Provider>
  
    );
  }







  

const LoginPublic  = ({ setStateLayout }) => {
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
        setStateLayout((e)=>{
          return {
            ...e,
            isLoading : false, 
            isError : false, 
            user : data
          }
        })
      } catch (err) {
        await SecureStore.deleteItemAsync(INTERNAL_DATA_NAME);
        setStateLayout((e)=>{
          return {
            ...e,
            isLoading : false, 
            isError : true, 
            user : null
          }
        })
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
        setStateLayout((e)=>{
          return {
            ...e,
            isLoading : false, 
            isError : false, 
            user : data
          }
        })
  
      } catch (err) {
        console.log(err);
        await SecureStore.deleteItemAsync(INTERNAL_DATA_NAME);
        setStateLayout((e)=>{
          return {
            ...e,
            isLoading : false, 
            isError : true, 
            user : null
          }
        })
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
  
  
        <View className="flex-1 items-center justify-center flex-col -mt-36">
          {isLoading ? (<LoadingSubmit />) : (<Fragment>
            <Text className=" text-lg uppercase font-bold">Jaminan Kerahasiaan Identitas Pelapor</Text>
            <Text className=" text-sm lowercase mt-4 mb-4 mx-4">Kami memahami betapa pentingnya menjaga kerahasiaan dan anonimitas Anda saat menggunakan aplikasi pengaduan publik ini. Kami berkomitmen untuk memastikan bahwa segala bentuk informasi yang Anda sampaikan melalui aplikasi ini akan dijaga kerahasiaannya termasuk identitas anda.</Text>
            <View className="flex-row space-x-2">
              <TouchableOpacity className=" p-2 flex-col bg-slate-500 rounded" onPress={() => router.canGoBack() ? router.back() : router.push('/mitra')}>
                <Text className="text-white ">KEMBALI</Text>
              </TouchableOpacity>
              {__DEV__ ? (<TouchableOpacity className=" p-2 flex-col bg-red-700 rounded" onPress={() => loginDev()}>
              <Text className="text-white ">LOGIN DEV</Text>
            </TouchableOpacity>) : (<TouchableOpacity className=" p-2 flex-col bg-red-700 rounded" onPress={() => promptAsync()}>
              <Text className="text-white ">LANJUTKAN</Text>
            </TouchableOpacity>)}
            </View>
            <Text className="text-xs mt-2">klik tombol LANJUTKAN untuk masuk</Text>
          </Fragment>)}
        </View>
  
  
      </SafeAreaView>)
  
  
  
  
  
  
  }
  
  
  
  
  
  
  
  
  
  
  
  
  const LoadingSubmit = () => {
    return (<View className=" items-center justify-center flex-col mt-8">
      <Text>CHECK USER CREDENTIALS ...</Text>
    </View>)
  }