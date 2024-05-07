import { FontAwesome, FontAwesome5, MaterialIcons, Ionicons, Entypo, Fontisto, MaterialCommunityIcons, AntDesign, Octicons, Foundation } from "@expo/vector-icons";
import React, { useEffect, useContext, createContext, useState, Fragment, useCallback, useMemo, memo } from 'react';
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


const formatTampilanJam = (value) => {
  if (!value) {
    return null;
  }
  const dateTime = moment(value).tz('Asia/Tokyo');
  const hoursUTC = dateTime.format('HH');
  const minutesUTC = dateTime.format('mm');
  return `${hoursUTC}:${minutesUTC}`;
};


function calculateTimeDifference(time1, time2) {
  const date1 = new Date(time1);
  const date2 = new Date(time2);
  let timeDifference = Math.abs(date2 - date1);
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  timeDifference -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  timeDifference -= hours * (1000 * 60 * 60);
  const minutes = Math.floor(timeDifference / (1000 * 60));
  if (days > 0) {
    return `${days} HARI ${hours} JAM ${minutes} MENIT`;
  } else if (hours > 0) {
    return `${hours} JAM ${minutes} MENIT`;
  } else {
    return `${minutes} MENIT`;
  }
}


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


//=========================================
const MODEL = 'api::data-pengaduan.data-pengaduan';
const TITLE = "DATA PENGADUAN";
const FILTERS = [
  {
    name: 'name',
    label: 'NAMA PERSONIL',
    type: "string",
    optionFilter: [
      { label: 'MENGANDUNG KATA', value: '$containsi' },
      { label: 'TIDAK MENGANDUNG KATA', value: '$notContainsi' }
    ]
  },
  {
    name: 'createdAt',
    label: 'TANGGAL REGISTER',
    type: "date",
    optionFilter: [
      { label: 'DIATAS TANGGAL', value: '$gte' },
      { label: 'DIBAWAH TANGGAL', value: '$lte' },
    ]
  }
];


//=========================================




export default () => {

  const { title, user, basepath, baseApiUrl } = useLayoutContext();
  const [viewMode, setViewMode] = useState(null);
  const [itemFocus, setItemFocus] = useState(null);
  const [parentFilter, setParentFilter] = useState([
    {status : { $eq : 'CLOSE'}}
  ]);




  const canAdd = false
  const canCetak = false;

  const canFilter = useMemo(() => {
    if (!user) {
      return false;
    }
    if (user.is_admin_it) {
      return false;
    }
    if(user.is_superadmin){
      return true
    }
    return false;
  }, [user])



  const setViewModeCallback = useCallback((params)=>{
    setViewMode(params)
  },[])


  
  const setItemFocusCallback = useCallback((params)=>{
    setItemFocus(params)
  },[])





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
        baseApiUrl={`${baseApiUrl}/find-many`}
        model={MODEL}
        title={title}
        user={user}
        basepath={basepath}
        FILTERS={FILTERS}
        canCetak={canCetak}
        canAdd={canAdd}
        canFilter={canFilter}
        setViewMode={setViewModeCallback}
        setItemFocus={setItemFocus}
        RenderItem={RenderItem}
        parentFilter={parentFilter}
      />
    </View>
  </SafeAreaLayout>)
}











const RenderItem = ({ item, user, setViewMode, setItemFocus }) => {



  return (<View className="bg-white border border-slate-100 mb-2 rounded p-2">
    <View className=" flex-row items-center justify-between border-b border-slate-100">
      <View className=" flex-col">
        <Text className={classNames('text-sm')}>
          {item.title}
        </Text>
        <View className="flex-row space-x-2 p-1">
          <Text className="text-xs text-gray-500 font-bold">
            {formatTanggal(item.createdAt)}
          </Text>
          {item.status == 'CLOSE' ? (<View className="items-center justify-center rounded-xl">
            <View className=" bg-green-700 rounded items-center justify-center px-1">
              <Text className=" text-white text-xs font-bold">closed</Text>
            </View>
          </View>) : (<View className="items-center justify-center rounded-xl">
            <View className=" bg-red-700 rounded items-center justify-center px-1">
              <Text className=" text-white text-xs font-bold">open</Text>
            </View></View>)}
        </View>

      </View>

    </View>

    <View className="flex-col">
      <Text className=" mt-1  text-xs">
        {item.uraian}
      </Text>
      {item.lampiran ? (<View className=" flex-1 mt-2">
        <Image
          className={classNames('rounded h-56')}
          source={{ uri: item.lampiran?.url }}
          contentFit="cover"
        />
      </View>) : null}
    </View>

    {item.status == 'CLOSE' ? (<>
      <View className=" flex-row items-center justify-between p-1 border-t border-slate-100 space-x-2 mt-1">
        <View className=" flex-col space-y-0 items-start justify-start p-1">
          <Text className=" text-lg text-blue-700 font-bold">PENYELESAIAN </Text>
        </View>
        <View className=" flex-col space-y-0 items-end justify-end p-1">
          <Text className="text-xs text-slate-600 lowercase">
            {/** u.by - {item.createdBy ? `${item.updatedBy.firstname} ${item.updatedBy.lastname}` : '-'} */}
            WAKTU PENYELESAIAN
          </Text>
          <Text className="text-xs text-blue-500 font-bold">
            {calculateTimeDifference(item.createdAt, item.updatedAt)}
          </Text>
        </View>
      </View>
      <View className="mx-2 flex-col space-y-2">
        <Text className=" mt-1  text-xs">{item.respons_admin}</Text>
        {item.lampiran_balasan ? (<View className=" flex-1 mt-2">
          <Image
            className={classNames('rounded h-56')}
            source={{ uri: item.lampiran_balasan?.url }}
            contentFit="cover"
          />
        </View>) : null}
      </View>
    </>) : null}





  </View>)
}












