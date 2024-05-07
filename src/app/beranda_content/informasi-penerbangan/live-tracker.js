import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react';
import { Link, Stack, router, useNavigation, useFocusEffect } from 'expo-router';
import NoContent from '@components/NoContent';
import { useQuery, QueryClient } from '@tanstack/react-query';
import { getFetchClient } from '@api/getFetchClient';
import * as SecureStore from 'expo-secure-store';


//============================================================================
const TAG_USEQUERY = 'INFORMASI_KEBERANGKATAN';
const TAG_USEQUERY_LAYOUT = 'INFORMASI_KEBERANGKATAN__LAYOUT';
const MODEL = 'api::panduan-penumpang.panduan-penumpang';
const baseApiUrl = `${process.env.EXPO_PUBLIC_BACKEND_URL}/public-informasi-penerbangan`;
//============================================================================
import Retool from '@components/Retool'



export default () => {
  const { post } = getFetchClient();
  const [intervalMs, setIntervalMs] = React.useState(5000)
  const [webViewUrl, setWebViewUrl] = useState(null);
  const navigation = useNavigation();
  const homeBackUrl  = '/(tabs)/beranda';



  useFocusEffect(() => {
    navigation.getParent().setOptions({
      title : 'ON FLIGHT - DARI/KE SORONG'
    })
  })




  useEffect(()=>{
    const setDevID = async() => {
      const device_id = await SecureStore.getItemAsync('deviceId');
      setWebViewUrl(`https://editor.deoairport.co.id/mobile/apps/android_informasi_penerbangan/on_flight?device_id=${device_id}`);
    }
    setDevID();
  },[])




  return (
    <View className="flex-1 relative">
      {!!webViewUrl && (<Retool url={webViewUrl} homeBackUrl={homeBackUrl} />)}
    </View>
  )
}


