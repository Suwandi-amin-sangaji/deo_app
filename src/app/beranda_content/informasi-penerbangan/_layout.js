import { Tabs } from 'expo-router';
import { Platform, View, StatusBar, useColorScheme, SafeAreaView, Text, FlatList, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState, useEffect, useMemo } from 'react'
import * as Animatable from "react-native-animatable";
import IconPng from "@assets/Logo.png";
import { FontAwesome, FontAwesome5, MaterialIcons, Ionicons, Entypo, MaterialCommunityIcons, AntDesign, Octicons, Foundation } from "@expo/vector-icons";

export default function TabLayout() {



  return (
      <Tabs 
        initialRouteName="keberangkatan"
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
        name="keberangkatan"
        options={{
          
          title: 'DEPARTURES',
          tabBarIcon: ({ color }) => <FontAwesome5 name="plane-departure" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">DEPARTURES</Text>),
        }}
      />

      <Tabs.Screen
        name="kedatangan"
        options={{
       
          title: 'ARRIVALS',
          tabBarIcon: ({ color }) => <FontAwesome5 name="plane-arrival" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">ARRIVALS</Text>),
        }}
      />

      {/*<Tabs.Screen
        name="on-ground"
        options={{
          
          title: 'ON GROUND',
          tabBarIcon: ({ color }) => <FontAwesome5 name="plane" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">ON GROUND</Text>),

          tabBarIcon: ({ color }) => {

            return (<TouchableOpacity
              //onPress={() => navigation.navigate("Beranda_index")}
              className="absolute -bottom-1 w-20 h-20 border-l-2 border-r-2 border-t-4 border-red-600 rounded-full items-center justify-center"
            >
              <Animatable.View
                animation={"pulse"}
                easing="ease-in-out"
                iterationCount={"infinite"}
                className="w-16 h-16 items-center justify-center rounded-full bg-red-600"
              >
                <Image source={IconPng} style={{ width: 65, height: 65, borderRadius: 65 / 2 }} resizeMode="cover" />
              </Animatable.View>
            </TouchableOpacity>)
          },
        }}

        
      />*/}

      <Tabs.Screen
        name="on-ground"
        options={{
        
          title: 'ON GROUND',
          tabBarIcon: ({ color }) => <FontAwesome5 name="plane" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">ON GROUND</Text>),
        }}
      />

      <Tabs.Screen
        name="live-tracker"
        options={{
         
          title: 'LIVE TRACK',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="airplane-marker" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">LIVE TRACK</Text>),
        }}
      />

      
      </Tabs>
  );
}