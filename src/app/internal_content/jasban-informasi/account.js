import { FontAwesome, FontAwesome5, MaterialIcons, Ionicons, Entypo, Fontisto, MaterialCommunityIcons, AntDesign, Octicons, Foundation } from "@expo/vector-icons";
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

  const { title, user, basepath, logout } = useLayoutContext()

  return (<SafeAreaLayout style={{ flex: 1 }} insets='top'>
    <Stack.Screen
      options={{
        headerShown: false
      }}
    />
    <View className=" flex-row items-center justify-between p-2">
      <TouchableOpacity className="p-1" onPress={() => router.canGoBack() ? router.back() : router.push(basepath)}>
        <Text className=" text-blue-500 text-xs">KEMBALI</Text>
      </TouchableOpacity>
      <View className=" flex-col items-center justify-center">
        <Text className=" text-md font-bold">PENGATURAN AKUN</Text>
      </View>
      <TouchableOpacity className="p-1 mr-4" onPress={() => router.push(`${basepath}/account`)}>
        <Image source={user.foto ? { uri: user.foto.url } : IconPng} style={{ width: 30, height: 30, borderRadius: 30 / 2 }} resizeMode="cover" />
      </TouchableOpacity>
    </View>

    <View className=" flex-1 bg-slate-200 items-center justify-center">
      <View className=" flex-col space-y-4">
      <TouchableOpacity className=" bg-red-700 p-2 rounded mx-4 items-center" onPress={logout}>
          <Text className="text-white uppercase">LOGOUT</Text>
        </TouchableOpacity>
      </View>
    </View>
  </SafeAreaLayout>)
}