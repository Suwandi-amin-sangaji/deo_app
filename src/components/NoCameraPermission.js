import { Link, Stack, router } from 'expo-router';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import IconPng from "@assets/icon.png";

const NoCameraPermission = () => {
  return (
    <>
      <View className=" flex-1 items-center justify-center bg-white">

      <View className="mb-4">
        <Image source={IconPng} style={{ width: 85, height: 85, borderRadius: 85 / 2 }} resizeMode="cover" />
      </View>

        <Text className=" text-slate-500 mb-2 font-bold text-md">CANNOT ACCESS CAMERA</Text>
        <TouchableOpacity
          onPress={()=>{
            router.canGoBack() ? router.back() : router.push('/(tabs)/beranda')
          }} 
          className=" bg-red-700 p-2 rounded">
          <Text className=" text-white uppercase">
            {router.canGoBack() ? 'GO BACK' : 'BACK TO HOME'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

export default NoCameraPermission;


