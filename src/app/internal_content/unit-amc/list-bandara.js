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


//=========================================
const MODEL = 'api::data-airport.data-airport';
const TITLE = "AIRPORT";
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
//---------------------------------------
const custom_fields = {
  name: {
    label: 'ICAO CODE',
    required: true,
    type: "string",
  }
};

//=========================================




export default () => {

  const { title, user, basepath, baseApiUrl } = useLayoutContext();
  const [viewMode, setViewMode] = useState(null);
  const [itemFocus, setItemFocus] = useState(null);
  const [parentFilter, setParentFilter] = useState([]);

  const canAdd = useMemo(() => {
    if (!user) {
      return false;
    }
    if (user.is_admin_it) {
      return true;
    }
    if(user.is_superadmin){
      return true
    }
    return false;
  }, [user])

  const canCetak = useMemo(() => {
    if (!user) {
      return false;
    }
    if (user.is_admin_it) {
      return true;
    }
    /*if(user.is_superadmin){
      return true
    }*/
    return false;
  }, [user])

  const canFilter = useMemo(() => {
    if (!user) {
      return false;
    }
    if (user.is_admin_it) {
      return true;
    }
    /*if(user.is_superadmin){
      return true
    }*/
    return false;
  }, [user])

  const setViewModeCallback = useCallback((params)=>{
    setViewMode(params)
  },[])

  const setItemFocusCallback = useCallback((params)=>{
    setItemFocus(params)
  },[])

  if (viewMode == 'add') {
    return (<FormAdd 
      title={title} 
      user={user} 
      baseApiUrl={baseApiUrl} 
      setViewMode={setViewModeCallback} 
    />)
  }

  if(viewMode == 'edit'){
    return (<FormEdit 
        title={title} 
        user={user} 
        baseApiUrl={baseApiUrl} 
        setViewMode={setViewModeCallback} 
        itemFocus={itemFocus} 
        setItemFocus={setItemFocusCallback}
      />)
  }

  if(viewMode == 'view'){
    return (<ViewUser 
        title={title} 
        user={user} 
        baseApiUrl={baseApiUrl} 
        setViewMode={setViewModeCallback} 
        itemFocus={itemFocus} 
        setItemFocus={setItemFocusCallback}
      />)
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








const RenderItem = memo(({ item, user, setViewMode, setItemFocus }) => {
  const [visible, setVisible] = useState(false);

  const menu = [
    {
      title : 'view',
      is_active :() => true,
      onPress : () =>{
        setItemFocus(item);
        setViewMode('view')
      }
    },
    {
      title : 'edit',
      is_active :() => {
        if(user.is_admin_it){
          return true
        }
        if(user.is_superadmin){
          return true
        }
        return false
      },
      onPress : () =>{
        setItemFocus(item);
        setViewMode('edit')
      }
    },
    {
      title : 'delete',
      is_active :() => {
        if(user.is_superadmin){
          return true
        }
        return false
      },
      onPress : () =>{
        setItemFocus(item);
        setViewMode('delete')
      }
    }
  ]

  const onMenuSelect = (item) => {
    setVisible(false);
    return menu[item.row].onPress();
  };

  const renderMenuButton = () => (
    <TouchableOpacity onPress={() => setVisible(true)} className=" bg-slate-50 p-1 rounded text-slate-300 border border-slate-300 ml-1">
      <AntDesign name="ellipsis1" size={14} color="black" />
    </TouchableOpacity>
  );

  const RenderMenu = () =>{
    let sanitize_menu = menu.filter((item, index)=>{
      return item.is_active();
    });

    if(sanitize_menu.length == 0){
      return null
    }
    return (<OverflowMenu
      anchor={renderMenuButton}
      visible={visible}
      selectedIndex={null}
      onSelect={onMenuSelect}
      onBackdropPress={() => setVisible(false)}
    >
      {sanitize_menu.map((item, index)=>{
        return (<MenuItem title={item.title} key={item.title}/>)
      })}
    </OverflowMenu>)
  }

  return (<View className="bg-white border border-slate-100 mb-2 rounded p-2">
    <View className=" flex-row items-center justify-between border-b border-slate-100">
      <View className=" flex-col">
        <Text className=" text-sm">
          {item.name}
        </Text>
        <Text className="text-xs text-gray-500">
          {item.email}
        </Text>
      </View>
      <View className=" flex-row items-center justify-between space-x-2">
        {item.is_admin_it ? (<View className=" bg-red-50 border rounded border-red-700 px-1">
          <Text className=" text-red-700">admin</Text>
        </View>) : null}

        {item.is_kordinator ? (<View className=" bg-blue-50 border border-blue-700 px-1 rounded">
          <Text className=" text-blue-700">kordinator</Text>
        </View>) : null}
        <RenderMenu/>
      </View>
    </View>

    <View className="mt-2 flex-row justify-between items-center">
      <View className=" flex-col items-start justify-start">
        <Text className=" text-xs text-gray-500">
          created - {item.createdBy?.firstname || null}
        </Text>
        <Text className=" text-xs text-gray-500">
         {moment(item.createdAt).startOf('day').fromNow()}
        </Text>
      </View>

      <View className=" flex-col items-end justify-end">
      <Text className=" text-xs text-gray-500">
          updated - {item.updatedBy?.firstname || null}
        </Text>
        <Text className=" text-xs text-gray-500">
         {moment(item.updatedAt).startOf('day').fromNow()}
        </Text>
      </View>
    </View>
  </View>)
})













const FormAdd = memo(({ setViewMode, title, baseApiUrl, user, reloadData = () => { } }) => {

  const populateForm = {

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
      <Text className=" text-md font-bold">ADD {TITLE}</Text>
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
})






const FormEdit = memo(({ setViewMode, title, baseApiUrl, user, reloadData = () => { }, itemFocus, setItemFocus }) => {
  
  const populateForm = {
  };


  onBack = useCallback(() => {
    reloadData();
    setItemFocus(null);
    setViewMode(null);
  }, [])

  return (<SafeAreaLayout style={{ flex: 1 }} insets='top'>
    <Stack.Screen options={{ headerShown: false }} />

    <View className=" flex-row items-center justify-between p-2">
      <TouchableOpacity className="p-1" onPress={onBack}>
        <Text className=" text-blue-500 text-xs">BATAL</Text>
      </TouchableOpacity>
      <View className=" flex-col items-end justify-end">
      <Text className=" text-md font-bold">EDIT {TITLE}</Text>
        <Text className="text-xs text-slate-500">BLU UPBU KELAS I DEO - SORONG</Text>
      </View>
    </View>

    <View className=" flex-1 bg-slate-200">
      {!itemFocus ? null : (<StrapiFormBuilder
        mutateLink={`${baseApiUrl}/edit/${itemFocus.id}`}
        onCreateSuccess={onBack}
        populateForm={populateForm}
        custom_fields={custom_fields}
        TAG_USEQUERY={'___'}
        isCreatingEntry={false}
        user={user}
        model={MODEL}
        initialValues={itemFocus}  
      />)}
    </View>
  </SafeAreaLayout>)
})




const ViewUser = memo(({ setViewMode, title, baseApiUrl, user, reloadData = () => { }, itemFocus, setItemFocus }) => {
 
  onBack = useCallback(() => {
    reloadData();
    setItemFocus(null);
    setViewMode(null);
  }, [])

  return (<SafeAreaLayout style={{ flex: 1 }} insets='top'>
    <Stack.Screen options={{ headerShown: false }} />

    <View className=" flex-row items-center justify-between p-2">
      <TouchableOpacity className="p-1" onPress={onBack}>
        <Text className=" text-blue-500 text-xs">KEMBALI</Text>
      </TouchableOpacity>
      <View className=" flex-col items-end justify-end">
      <Text className=" text-md font-bold">VIEW {TITLE}</Text>
        <Text className="text-xs text-slate-500">BLU UPBU KELAS I DEO - SORONG</Text>
      </View>
    </View>

    <View className=" flex-1 bg-slate-200">
    {!itemFocus ? null : (<></>)}
    </View>
  </SafeAreaLayout>)
})




