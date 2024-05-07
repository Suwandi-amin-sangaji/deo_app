import { View, Text } from 'react-native'
import React from 'react';
import { Link, Stack, router } from 'expo-router';


const Home = () => {
  return (
    <View>
      <Text>Home</Text>
      <Link   href={'/(tabs)/beranda'} className="p-4 bg-red-700 text-white rounded-lg">Go to Details</Link>

        
    </View>
  )
}

export default Home