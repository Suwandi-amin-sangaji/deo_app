
import { Platform, View, Text, FlatList, Image, TouchableOpacity, Pressable } from "react-native";
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { FontAwesome, FontAwesome5, MaterialIcons, Ionicons, Entypo, MaterialCommunityIcons, AntDesign, Octicons, Foundation } from "@expo/vector-icons";
import { Link, router } from 'expo-router';



const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}


const menu = [{
  title : 'PANDUAN PENUMPANG',
  icon : () => (<MaterialCommunityIcons name="seat-passenger" size={56} color="#b91c1c" />),
  href : '/beranda_content/panduan-penumpang',
  asChild : true,
  
},
{
  title : 'INFORMASI PENERBANGAN',
  icon : () => (<Ionicons name="airplane-sharp" size={56} color="#b91c1c" />),
  href : '/beranda_content/informasi-penerbangan',
  asChild : true,
  
},
{
  title : 'JELAJAHI AREA TERMINAL',
  icon : () => (<MaterialCommunityIcons name="airport" size={56} color="#b91c1c" />),
  href : '/beranda_content/jelajahi-terminal',
  asChild : true,
  
},
{
  title : 'INFORMASI PARIWISATA',
  icon : () => (<MaterialCommunityIcons name="beach" size={56} color="#b91c1c" />),
  href : '/beranda_content/informasi-pariwisata',
  asChild : true,
  
},
{
  title : 'PAPUA PRIDE - UMKM',
  icon : () => (<AntDesign name="gift" size={56} color="#b91c1c" />),
  href : '/beranda_content/produk-umkm',
  asChild : true,
  
},
{
  title : 'SURVEY SKM - KEMENHUB',
  icon : () => (<Entypo name="emoji-happy" size={56} color="#b91c1c" />),
  href : '/beranda_content/survey-skm',
  asChild : true,
  
},
{
  title : 'SOP & REGULASI',
  icon : () => (<Octicons name="law" size={56} color="#b91c1c" />),
  href : '/beranda_content/sop-regulasi',
  asChild : true,
  
},
{
  title : 'LAYANAN KHUSUS',
  icon : () => (<Entypo name="landline" size={56} color="#b91c1c" />),
  href : '/beranda_content/layanan-khusus',
  asChild : true,
  
},
{
  title : 'DEO UPDATED',
  icon : () => (<Foundation name="burst-new" size={56} color="#b91c1c" />),
  href : '/beranda_content/deo-updated',
  asChild : true,
  
}]





export default () => {
  return (
    <View className="px-4 mt-2 flex-row flex-wrap items-center justify-evenly">

        {menu.map((Item, index)=>{
          return (<View className="space-y-2 px-1 py-1 bg-white w-1/3 mt-2" key={index}>
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
  )
}

