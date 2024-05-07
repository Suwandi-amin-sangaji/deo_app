
import { Platform, View, Text, FlatList, Image, TouchableOpacity, Pressable } from "react-native";
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { FontAwesome, FontAwesome5, MaterialIcons, Feather, Ionicons, Entypo, MaterialCommunityIcons, AntDesign, Octicons, Foundation } from "@expo/vector-icons";
import { Link, router } from 'expo-router';



const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

const menuDefault = [{
  title: 'EMPU KARGO',
  icon: () => (
    <Feather name="layers" size={56} color="#b91c1c" />),
  href: '/mitra-content/empu-cargo',
  asChild: true,

},
{
  title: 'OPERATOR AIRLINES',
  icon: () => (<Entypo name="aircraft" size={56} color="#b91c1c" />),
  href: '/mitra-content/airlines',
  asChild: true,

},
{
  title: 'DPPU PERTAMINA',
  icon: () => (<MaterialCommunityIcons name="tanker-truck" size={56} color="#b91c1c" />),
  href: '/mitra-content/dppu',
  asChild: true,

},
{
  title: 'GROUND HANDLING',
  icon: () => (<Entypo name="swap" size={56} color="#b91c1c" />),
  href: '/mitra-content/ground-handling',
  asChild: true,

},
{
  title: 'TENANT BANDARA',
  icon: () => (<Entypo name="shop" size={56} color="#b91c1c" />),
  href: '/mitra-content/tenant',
  asChild: true,

},
{
  title: 'PENGELOLAH KARGO',
  icon: () => (<FontAwesome5 name="warehouse" size={56} color="#b91c1c" />),
  href: '/mitra-content/warehouse',
  asChild: true,

}

]




const menuPerijinan = [{
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






const menuRekonInternal = [{
  title: 'DEWAN PENGAWAS',
  icon: () => (<MaterialCommunityIcons name="seat-passenger" size={56} color="rgb(21 128 61)" />),
  href: '/mitra-content/dewan-pengawas',
  asChild: true,

},
{
  title: 'PK BLU - KEMENKEU',
  icon: () => (<MaterialCommunityIcons name="beach" size={56} color="rgb(21 128 61)" />),
  href: '/mitra-content/pk-blu',
  asChild: true,
},
{
  title: 'PEMERINTAH DAERAH',
  icon: () => (<MaterialCommunityIcons name="beach" size={56} color="rgb(21 128 61)" />),
  href: '/mitra-content/pemda',
  asChild: true,
},
{
  title: 'DJPU - KANTOR PUSAT',
  icon: () => (<MaterialCommunityIcons name="beach" size={56} color="rgb(21 128 61)" />),
  href: '/mitra-content/pusat',
  asChild: true,
}

]






export default () => {
  return (
    <>
      <Text className="text-red-700 text-xl font-bold px-4 mt-4">
        LOGIN INTERNAL STACKHOLDER
      </Text>
      <View className="px-4 mt-2 flex-row flex-wrap items-center justify-evenly">
        {menuDefault.map((Item, index) => {
          return (<View className="space-y-2 px-1 py-1 bg-white w-1/2 mt-2" key={index}>
            <Link href={Item.href} asChild={Item.asChild}>
              <Pressable>
                <View className="py-2 rounded-xl border border-red-700 items-center justify-center">
                  {Item.icon()}
                  <Text className="text-xs text-center text-red-700 font-normal">{Item.title}</Text>
                </View>
              </Pressable>
            </Link>
          </View>)
        })}
      </View>


      <Text className="text-indigo-700 text-xl font-bold px-4 mt-4">
        LAYANAN PERIJINAN
      </Text>
      <View className="px-4 mt-2 flex-row flex-wrap items-center justify-evenly">
        {menuPerijinan.map((Item, index) => {
          return (<View className="space-y-2 px-1 py-1 bg-white w-1/2 mt-2" key={index}>
            <Link href={Item.href} asChild={Item.asChild}>
              <Pressable>
                <View className="py-2 rounded-xl border border-indigo-700 items-center justify-center">
                  {Item.icon()}
                  <Text className="text-xs text-center text-indigo-700 font-normal">{Item.title}</Text>
                </View>
              </Pressable>
            </Link>
          </View>)
        })}
      </View>


      <Text className="text-green-700 text-xl font-bold px-4 mt-4">
        LOGIN MONTORING INTERNAL
      </Text>
      <View className="px-4 mt-2 flex-row flex-wrap items-center justify-evenly">
        {menuRekonInternal.map((Item, index) => {
          return (<View className="space-y-2 px-1 py-1 bg-white w-1/2 mt-2" key={index}>
            <Link href={Item.href} asChild={Item.asChild}>
              <Pressable>
                <View className="py-2 rounded-xl border border-green-700 items-center justify-center">
                  {Item.icon()}
                  <Text className="text-xs text-center text-green-700 font-normal">{Item.title}</Text>
                </View>
              </Pressable>
            </Link>
          </View>)
        })}
      </View>
    </>
  )
}

