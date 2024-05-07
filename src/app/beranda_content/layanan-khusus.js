import { View } from 'react-native'
import React, { useEffect, useState } from 'react';
import { useNavigation, useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaLayout } from '@components/safe-area-layout';
import Retool from '@components/Retool'


export default () => {
  const [webViewUrl, setWebViewUrl] = useState(null);
  const navigation = useNavigation();
  const homeBackUrl  = '/(tabs)/beranda';



  useFocusEffect(() => {
    navigation.setOptions({
      headerShown : false,
      title : 'SAAT DI TERMINAL'
    })
  })




  useEffect(()=>{
    const setDevID = async() => {
      const device_id = await SecureStore.getItemAsync('deviceId');
      setWebViewUrl(`https://editor.deoairport.co.id/mobile/apps/android_layanan_khusus/home?device_id=${device_id}`);
    }
    setDevID();
  },[])




  return (
    <SafeAreaLayout style={{ flex: 1 }} insets='top'>
      {!!webViewUrl && (<Retool url={webViewUrl} homeBackUrl={homeBackUrl} />)}
    </SafeAreaLayout>
  )
}


