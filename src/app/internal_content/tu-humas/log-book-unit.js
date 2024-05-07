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
import moment from "moment-timezone";





const classNames = (...classes) => classes.filter(Boolean).join(' ');
//=========================================
const MODEL = 'api::log-book-unit.log-book-unit';
const TITLE = "LOG BOOK";
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

const formatTampilanTanggal = (value) => {
  if (!value) {
    return null;
  }
  const dateTime = moment(value).tz('Asia/Tokyo');
  const year = dateTime.format('YYYY');
  const month = dateTime.format('MM');
  const day = dateTime.format('DD');
  return `${day}-${month}-${year}`;
};





function formatTanggal(tanggal) {
  const now = new Date();
  const inputDate = new Date(tanggal);
  const diffInDays = Math.round((now - inputDate) / (1000 * 60 * 60 * 24));
  if (diffInDays === 0) {
    return formatDistance(inputDate, now) + ' ago';
  } else if (diffInDays < 31) {
    return diffInDays + ' day ago';
  } else {
    return format(inputDate, 'EEEE, dd MMMM yyyy');
  }
}



export default () => {

  const { title, user, basepath, baseApiUrl } = useLayoutContext();
  const [viewMode, setViewMode] = useState(null);
  const [itemFocus, setItemFocus] = useState(null);
  const [parentFilter, setParentFilter] = useState([
    { data_unit_kerja: { id : {$eq: user.m_unit?.id || null  } } }
  ]);


  if(viewMode == 'add'){
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
        canCetak={user.m_unit?.id || false}
        canAdd={user.m_unit?.id || false}
        canFilter={user.m_unit?.id || false}
        setViewMode={setViewMode}
        setItemFocus={setItemFocus}
        RenderItem={RenderItem}
        parentFilter={parentFilter}
      />
    </View>
  </SafeAreaLayout>)
}






const FormAdd = ({ setViewMode, title, baseApiUrl, user, reloadData = ()=>{} }) => {
  console.log(user)

  const populateForm = {
    data_unit_kerja :{
      disconnect: [],
      connect: [ user.m_unit ?
        {
          id: user.m_unit.id,
          position: {
            end: true
          }
        } : null].filter(Boolean)
      }
  };

  const custom_fields = {
    title: {
      label: 'JUDUL LOG',
      required: true,
      type: "string",

    },
    descriptions: {
      label: 'DESKRIPSI LOG',
      required: true,
      type: "text",
    },
    image: {
      label: 'LAMPIRAN FOTO',
      required: true,
      type: "media",
      multiple: false,
      allowedTypes: [
        "images"
      ]
    },
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


  return (<View className="bg-white border border-slate-100 mb-2 rounded p-2">
    <View className=" flex-row items-center justify-between border-b border-slate-100">
      <View className=" flex-col">
        <Text className=" text-sm">
          {item.title}
        </Text>
        <Text className="text-xs text-gray-500">
          {formatTampilanTanggal(item.createdAt)} 
        </Text>
      </View>


      <View className=" flex-col items-center">
        

        {/**<Text className="text-xs text-gray-500">{item.createdBy?.firstname || null} {item.createdBy?.lastname || null}</Text> */}
      </View>




    </View>

    <View className="mt-2">
      <Text>
        {item.descriptions}
      </Text>
      {item.image ? (<View className=" flex-1 mt-2">
        <Image
          className={classNames('rounded h-56')}
          source={{ uri: item.image?.url }}
          contentFit="cover"
        />
      </View>) : null}
    </View>


    <View className="mt-2 flex-row justify-between items-center">
      <View className=" flex-col items-start justify-start">
        <Text className=" text-xs text-gray-500">
          created - {item.createdBy?.firstname || null}
        </Text>
        <Text className=" text-xs text-gray-500">
         {formatTanggal(item.createdAt)}
        </Text>
      </View>

      <View className=" flex-col items-end justify-end">
      <Text className=" text-xs text-gray-500">
          updated - {item.updatedBy?.firstname || null}
        </Text>
        <Text className=" text-xs text-gray-500">
         {formatTanggal(item.updatedAt)}
        </Text>
      </View>
    </View>



  </View>)
}








