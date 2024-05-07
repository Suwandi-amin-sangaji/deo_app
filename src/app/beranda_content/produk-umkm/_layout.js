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
        name="gift"
        options={{
          title: 'GIFT',
          tabBarIcon: ({ color }) => <AntDesign name="gift" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">GIFT</Text>),
        }}
      />

      <Tabs.Screen
        name="clothes"
        options={{
          title: 'CLOTHES',
          tabBarIcon: ({ color }) => <Entypo name="price-tag" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">CLOTHES</Text>),
        }}
      />

      <Tabs.Screen
        name="health"
        options={{
          title: 'HEALTH',
          tabBarIcon: ({ color }) => <Entypo name="swarm" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">HEALTH</Text>),
        }}
      />

      <Tabs.Screen
        name="natural"
        options={{
          title: 'NATURALS',
          tabBarIcon: ({ color }) => <FontAwesome name="leaf" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">NATURALS</Text>),
        }}
      />

      <Tabs.Screen
        name="drinks"
        options={{
          title: 'DRINKS',
          tabBarIcon: ({ color }) => <FontAwesome name="coffee" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">DRINKS</Text>),
        }}
      />

      <Tabs.Screen
        name="craft"
        options={{
          title: 'CRAFT',
          tabBarIcon: ({ color }) => <FontAwesome name="puzzle-piece" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">CRAFT</Text>),
        }}
      />
      </Tabs>
  );
}