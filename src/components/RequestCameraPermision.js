import { Link, Stack, router } from 'expo-router';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import IconPng from "@assets/icon.png";

const RequestCameraPermision = () => {
  return (
    <>
      <View className=" flex-1 items-center justify-center bg-white">
      <View className="mb-4">
        <Image source={IconPng} style={{ width: 85, height: 85, borderRadius: 85 / 2 }} resizeMode="cover" />
      </View>
        <Text className=" text-slate-500 mb-2 font-normal text-lg lowercase">REQUEST CAMERA permission ...</Text>
      </View>
    </>
  );
}

export default RequestCameraPermision;


