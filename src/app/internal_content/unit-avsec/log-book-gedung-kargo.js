import { FontAwesome, FontAwesome5, MaterialIcons, Ionicons, Entypo, Fontisto, MaterialCommunityIcons, AntDesign, Octicons, Foundation } from "@expo/vector-icons";
import React, { useEffect, useContext, createContext, useState, Fragment, useCallback } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, StyleSheet, FlatList, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaLayout } from '@components/safe-area-layout';
import IconPng from "@assets/icon.png";
import { useLayoutContext } from './_layout';
import { getFetchClient } from '@api/getFetchClient';
import { formatDistance, format } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { MenuItem, OverflowMenu, } from '@ui-kitten/components';
import { StrapiFormBuilder } from '@context/StrapiFormProvider';
import { StrapiDataProvider } from "@context/StrapiDataProvider";

const classNames = (...classes) => classes.filter(Boolean).join(' ');
//=========================================
const MODEL = 'api::avsec-log-book.avsec-log-book';
const TITLE = "LOG BOOK GEDUNG KARGO";
const FILTERS = [
  {
    name: 'title',
    label: 'JUDUL LOG',
    type: "string",
    optionFilter: [
      { label: 'MENGANDUNG KATA', value: '$eq' },
      { label: 'TIDAK MENGANDUNG KATA', value: '$eq' }
    ]
  },
  {
    name: 'createdAt',
    label: 'TANGGAL PEMBUATAN',
    type: "date",
    optionFilter: [
      { label: 'DIATAS TANGGAL', value: '$gte' },
      { label: 'DIBAWAH TANGGAL', value: '$lte' },
    ]
  },
  {
    name: 'descriptions',
    label: 'DESKRPISI LOG',
    type: "string",
    optionFilter: [
      { label: 'MENGANDUNG KATA', value: '$eq' },
      { label: 'TIDAK MENGANDUNG KATA', value: '$eq' }
    ]
  }
];

//=========================================




export default () => {

  const { title, user, basepath, baseApiUrl } = useLayoutContext();
  const [viewMode, setViewMode] = useState(null);
  const [itemFocus, setItemFocus] = useState(null);
  const [parentFilter, setParentFilter] = useState([
    { pos: { $eq: 'GEDUNG_KARGO' } }
  ]);


  if(viewMode == 'ADD'){
    return (<FormAdd title={title} user={user} baseApiUrl={baseApiUrl} setViewMode={setViewMode}/> )
  }
  


  return (<SafeAreaLayout style={{ flex: 1 }} insets='top'>
    <Stack.Screen options={{ headerShown: false }} />
    <View className=" flex-row items-center justify-between p-2">
      <View className=" flex-col items-start justify-start">
        <Text className=" text-md font-bold">{TITLE} - {title}</Text>
        <Text className=" text-md">BLU UPBU DEO KELAS I  DEO - SORONG</Text>
      </View>
      <TouchableOpacity className="p-1 mr-4" onPress={() => router.push(`${basepath}/account`)}>
        <Image source={user.foto ? { uri: user.foto.url } : IconPng} style={{ width: 30, height: 30, borderRadius: 30 / 2 }} resizeMode="cover" />
      </TouchableOpacity>
    </View>

    <View className=" flex-1 bg-slate-200">
      <StrapiDataProvider
        model={MODEL}
        title={title}
        user={user}
        basepath={basepath}
        baseApiUrl={`${baseApiUrl}/find-many`}
        FILTERS={FILTERS}
        canCetak={true}
        canAdd={true}
        canFilter={true}
        setViewMode={setViewMode}
        setItemFocus={setItemFocus}
        RenderItem={RenderItem}
        parentFilter={parentFilter}
      />
    </View>
  </SafeAreaLayout>)
}






const FormAdd = ({ setViewMode, title, baseApiUrl, user, reloadData = ()=>{} }) => {

  const populateForm = {
  };

  const custom_fields = {
    name: {
      label: 'NAMA PERUSAHAN',
      required: true,
      type: "string",

    },
    no_telp: {
      label: 'URAIAN LAPORAN',
      required: true,
      type: "text",
    }
  };


  onSuccess = useCallback(() => {
    reloadData();
    setViewMode(null);
  }, [])

  return (<SafeAreaLayout style={{ flex: 1 }} insets='top'>
    <Stack.Screen options={{ headerShown: false }} />

    <View className=" flex-row items-center justify-between p-2">
      <TouchableOpacity className="p-1" onPress={() => setViewMode(null)}>
        <Text className=" text-blue-500 text-xs">BATAL</Text>
      </TouchableOpacity>
      <View className=" flex-col items-end justify-end">
        <Text className=" text-md font-bold">LOG BARU - {title}</Text>
        <Text className="text-xs text-slate-500">BLU UPBU KELAS I DEO - SORONG</Text>
      </View>
    </View>

    <View className=" flex-1 bg-slate-200">
      <StrapiFormBuilder
        mutateLink={`${baseApiUrl}/add`}
        onCreateSuccess={onSuccess}
        populateForm={populateForm}
        custom_fields={custom_fields}
        TAG_USEQUERY={'___'}
        isCreatingEntry={true}
        user={user}
        model={MODEL}
      />
    </View>
  </SafeAreaLayout>)
}












const RenderItem = ({ item }) => {


  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [visible, setVisible] = React.useState(false);

  const onItemSelect = (index) => {
    setSelectedIndex(index);
    setVisible(false);
  };


  const renderToggleButton = () => (
    <Text onPress={() => setVisible(true)}>
      TOGGLE MENU
    </Text>
  );


  return (<View className="bg-white border border-slate-100 mb-2 rounded p-2">
    <View className=" flex-row items-center justify-between border-b border-slate-100">
      <View className=" flex-col">
        <Text className=" text-sm">
          {item.name}
        </Text>
        <Text className="text-xs text-gray-500">
          {item.createdAt}
        </Text>
      </View>


      <View className=" flex-col items-center">
        <OverflowMenu
          anchor={renderToggleButton}
          visible={visible}
          selectedIndex={selectedIndex}
          onSelect={onItemSelect}
          onBackdropPress={() => setVisible(false)}
        >
          <MenuItem title='Users' />
          <MenuItem title='Orders' />
          <MenuItem title='Transactions' />
        </OverflowMenu>

        {/**<Text className="text-xs text-gray-500">{item.createdBy?.firstname || null} {item.createdBy?.lastname || null}</Text> */}
      </View>
    </View>

    <View className="mt-2">
      <Text>
        {item.descriptions}
      </Text>
      
    </View>



  </View>)
}








