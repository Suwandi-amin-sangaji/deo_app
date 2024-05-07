import { FontAwesome, FontAwesome5, MaterialIcons, Ionicons, Entypo, Fontisto, MaterialCommunityIcons, AntDesign, Octicons, Foundation } from "@expo/vector-icons";
import React, { useEffect, useContext, createContext, useState, Fragment } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, Redirect, Tabs, useSegments, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaLayout } from '@components/safe-area-layout';
import IconPng from "@assets/icon.png";
import axios from 'axios';
import { useLayoutContext } from './_layout';
import Retool from '@components/Retool'



const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}




export default () => {
  const [webViewUrl, setWebViewUrl] = useState(null);
  const homeBackUrl  = '/(tabs)/mitra';
  const { title, user, basepath, baseApiUrl, logout } = useLayoutContext();
  const url = 'https://editor.deoairport.co.id/mobile/apps/android_dppu_pertamina/home';



  const setDevID = async(user) => {
    const device_id = await SecureStore.getItemAsync('deviceId');
    if(user?.token){
      setWebViewUrl(`${url}?device_id=${device_id}&token=${user.token}&baseApiUrl=${baseApiUrl}`);
    }else{
      setWebViewUrl(`${url}?device_id=${device_id}`);
    }
  }



  useEffect(()=>{
    setDevID(user);
  },[user])




  return (
    <SafeAreaLayout style={{ flex: 1 }} insets='top'>
    <Stack.Screen
      options={{
        headerShown: false
      }}
    />
      {!!webViewUrl && (
        <Retool 
          url={webViewUrl} 
          homeBackUrl={homeBackUrl} 
          user={user}
          baseApiUrl={baseApiUrl}
          logout={logout}
          />)}
    </SafeAreaLayout>
  )
}


/*import { FontAwesome, FontAwesome5, MaterialIcons, Ionicons, Entypo, Fontisto, MaterialCommunityIcons, AntDesign, Octicons, Foundation } from "@expo/vector-icons";
import React, { useEffect, useContext, createContext, useState, Fragment } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, Redirect, Tabs, useSegments, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaLayout } from '@components/safe-area-layout';
import IconPng from "@assets/icon.png";
import axios from 'axios';
import { useLayoutContext } from './_layout';



const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}






export default () => {

  const { title, user, basepath } = useLayoutContext()
 

  const menu = [

    {
      title: 'INTEGRASI DATA OPERASIONAL',
      basepath: basepath,
      base_color: '#be123c',
      listMenu: [
        {
          title: 'FORM PTI',
          href: '/draft-csd',
          icon: { component: FontAwesome, name: 'fire-extinguisher' }
        },
        {
          title: 'CSD SECURITY',
          href: '/csd-verified',
          icon: { component: MaterialIcons, name: 'security' }
        },
        {
          title: 'ACCOUNT',
          href: '/daftar-personil',
          icon: { component: MaterialIcons, name: 'security' }
        },
      ]
    },


  ]


  return (<SafeAreaLayout style={{ flex: 1 }} insets='top'>
    <Stack.Screen
      options={{
        headerShown: false
      }}
    />
    <View className=" flex-row items-center justify-between p-2">
      <TouchableOpacity className="p-1" onPress={() => router.push('/mitra')}>
        <Text className=" text-blue-500 text-xs">KEMBALI</Text>
      </TouchableOpacity>
      <View className=" flex-col items-center justify-center">
        <Text className=" text-md font-bold">HOME - {title}</Text>
      </View>
      <TouchableOpacity className="p-1 mr-4" onPress={() => router.push(`${basepath}/account`)}>
        <Image source={user.foto ? { uri: user.foto.url } : IconPng} style={{ width: 30, height: 30, borderRadius: 30 / 2 }} resizeMode="cover" />
      </TouchableOpacity>
    </View>

    <View className=" flex-1 bg-slate-200">
      <ScrollView scrollEventThrottle={8}>
        {menu.map((item, index) => {
          return (
            <Fragment key={index}>
              <View className=" flex-row items-center mx-4 rounded-xl py-1 px-4 mt-4 justify-between shadow-xs">
                <Text className="text-lg font-bold" style={{ color: item.base_color }}>{item.title}</Text>
              </View>
              <View className="px-4 flex-row flex-wrap items-center justify-evenly">

                {item.listMenu.map((ItemMenu, IndexMenu) => {
                  if (ItemMenu.title === null) {
                    return (<View
                      key={IndexMenu}
                      className="space-y-2 px-1 py-1 w-1/3"
                    >
                      <View className="py-2 rounded-xl items-center justify-center">
                        <Text className="text-xs text-center text-white font-normal"></Text>
                      </View>
                    </View>)
                  }
                  return (<TouchableOpacity
                    key={IndexMenu}
                    onPress={() => router.push(`${item.basepath}${ItemMenu.href}`)}
                    className="space-y-2 px-1 py-1 w-1/3"
                  >
                    <View className="py-2 rounded-xl border items-center justify-center" style={{ borderColor: ItemMenu.icon.color || item.base_color }}>
                      <ItemMenu.icon.component name={ItemMenu.icon.name} size={56} color={ItemMenu.icon.color || item.base_color} />
                      <Text className="text-xs text-center font-normal" style={{ color: ItemMenu.icon.color || item.base_color }}>{ItemMenu.title}</Text>
                    </View>
                  </TouchableOpacity>)
                })}
              </View>
            </Fragment>
          )
        })}
      </ScrollView>
    </View>
  </SafeAreaLayout>)
}*/