import { Tabs } from 'expo-router';
import { Platform, View, StatusBar, useColorScheme, SafeAreaView, Text, FlatList, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState, useEffect, useMemo } from 'react'
import * as Animatable from "react-native-animatable";
import IconPng from "@assets/Logo.png";
import { FontAwesome, FontAwesome5, MaterialIcons, Ionicons, Entypo, Fontisto, MaterialCommunityIcons, AntDesign, Octicons, Foundation } from "@expo/vector-icons";

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
        name="holiday"
        options={{
          title: 'HOLIDAY',
          tabBarIcon: ({ color }) => <Fontisto name="holiday-village" size={24} color={color} />,
          title: () => (<Text className="text-xs text-white">HOLIDAY</Text>),
        }}
      />



      <Tabs.Screen
        name="beach"
        options={{
          title: 'BEACH',
          tabBarIcon: ({ color }) => <FontAwesome5 name="umbrella-beach" size={24} color={color} />,
          title: () => (<Text className="text-xs text-white">TRAVEL</Text>),
        }}
      />


      <Tabs.Screen
        name="naturals"
        options={{
          title: 'NATURALS',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="bird" size={24} color={color} />,
          title: () => (<Text className="text-xs text-white">HOTEL</Text>),
        }}
      />


      <Tabs.Screen
        name="promotions"
        options={{
          title: 'PROMOTIONS',
          tabBarIcon: ({ color }) => <Fontisto name="sait-boat" size={24} color={color} />,
          title: () => (<Text className="text-xs text-white">PROMOTIONS</Text>),
        }}
      />


      <Tabs.Screen
        name="fishing"
        options={{
          title: 'FISHING',
          tabBarIcon: ({ color }) => <FontAwesome5 name="fish" size={24} color={color} />,
          title: () => (<Text className="text-xs text-white">FISHING</Text>),
        }}
      />
    </Tabs>
  );
}