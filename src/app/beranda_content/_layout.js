import { Stack, router } from 'expo-router';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, FlatList, Image } from 'react-native'

export default function Layout() {
  
  return <Stack 
  		screenOptions={{
  			//title: 'FLIGHT INFORMATIONS',
  			headerLeft: () => Platform.OS == 'ios' ? ((<TouchableOpacity
            className="py-1 mr-4"
            onPress={() => {
              router.push('/(tabs)/beranda');
            }}>
            <Text className="text-white text-xs font-bold">KEMBALI</Text>
          </TouchableOpacity>)) : null,
  			headerStyle: {
  				backgroundColor: '#b91c1c'
  			},
  			headerTintColor: '#fff',
  			headerTitleStyle: {
  				fontWeight: 'normal',
  			}
  		}}>
    
  </Stack>;
}