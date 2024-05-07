

import * as SecureStore from 'expo-secure-store';
import { Platform, View, Animated, SafeAreaView, Text, FlatList, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState, useEffect, useMemo, useRef, Fragment } from 'react'
import DropDownPicker from 'react-native-dropdown-picker';
import { FontAwesome, FontAwesome5, MaterialIcons, Ionicons, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, Stack, useSegments } from 'expo-router';
import { getFetchClient } from '@api/getFetchClient';




const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}



const menu = [
  {
    title: 'TEKNIK & OPERASI',
    basepath: '/internal_content',
    base_color: '#86198f',
    listMenu: [
      {
        title: 'UNIT LISTRIK',
        href: '/unit-listrik',
        icon : { component : MaterialIcons, name : 'electrical-services'}
      },
      {
        title: 'UNIT ELBAN',
        href: '/unit-elban',
        icon : { component : MaterialIcons, name : 'hdr-enhanced-select'}
      },
      {
        title: 'UNIT BANGLAND',
        href: '/unit-bangland',
        icon : { component : MaterialIcons, name : 'home-work'}
      },
      {
        title: 'UNIT A2B',
        href: '/unit-a2b',
        icon : { component : MaterialIcons, name : 'electric-rickshaw'}
      },
      {
        title: 'UNIT AMC',
        href: '/unit-amc',
        icon : { component : MaterialIcons, name : 'flight-land'}
      },
      {
        title: null,
        href: null,
        icon :null
      },
    ]
  },
  {
    title: 'KEAMANAN PENERBANGAN',
    basepath: '/internal_content',
    base_color: '#be123c',
    listMenu: [
      {
        title: 'UNIT PKP-PK',
        href: '/unit-pk',
        icon : { component : FontAwesome, name : 'fire-extinguisher'}
      },
      {
        title: 'UNIT AVSEC',
        href: '/unit-avsec',
        icon : { component : MaterialIcons, name : 'security'}
      },
      {
        title: null,
        href: null,
        icon :null
      },
    ]
  },
  {
    title: 'PELAYANAN & JASA',
    basepath: '/internal_content',
    base_color: '#16a34a',
    listMenu: [
      {
        title: 'PETUGAS LLAU',
        href: '/jasban-llau',
        icon : { component : Entypo, name : 'shopping-cart'}
      },
      {
        title: 'PETUGAS PNBP',
        href: '/jasban-pnbp',
        icon : { component : Entypo, name : 'shopping-cart'}
      },
      {
        title: 'PETUGAS INFORMASI',
        href: '/jasban-informasi',
        icon : { component : Entypo, name : 'sound-mix'}
      }
    ]
  },
  {
    title: 'TATA USAHA',
    basepath: '/internal_content',
    base_color: '#b91c1c',
    listMenu: [
      {
        title: 'KEPEGAWAIAN & ORGANISASI',
        href: '/tu-kepegawaian',
        icon : { component : MaterialCommunityIcons, name : 'family-tree'}
      },
      {
        title: 'LAPORAN & PERSURATAN',
        href: '/tu-laporan',
        icon : { component : Entypo, name : 'documents'}
      },
      {
        title: 'KEUANGAN, ASSET & BMN',
        href: '/tu-keuangan',
        icon : { component : MaterialIcons, name : 'money'}
      },
      {
        title: 'HUMAS',
        href: '/tu-humas',
        icon : { component : FontAwesome5, name : 'globe-asia'}
      },
      {
        title: null,
        href: null,
        icon :null
      },
      {
        title: null,
        href: null,
        icon :null
      },
    ]
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
            <Text className="text-white font-bold">INTERNAL PERSONIL ONLY</Text>
            <Text className="text-xs text-white font-normal uppercase">KANTOR BLU UPBU DEO - SORONG</Text>
          </View>
        </View>
        <View className={classNames(Platform.OS === 'android' ? 'mt-4' : 'mt-8', 'flex-row items-center justify-center shadow-lg mr-4 space-x-6')}>

          <TouchableOpacity>
            <Ionicons name="notifications-sharp" size={24} color="#ffffff" />
          </TouchableOpacity>


          <TouchableOpacity onPress={() => router.push('/internal_content/account')}>
            <FontAwesome name="qrcode" size={24} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/internal_content/account')}>
            <FontAwesome5 name="bars" size={24} color="#ffffff" />
          </TouchableOpacity>

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