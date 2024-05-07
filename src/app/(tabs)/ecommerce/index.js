import React, { useCallback, useState } from 'react';
import { Image, ListRenderItemInfo, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TopNavigation, Button, Card, Layout, List, StyleService, useStyleSheet } from '@ui-kitten/components';
import { SafeAreaLayout } from '@components/safe-area-layout';
import { StrapiFormBuilder } from '@components/PublicForm';
import { FlashList } from "@shopify/flash-list";
import { useQuery } from '@tanstack/react-query';
import { getFetchClient } from '@api/getFetchClient';


//============================================================================
const TAG_USEQUERY = 'BERANDA_TOKO_DEO';
const TAG_USEQUERY_LAYOUT = 'BERANDA_TOKO_DEO_LAYOUT';
const MODEL = 'api::public-toko-deo.public-toko-deo';
const baseApiUrl = `${process.env.EXPO_PUBLIC_BACKEND_URL}/public-toko-deo`;
//============================================================================
import Retool from '@components/Retool'





export default () => {
  const { post } = getFetchClient();
  const [viewMode, setViewMode ] = useState('list');
  const webViewUrl  = 'https://editor.deoairport.co.id/mobile/apps/android_toko_deo/home';
  const homeBackUrl  = '/(tabs)/beranda';



  return (
    <SafeAreaLayout style={{flex : 1}} insets='top'>
      <Retool 
     url={webViewUrl}
     homeBackUrl={homeBackUrl}
     />
    </SafeAreaLayout>
  )
}










