import { Link, Stack, router, usePathname, useLocalSearchParams } from 'expo-router';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import IconPng from "@assets/icon.png";
import { useEffect } from 'react';



const NoContent = () => {
  const pathname = usePathname();
  const params = useLocalSearchParams();



  useEffect(()=>{
    setTimeout(()=>{
      router.canGoBack() ? router.back() : router.push('/');
    },1000)
  },[])
 

  return (
    <>
      <View className=" flex-1 items-center justify-center bg-white">
      <View className="mb-4">
        <Image source={IconPng} style={{ width: 85, height: 85, borderRadius: 85 / 2 }} resizeMode="cover" />
      </View>
        <View className="flex-col">
        <Text className=" text-slate-500 mb-2 font-bold text-md">START LOGIN USER ...</Text>
        </View>
      </View>
    </>
  );
}

export default NoContent;


