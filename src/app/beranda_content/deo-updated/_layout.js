import { Tabs } from 'expo-router';
import { Platform, View, StatusBar, useColorScheme, SafeAreaView, Text, FlatList, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState, useEffect, useMemo } from 'react'
import * as Animatable from "react-native-animatable";
import IconPng from "@assets/Logo.png";
import { FontAwesome, FontAwesome5, MaterialIcons, Ionicons, Entypo, MaterialCommunityIcons, AntDesign, Octicons, Foundation } from "@expo/vector-icons";

export default function TabLayout() {





  return (
      <Tabs 
        initialRouteName="event"
        screenOptions={{
        tabBarInactiveTintColor: '#fef2f2',
        tabBarActiveTintColor: '#FFFFFF',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#b91c1c',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 2
        }
      }}
    >
    
      <Tabs.Screen
        name="event"
        options={{
          title: 'EVENTS',
          tabBarIcon: ({ color }) => <MaterialIcons name="event-note" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">EVENTS</Text>),
        }}
      />

      <Tabs.Screen
        name="artikel"
        options={{
          title: 'ARTICLE',
          tabBarIcon: ({ color }) => <FontAwesome5 name="newspaper" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">ARTICLES</Text>),
        }}
      />

      <Tabs.Screen
        name="laporan"
        options={{
          title: 'REPORTS',
          tabBarIcon: ({ color }) => <AntDesign name="barchart" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">REPORTS</Text>),
        }}
      />

      <Tabs.Screen
        name="galery"
        options={{
          title: 'GALERY',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="image-album" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">GALERY</Text>),
        }}
      />

      <Tabs.Screen
        name="penghargaan"
        options={{
          title: 'AWARDS',
          tabBarIcon: ({ color }) => <MaterialIcons name="emoji-events" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">AWARDS</Text>),
        }}
      />

      <Tabs.Screen
        name="tentang-kami"
        options={{
          title: 'GALERY',
          tabBarIcon: ({ color }) => <Image source={IconPng} style={{ width: 24, height: 24, borderRadius: 24 / 2 }} resizeMode="cover" />,
          title: ()=>(<Text className="text-xs text-white">PROFILE</Text>),
        }}
      />
      </Tabs>
  );
}