import { View } from 'react-native'
import React, { useEffect, useState } from 'react';
import { useNavigation, useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Retool from '@components/Retool'


export default () => {
  const [webViewUrl, setWebViewUrl] = useState(null);
  const navigation = useNavigation();
  const homeBackUrl  = '/(tabs)/beranda';



  useFocusEffect(() => {
    navigation.getParent().setOptions({
      title : 'INFORMASI KEBERANGKATAN'
    })
  })




  useEffect(()=>{
    const setDevID = async() => {
      const device_id = await SecureStore.getItemAsync('deviceId');
      setWebViewUrl(`https://editor.deoairport.co.id/mobile/apps/android_informasi_penerbangan/keberangkatan?device_id=${device_id}`);
    }
    setDevID();
  },[])




  return (
    <View className="flex-1 relative">
      {!!webViewUrl && (<Retool url={webViewUrl} homeBackUrl={homeBackUrl} />)}
    </View>
  )
}


