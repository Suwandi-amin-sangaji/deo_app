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
        name="facility"
        options={{
          title: 'FACILITY',
          tabBarIcon: ({ color }) => <FontAwesome5 name="wifi" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">FACILITY</Text>),
        }}
      />

      <Tabs.Screen
        name="foods"
        options={{
          title: 'FOODS',
          tabBarIcon: ({ color }) => <Ionicons name="fast-food-outline" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">FOODS</Text>),
        }}
      />

      <Tabs.Screen
        name="shops"
        options={{
          title: 'SHOPS',
          tabBarIcon: ({ color }) => <FontAwesome name="shopping-bag" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">SHOPS</Text>),
        }}
      />

      <Tabs.Screen
        name="play"
        options={{
          title: 'PLAY',
          tabBarIcon: ({ color }) => <Ionicons name="logo-playstation" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">PLAY</Text>),
        }}
      />
      {/*<Ionicons name="logo-playstation" size={24} color={color} />*/}

      <Tabs.Screen
        name="funs"
        options={{
          title: 'FUNS',
          tabBarIcon: ({ color }) => <Entypo name="modern-mic" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">FUNS</Text>),
        }}
      />

      

      <Tabs.Screen
        name="office"
        options={{
          title: 'OFFICE',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="office-building-marker" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">OFFICE</Text>),
        }}
      />


      </Tabs>
  );
}