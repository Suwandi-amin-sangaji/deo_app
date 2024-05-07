import { Link, Stack, router, usePathname, useLocalSearchParams } from 'expo-router';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import IconPng from "@assets/icon.png";



const NoContent = () => {
  const pathname = usePathname();
  const params = useLocalSearchParams();
 


  return (
    <>
      <View className=" flex-1 items-center justify-center bg-white">

      <View className="mb-4">
        <Image source={IconPng} style={{ width: 85, height: 85, borderRadius: 85 / 2 }} resizeMode="cover" />
      </View>

        <View className="flex-col">
       {/** <Text className=" text-slate-500 mb-2 font-bold text-xs">{pathname}{JSON.stringify(params, null, 2)}</Text> */}
        <Text className=" text-slate-500 mb-2 font-bold text-md">OPPS! - THIS PAGE NOT FOUND</Text>
        </View>
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

export default NoContent;


