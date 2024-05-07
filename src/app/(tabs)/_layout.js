import { Link, Tabs, Stack } from 'expo-router';
import { Platform, View, StatusBar, useColorScheme, SafeAreaView, Text, FlatList, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useEffect, createContext, useContext, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query'
import io from 'socket.io-client';
import { FontAwesome, FontAwesome5, MaterialIcons, Ionicons, Entypo, MaterialCommunityIcons, AntDesign, Octicons, Foundation } from "@expo/vector-icons";




const SocketIoContext = createContext(null);
export function useSocketIo() {
  return useContext(SocketIoContext);
}



function TabBarIcon() {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}



export default function TabLayout() {
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState(null);
  const [errorSocket, setErrorSocket] = useState(null);
  const [activeUsers, setActiveUsers] = useState(0);
  const colorScheme = useColorScheme();







  useEffect(() => {
  /*  const newSocket = io(process.env.EXPO_PUBLIC_SOCKET_IO_URL);
    setSocket(newSocket);

    // Mendengarkan kesalahan koneksi
    newSocket.on('connect_error', (err) => {
      setErrorSocket(`Koneksi ke server gagal: ${err.message}`);
    });

    // Mendengarkan saat koneksi terputus
    newSocket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        // Server menutup koneksi
        setErrorSocket('Terputus dari server');
      }
      // Coba kembali terhubung setelah 5 detik
      setTimeout(() => newSocket.connect(), 5000);
    });

    // Pendaftaran listener di sini
    newSocket.on('invalidateQueries', (data) => {
      console.log('ADA PESAN YANG DATANG')
      queryClient.invalidateQueries({ queryKey: [data.TAG_USEQUERY] });
    });

    newSocket.on('activeUsers', (data) => {
      console.log(data)
      setActiveUsers(data)
    });

    return () => {
      newSocket.close();
      newSocket.off('invalidateQueries');
      newSocket.off('activeUsers');
    }*/
  }, []);






  return (
    <>
    
    {/**<SocketIoContext.Provider
      value={{
        socket: socket,
        activeUsers: activeUsers,
        errorSocket: errorSocket,
      }}> */}

      <Tabs 
        initialRouteName="beranda"
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
        name="beranda"
        options={{
          title: 'BERANDA',
          tabBarIcon: ({ color }) => <FontAwesome name="windows" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">BERANDA</Text>),
        }}
      />

      <Tabs.Screen
        name="ecommerce"
        options={{
          title: 'DEO SHOP',
          tabBarIcon: ({ color }) => <FontAwesome name="shopping-bag" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">TOKO DEO</Text>),
        }}
      />


      <Tabs.Screen
        name="mitra"
        options={{
          title: 'LAYANAN MITRA',
          tabBarIcon: ({ color }) => <FontAwesome5 name="user-friends" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">MITRA APPS</Text>),
        }}
      />


      <Tabs.Screen
        name="pengaduan"
        options={{
          title: 'KELUHAN PELANGGAN',
          tabBarIcon: ({ color }) => <Entypo name="emoji-sad" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">KELUHAN</Text>),
        }}
      />


      <Tabs.Screen
        name="internal"
        options={{
          title: 'KELUHAN PELANGGAN',
          tabBarIcon: ({ color }) => <MaterialIcons name="settings-input-component" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">INTERNAL</Text>),
        }}
      />


      {/*<Tabs.Screen
        name="[beb]"
        options={{
          title: 'KELUHAN PELANGGAN',
          href: {
            pathname: '/sadasdasdas',
            params: {
              user: 'evanbacon',
            },
          },
          tabBarIcon: ({ color }) => <MaterialIcons name="settings-input-component" size={24} color={color} />,
          title: ()=>(<Text className="text-xs text-white">INTERNAL</Text>),
        }}
      />*/}


      




      

      </Tabs>



{/**</SocketIoContext.Provider> */}
    </>
  );
}