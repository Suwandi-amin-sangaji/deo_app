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
    navigation.getParent().setOptions({
      headerShown : false,
      title : 'SEBELUM BERANGKAT'
    })
  })




  useEffect(()=>{
    const setDevID = async() => {
      const device_id = await SecureStore.getItemAsync('deviceId');
      setWebViewUrl(`https://editor.deoairport.co.id/mobile/apps/android_panduan_penumpang/before_flight?device_id=${device_id}`);
    }
    setDevID();
  },[])




  return (
    <SafeAreaLayout style={{ flex: 1 }} insets='top'>
      {!!webViewUrl && (<Retool url={webViewUrl} homeBackUrl={homeBackUrl} />)}
    </SafeAreaLayout>
  )
}


