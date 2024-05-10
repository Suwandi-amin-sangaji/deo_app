import React, { useRef, useEffect } from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import { Link, Stack, router } from 'expo-router';
import LottieView from 'lottie-react-native';
import * as SecureStore from 'expo-secure-store';
//import { useAuth } from "@context/auth";
import { getFetchClient } from '@api/getFetchClient';


export default function App() {
  const animation = useRef(null);
  //const { setAuth } = useAuth();
  //const { post } = getFetchClient();

  /*

  const renewToken = async (currentToken) => {
    try {
      const { data } = await post('/yori-android/renew-token', { token: currentToken });
      const saveData = JSON.stringify(data);
      await SecureStore.setItemAsync(process.env.EXPO_PUBLIC_ASYNC_STORAGE_NAME, saveData);
      setAuth(data);
      router.replace('/(tabs)/beranda');
    } catch (err) {
      setAuth(null);
      router.replace('/(tabs)/beranda');
    }
  };
*/

/*
  const chekingUser = async () => {
    try {
      const jsonValue = await SecureStore.getItemAsync(process.env.EXPO_PUBLIC_ASYNC_STORAGE_NAME);
      const restoredUser = jsonValue != null ? JSON.parse(jsonValue) : null;
      if(!restoredUser){
        setAuth(restoredUser);
        setTimeout(()=>{
          router.replace('/(tabs)/beranda');
        },3000)
      }else{
        renewToken(restoredUser.token);
      }
      
    } catch (e) {
      console.error(e);
    }
  };
*/



  useEffect(() => {
   // chekingUser();
    const timer = setTimeout(() => {
      router.replace('/(tabs)/beranda');
    }, 3000);

    return () => clearTimeout(timer); 
  }, []);







  return (
    <View className="flex-1 item-center items-center bg-white relative">
      <Stack.Screen options={{headerShown: false}}/>
      <View className="bg-gray-700 h-36 w-full items-center justify-center flex-col pt-16"> 
        <Text className="text-white font-bold text-md">DIREKTORAT JENDERAL PERHUBUNGAN UDARA</Text>
        <Text className="text-white font-bold text-lg">BLU UPBU KELAS I DEO - SORONG</Text>
      </View>
      
      
      <LottieView
        autoPlay
        ref={animation}
       
        style={{
          marginTop : 20,
          width: 350,
          height: 350,
          backgroundColor: '#FFFFFF',
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={require('./../../assets/groovyWalk.json')}
      />

      {/* <View className="p-4 mt-8">
        <Text className="text-xl font-semibold text-red-700">LOADING YOUR CONTENT ...</Text>
      </View> */}

      <View className="bg-gray-700 h-36 w-full items-center justify-center flex-col absolute bottom-0 space-y-0"> 
        <Text className="text-white font-bold text-md">KEMENTERIAN PERHUBUNGAN</Text>
        <Text className="text-white font-bold text-lg">REPUBLIK INDONESIA</Text>
        <Text className="text-white font-bold text-xl">2024</Text>
      </View>
    </View>
  );
}

