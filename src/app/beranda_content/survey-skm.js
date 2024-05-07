import { View, Text } from 'react-native'
import React from 'react'
import Retool from '@components/Retool'



export default () => {
  const webViewUrl  = 'https://editor.deoairport.co.id/mobile/apps/android_survey_skm/home';
  const homeBackUrl  = '/(tabs)/beranda';

  return (
   
    <Retool 
     url={webViewUrl}
     homeBackUrl={homeBackUrl}
     />
 
)
}




