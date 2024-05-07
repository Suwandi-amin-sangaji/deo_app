import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';
import * as Random from 'expo-random';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect, createContext, useContext, useState } from 'react';
import { useColorScheme, AppStateStatus } from 'react-native';
export { ErrorBoundary } from 'expo-router';
import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query'
import { NotificationProvider } from '@context/notification';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useAppState } from '@hooks/useAppState'
import { useOnlineManager } from '@hooks/useOnlineManager'
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { SafeAreaProvider } from 'react-native-safe-area-context';


SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
})


function onAppStateChange(status) {
  focusManager.setFocused(status === 'active')
}




export default function Layout() {

  const [deviceId, setDeviceId] = useState(null);
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require('@assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useOnlineManager()
  useAppState(onAppStateChange)








  async function getOrCreateDeviceId() {
    try {
      const storedId = await SecureStore.getItemAsync('deviceId');
      if (storedId) {
        setDeviceId(storedId);
        return storedId;
      } else {
        const newId = uuidv4();
        await SecureStore.setItemAsync('deviceId', newId);
        setDeviceId(newId);
      }
    }
    catch (error) {
      return null; // atau handle error sesuai kebutuhan Anda
    }
  }


  useEffect(() => {
    getOrCreateDeviceId();
  }, [])



  useEffect(() => {
    if (error) throw error;
  }, [error]);



  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);


  if (!loaded) {
    return null;
  }


  if (!deviceId) {
    return null;
  }


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ApplicationProvider {...eva} theme={colorScheme === 'dark' ? eva.dark : eva.light}>
          <QueryClientProvider client={queryClient}>
            <NotificationProvider>
            <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }} />
            </SafeAreaProvider>
            </NotificationProvider>
          </QueryClientProvider>
        </ApplicationProvider>
      
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
