import { View, Text } from 'react-native'
import React, { Fragment } from 'react'
import { Link, Stack, router, useNavigation, useFocusEffect } from 'expo-router';
import { SafeAreaLayout } from '@components/safe-area-layout';
import Retool from '@components/Retool'



export default () => {
  const webViewUrl  = 'https://editor.deoairport.co.id/mobile/apps/android_deo_update/tentang_kami';
  const homeBackUrl  = '/(tabs)/beranda';

  const navigation = useNavigation();
  useFocusEffect(() => {
    navigation.getParent().setOptions({
      title : 'TENTANG KAMI'
    })
  })

  return (
   
       <Retool 
        url={webViewUrl}
        homeBackUrl={homeBackUrl}
        />
    
  )
}

