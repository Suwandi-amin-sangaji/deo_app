

import { Platform, View, Animated, SafeAreaView, Text, FlatList, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState, useEffect, useMemo, useRef, Fragment } from 'react'
import { FontAwesome, FontAwesome5, MaterialIcons, Ionicons, Entypo, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { router, Stack, useSegments } from 'expo-router';
import { getFetchClient } from '@api/getFetchClient';




const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}




const menu = [
  {
    title: 'INTERNAL STACKHOLDER',
    basepath: '/mitra-content',
    base_color: '#be123c',
    listMenu: [
      {
        title: 'EMPU KARGO',
        href: '/empu-kargo',
        icon : { component : Feather, name : 'layers'}
      },
      {
        title: 'TENANT BANDARA',
        href: '/tenant-bandara',
        icon : { component : Entypo, name : 'shop'}
      },
      {
        title: 'DPPU PERTAMINA',
        href: '/dppu-pertamina',
        icon : { component : MaterialCommunityIcons, name : 'tanker-truck'}
      },
      {
        title: 'GROUND HANDLING',
        href: '/ground-handling',
        icon : { component : Entypo, name : 'swap'}
      },
      {
        title: 'OPERATOR AIRLINES',
        href: '/operator-airlines',
        icon : { component : Entypo, name : 'aircraft'}
      },
      {
        title: 'PENGELOLAH KARGO',
        href: '/pengelola-kargo',
        icon : { component : FontAwesome5, name : 'warehouse'}
      },
      /*{
        title: null,
        href: null,
        icon :null
      },*/
    ]
  },

]













const menuTataUsaha = [
  {
    title: 'PK BLU - KEMENKEU',
    icon: () => (<MaterialCommunityIcons name="beach" size={56} color="rgb(21 128 61)" />),
    href: '/mitra-content/pk-blu',
    asChild: true,
  },
  {
    title: 'DEWAN PENGAWAS',
    icon: () => (<MaterialCommunityIcons name="seat-passenger" size={56} color="rgb(21 128 61)" />),
    href: '/mitra-content/dewan-pengawas',
    asChild: true,
  },
  {
    title: 'DJPU - KANTOR PUSAT',
    icon: () => (<MaterialCommunityIcons name="beach" size={56} color="rgb(21 128 61)" />),
    href: '/mitra-content/pusat',
    asChild: true,
  }

]



const menuJasa = [
  {
    title: 'PERIJINAN PAS BANDARA',
    icon: () => (<MaterialCommunityIcons name="seat-passenger" size={56} color="rgb(67 56 202)" />),
    href: '/beranda_content/panduan-penumpang',
    asChild: true,
  
  },
  {
    title: 'OPERATOR AIRLINES',
    icon: () => (<Ionicons name="airplane-sharp" size={56} color="rgb(67 56 202)" />),
    href: '/beranda_content/informasi-penerbangan',
    asChild: true,
  
  },
  {
    title: 'DPPU PERTAMINA',
    icon: () => (<MaterialCommunityIcons name="airport" size={56} color="rgb(67 56 202)" />),
    href: '/beranda_content/jelajahi-terminal',
    asChild: true,
  
  },
  {
    title: 'GROUND HANDLING',
    icon: () => (<MaterialCommunityIcons name="beach" size={56} color="rgb(67 56 202)" />),
    href: '/beranda_content/informasi-pariwisata',
    asChild: true,
  
  },
  {
    title: 'TENANT BANDARA',
    icon: () => (<MaterialCommunityIcons name="beach" size={56} color="rgb(67 56 202)" />),
    href: '/beranda_content/informasi-pariwisata',
    asChild: true,
  
  },
  {
    title: 'PENGELOLAH KARGO',
    icon: () => (<MaterialCommunityIcons name="beach" size={56} color="rgb(67 56 202)" />),
    href: '/beranda_content/informasi-pariwisata',
    asChild: true,
  
  }
  
]

const Internal = () => {

  const scrollY = useRef(new Animated.Value(0)).current;
  const [user, setUser] = useState(null);
  const { post } = getFetchClient();
  const segments = useSegments();



  return (


    <View className="flex-1 bg-white relative">
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />






      <View className={classNames(
        // Platform.OS === 'android' ? 'mt-8' : '',
        //   Platform.OS === 'android' ? 'px-2' : 'px-4',
        'flex-row items-center justify-between bg-gray-700 py-4'
      )}>
        <View className={classNames(Platform.OS === 'android' ? 'mt-4' : 'mt-8', 'ml-4 space-y-0 flex-row items-center space-x-2')}>
          <View className=" items-center justify-center">
          </View>
          <View>
            <Text className="text-white font-bold">INTERNAL STACKHOLDER </Text>
            {/**<Text className="text-xs text-white font-normal uppercase">{user.m_unit?.name || 'UNKNOW' } </Text> */}
            <Text className="text-xs text-white font-normal uppercase">KANTOR BLU UPBU DEO - SORONG</Text>
          </View>
        </View>
        <View className={classNames(Platform.OS === 'android' ? 'mt-4' : 'mt-8', 'flex-row items-center justify-center shadow-lg mr-4 space-x-6')}>

          

        </View>

      </View>


    

      <ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={8}>


        {menu.map((item, index) => {
          return (
            <Fragment key={index}>
              <View className=" flex-row items-center bg-white mx-4 rounded-xl py-1 px-4 mt-4 justify-between shadow-xs">
                <Text className="text-lg font-bold" style={{ color: item.base_color }}>{item.title}</Text>
              </View>
              <View className="px-4 flex-row flex-wrap items-center justify-evenly">

                {item.listMenu.map((ItemMenu, IndexMenu) => {
                  if(ItemMenu.title === null){
                    return (<View 
                      key={IndexMenu}
                      className="space-y-2 px-1 py-1 bg-white w-1/3"
                    >
                      <View className="py-2 rounded-xl border border-white items-center justify-center">
                        <Text className="text-xs text-center text-white font-normal"></Text>
                      </View>
                    </View>)
                  }
                  return (<TouchableOpacity
                    key={IndexMenu}
                    onPress={() => router.push(`${item.basepath}${ItemMenu.href}`)}
                    className="space-y-2 px-1 py-1 bg-white w-1/3"
                  >
                    <View className="py-2 rounded-xl border items-center justify-center" style={{borderColor : ItemMenu.icon.color || item.base_color}}>
                      <ItemMenu.icon.component  name={ItemMenu.icon.name} size={56} color={ItemMenu.icon.color || item.base_color}/>
                      <Text className="text-xs text-center font-normal" style={{ color:ItemMenu.icon.color || item.base_color }}>{ItemMenu.title}</Text>
                    </View>
                  </TouchableOpacity>)
                })}
              </View>
            </Fragment>
          )
        })}
      </ScrollView>
    </View>


  )
}

export default Internal