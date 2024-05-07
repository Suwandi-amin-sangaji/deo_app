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
const MODEL = 'api::data-amc.data-amc';
const TITLE = "VERIFIKASI DATA";
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

//------------------------------------------
const custom_fields = {
  airlines_perusahan: {
    label: 'OPERATOR',
    type: "relation",
    relationType: "manyToOne",
    targetModel: "api::data-op-airline.data-op-airline",
  },
  jenis_penerbangan: {
    label: 'STATUS',
    type: "enumeration",
    default: "BERJADWAL",
    enum: ["BERJADWAL", "EXTRA", "LAINNYA"]
  },
  reg_number: {
    label: 'REG NUMBER',
    required: true,
    type: "string"
  },
  aircraft_type: {
    label: 'TYPE PESAWAT',
    type: "relation",
    relationType: "manyToOne",
    targetModel: "api::aircraft-type.aircraft-type",
  },
  from: {
    label: 'FROM',
    type: "relation",
    relationType: "manyToOne",
    targetModel: "api::data-airport.data-airport"
  },
  eta: {
    label: 'ESTIMATE TIME ARRIVAL',
    type: "datetime"
  },
  fn_arr: {
    label: 'FLIGHT NUMBER ARRIVAL',
    type: "string"
  },
  data_parking_stand: {
    label: 'PARKING STAND',
    type: "relation",
    relationType: "manyToOne",
    targetModel: "api::data-parking-stand.data-parking-stand",
  },
};


//=========================================




export default () => {

  const { title, user, basepath, baseApiUrl } = useLayoutContext();
  const [viewMode, setViewMode] = useState(null);
  const [itemFocus, setItemFocus] = useState(null);
  const [parentFilter, setParentFilter] = useState([
    {is_verified_kanit : { $eq : true}},
    {is_verified_operator : { $eq : null}},
    {is_final : { $eq : true}},
    {airlines_perusahan : { id : { $eq : user.data_op_airline?.id || '--------'} }},
  ]);




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




  if(viewMode == 'teruskan-ke-bandara'){
    return (<TeruskanKeBandara
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
        canCetak={false}
        canAdd={false}
        canFilter={false}
        setViewMode={setViewModeCallback}
        setItemFocus={setItemFocus}
        RenderItem={RenderItem}
        parentFilter={parentFilter}
      />
    </View>
  </SafeAreaLayout>)
}









const TeruskanKeBandara = memo(({ setViewMode, title, baseApiUrl, user, reloadData = () => { }, itemFocus, setItemFocus }) => {


  const populateForm = {
    is_verified_operator : true,
    operator_verified_Date : moment(new Date()).toISOString(),
    operator_verified_by : {
      disconnect: [],
      connect: [
        {
          id: user.id,
          position: {
            end: true
          }
        }]
      }
  };

  const custom_fields = {

    penumpang_datang_bayi: {
      label: 'JUMLAH PENUMPANG DATANG - BAYI',
      type: "number",
      required: true,
    },
    penumpang_datang_anak: {
      label: 'JUMLAH PENUMPANG DATANG - ANAK',
      type: "number",
      required: true,
    },
    penumpang_datang_anak: {
      label: 'JUMLAH PENUMPANG DATANG - DEWASA',
      type: "number",
      required: true,
    },
    penumpang_transit_bayi: {
      label: 'JUMLAH PENUMPANG TRANSIT - BAYI',
      type: "number",
      required: true,
    },
    penumpang_transit_anak: {
      label: 'JUMLAH PENUMPANG TRANSIT - ANAK',
      type: "number",
      required: true,
    },
    penumpang_transit_dewasa: {
      label: 'JUMLAH PENUMPANG TRANSIT - DEWASA',
      type: "number",
      required: true,
    },
    penumpang_berangkat_bayi: {
      label: 'JUMLAH PENUMPANG BERANGKAT - BAYI',
      type: "number",
      required: true,
    },
    penumpang_berangkat_anak: {
      label: 'JUMLAH PENUMPANG BERANGKAT - ANAK',
      type: "number",
      required: true,
    },
    penumpang_berangkat_dewasa: {
      label: 'JUMLAH PENUMPANG BERANGKAT - DEWASA',
      type: "number",
      required: true,
    },
    kargo_datang: {
      label: 'KARGO DATANG - (DALAM KG)',
      type: "number",
      required: true,
    },
    kargo_transit: {
      label: 'KARGO TRANSIT - (DALAM KG)',
      type: "number",
      required: true,
    },
    kargo_berangkat: {
      label: 'KARGO BERANGKAT - (DALAM KG)',
      type: "number",
      required: true,
    },
    bagasi_datang: {
      label: 'BAGASI DATANG - (DALAM KG)',
      type: "number",
      required: true,
    },
    bagasi_transit: {
      label: 'BAGASI TRANSIT - (DALAM KG)',
      type: "number",
      required: true,
    },
    bagasi_berangkat: {
      label: 'BAGASI BERANGKAT - (DALAM KG)',
      type: "number",
      required: true,
    },
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







const RenderItem = ({ item, user, setViewMode, setItemFocus }) => {

  const [visible, setVisible] = useState(false);

  const menu = [
    {
      title : 'VERIFIKASI DATA',
      is_active :() => true,
      onPress : () =>{
        setItemFocus(item);
        setViewMode('teruskan-ke-bandara')
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
        <Text className=" text-sm uppercase">
        {item.airlines_perusahan?.name || 'UNKNOW OPERATOR'}
        </Text>
        <Text className="text-xs text-gray-500 lowercase">
          {item.createdAt}
        </Text>
      </View>


      <View className=" flex-col items-center">
      <RenderMenu/>
      </View>
    </View>

    <View className="mt-2">

      {item.catatan_perbaikan_operator && (<View className=" bg-red-50 border rounded border-red-700 items-center justify-center p-1">
        <Text className="text-red-700">{item.catatan_perbaikan_operator}</Text>
      </View>)}
      <View className="p-2 space-y-4">
        <View className=" items-center flex-row justify-between">
          <View className=" flex-col items-start justify-start">
            <Text className=" text-xs text-slate-500">
              ARR. FN
            </Text>
            <Text className=" text-lg text-slate-600 font-bold uppercase">
              {item.fn_arr || '-'}
            </Text>
          </View>

          <View className=" flex-col items-start justify-start">
            <Text className=" text-xs text-slate-500">
              FROM
            </Text>
            <Text className=" text-lg text-slate-600 font-bold">
              {item.from?.name || '-'}
            </Text>
          </View>

          <View className=" flex-col items-end justify-end">
            <Text className=" text-xs text-slate-500">
              ETA
            </Text>
            {item.eta ? (<View className=" flex-col items-end justify-end">

              <Text className=" text-lg font-bold text-slate-600">
                {item.eta ? formatTampilanJam(new Date(item.eta)) : null}
              </Text>
              <Text className=" text-xs text-slate-500">
                {item.eta ? formatTampilanTanggal(new Date(item.eta)) : null}
              </Text>
            </View>) : (<Text className=" text-lg font-bold text-slate-500">
              -
            </Text>)}
          </View>

          <View className=" flex-col items-end justify-end">
            <Text className=" text-xs text-slate-500">
              ATA
            </Text>
            {item.ata ? (<View className=" flex-col items-end justify-end">

              <Text className=" text-lg font-bold text-slate-600">
                {item.ata ? formatTampilanJam(new Date(item.ata)) : null}
              </Text>
              <Text className=" text-xs text-slate-500">
                {item.ata ? formatTampilanTanggal(new Date(item.ata)) : null}
              </Text>
            </View>) : (<Text className=" text-lg font-bold text-slate-500">
              -
            </Text>)}
          </View>


          <View className=" flex-col items-end justify-end">
            <Text className=" text-xs text-slate-500">
              BLOK ON
            </Text>
            {item.block_on ? (<View className=" flex-col items-end justify-end">

              <Text className=" text-lg font-bold text-slate-600">
                {item.block_on ? formatTampilanJam(new Date(item.block_on)) : null}
              </Text>
              <Text className=" text-xs text-slate-500">
                {item.block_on ? formatTampilanTanggal(new Date(item.block_on)) : null}
              </Text>
            </View>) : (<Text className=" text-lg font-bold text-slate-500">
              -
            </Text>)}
          </View>

        </View>

        <View className=" items-center flex-row justify-between">
          <View className=" flex-col items-start justify-start">
            <Text className=" text-xs text-slate-500 ">
              DEPT. FN
            </Text>
            <Text className=" text-lg text-slate-600 font-bold uppercase">
              {item.fn_dep || '-'}
            </Text>
          </View>

          <View className=" flex-col items-start justify-start">
            <Text className=" text-xs text-slate-500">
              DEST
            </Text>
            <Text className=" text-lg text-slate-600 font-bold">
              {item.destination?.name || '-'}
            </Text>
          </View>

          <View className=" flex-col items-end justify-end">
            <Text className=" text-xs text-slate-500">
              ETD
            </Text>
            {item.etd ? (<View className=" flex-col items-end justify-end">

              <Text className=" text-lg font-bold text-slate-600">
                {item.etd ? formatTampilanJam(new Date(item.etd)) : null}
              </Text>
              <Text className=" text-xs text-slate-500">
                {item.etd ? formatTampilanTanggal(new Date(item.etd)) : null}
              </Text>
            </View>) : (<Text className=" text-lg font-bold text-slate-500">
              -
            </Text>)}
          </View>


          <View className=" flex-col items-end justify-end">
            <Text className=" text-xs text-slate-500">
              BLOK OFF
            </Text>
            {item.block_off ? (<View className=" flex-col items-end justify-end">

              <Text className=" text-lg font-bold text-slate-600">
                {item.block_off ? formatTampilanJam(new Date(item.block_off)) : null}
              </Text>
              <Text className=" text-xs text-slate-500">
                {item.block_off ? formatTampilanTanggal(new Date(item.block_off)) : null}
              </Text>
            </View>) : (<Text className=" text-lg font-bold text-slate-500">
              -
            </Text>)}
          </View>


          <View className=" flex-col items-end justify-end">
            <Text className=" text-xs text-slate-500">
              ATD
            </Text>
            {item.atd ? (<View className=" flex-col items-end justify-end">

              <Text className=" text-lg font-bold text-slate-600">
                {item.atd ? formatTampilanJam(new Date(item.atd)) : null}
              </Text>
              <Text className=" text-xs text-slate-500">
                {item.atd ? formatTampilanTanggal(new Date(item.atd)) : null}
              </Text>
            </View>) : (<Text className=" text-lg font-bold text-slate-500">
              -
            </Text>)}
          </View>

        </View>

        <View className=" items-center flex-row justify-between">

          <View className=" flex-col items-start justify-start">
            <Text className=" text-xs text-slate-500">
              REG. NUMBER
            </Text>
            <Text className=" text-lg text-slate-600 font-bold">
              {item.reg_number || '-'}
            </Text>
          </View>


          <View className=" flex-col items-start justify-start">
            <Text className=" text-xs text-slate-500">
              AIRCRAFT TYPE
            </Text>
            <Text className=" text-lg text-slate-600 font-bold">
              {item.aircraft_type?.title || '-'}
            </Text>
          </View>

          <View className=" flex-col items-end justify-end">
            <Text className=" text-xs text-slate-500">
              PARKING STAND
            </Text>
            <Text className=" text-lg text-slate-600 font-bold">
              {item.data_parking_stand?.name || '-'}
            </Text>
          </View>
        </View>


        {item.catatan_perbaikan_operator && (<>
          <View className=" border-t border-slate-200">
            <Text className=" text-slate-700 font-bold">ANGUD KEDATANGAN</Text>
          </View>

        <View className=" items-center flex-row justify-between">

          <View className=" flex-col items-start justify-start">
            <Text className=" text-xs text-slate-500">
              BAYI
            </Text>
            <Text className=" text-lg text-slate-600">
              {item.penumpang_datang_bayi || '0'}
            </Text>
          </View>

          <View className=" flex-col items-start justify-start">
            <Text className=" text-xs text-slate-500">
              ANAK
            </Text>
            <Text className=" text-lg text-slate-600">
            {item.penumpang_datang_anak || '0'}
            </Text>
          </View>

          <View className=" flex-col items-end justify-end">
            <Text className=" text-xs text-slate-500">
              DEWASA
            </Text>
            <Text className=" text-lg text-slate-600">
            {item.penumpang_datang_dewasa || '0'}
            </Text>
          </View>

          <View className=" flex-col items-end justify-end">
            <Text className=" text-xs text-slate-500">
              KARGO (KG)
            </Text>
            <Text className=" text-lg text-slate-600">
            {item.kargo_datang || '0'}
            </Text>
          </View>
          
          <View className=" flex-col items-end justify-end">
            <Text className=" text-xs text-slate-500">
              BAGASI (KG)
            </Text>
            <Text className=" text-lg text-slate-600">
            {item.bagasi_datang || '0'}
            </Text>
          </View>
        </View>


        <View className="">
            <Text className=" text-slate-700 font-bold">ANGUD TRANSIT</Text>
          </View>

        <View className=" items-center flex-row justify-between">

          <View className=" flex-col items-start justify-start">
            <Text className=" text-xs text-slate-500">
              BAYI
            </Text>
            <Text className=" text-lg text-slate-600">
            {item.penumpang_transit_bayi || '-'}
            </Text>
          </View>

          <View className=" flex-col items-start justify-start">
            <Text className=" text-xs text-slate-500">
              ANAK
            </Text>
            <Text className=" text-lg text-slate-600">
            {item.penumpang_transit_anak || '-'}
            </Text>
          </View>

          <View className=" flex-col items-end justify-end">
            <Text className=" text-xs text-slate-500">
              DEWASA
            </Text>
            <Text className=" text-lg text-slate-600">
              {item.penumpang_transit_dewasa || '-'}
            </Text>
          </View>

          <View className=" flex-col items-end justify-end">
            <Text className=" text-xs text-slate-500">
              KARGO (KG)
            </Text>
            <Text className=" text-lg text-slate-600">
            {item.kargo_transit || '0'}
            </Text>
          </View>
          <View className=" flex-col items-end justify-end">
            <Text className=" text-xs text-slate-500">
              BAGASI (KG)
            </Text>
            <Text className=" text-lg text-slate-600">
            {item.bagasi_transit || '0'}
            </Text>
          </View>
        </View>

        <View className="">
            <Text className=" text-slate-700 font-bold">ANGUD KEBERANGKATAN</Text>
          </View>

        <View className=" items-center flex-row justify-between">

          <View className=" flex-col items-start justify-start">
            <Text className=" text-xs text-slate-500">
              BAYI
            </Text>
            <Text className=" text-lg text-slate-600">
            {item.penumpang_berangkat_bayi || '0'}
            </Text>
          </View>

          <View className=" flex-col items-start justify-start">
            <Text className=" text-xs text-slate-500">
              ANAK
            </Text>
            <Text className=" text-lg text-slate-600">
            {item.penumpang_berangkat_anak || '0'}
            </Text>
          </View>

          <View className=" flex-col items-end justify-end">
            <Text className=" text-xs text-slate-500">
              DEWASA
            </Text>
            <Text className=" text-lg text-slate-600">
            {item.penumpang_berangkat_dewasa || '0'}
            </Text>
          </View>

          <View className=" flex-col items-end justify-end">
            <Text className=" text-xs text-slate-500">
            KARGO (KG)
            </Text>
            <Text className=" text-lg text-slate-600">
            {item.kargo_berangkat || '0'}
            </Text>
          </View>
          <View className=" flex-col items-end justify-end">
            <Text className=" text-xs text-slate-500">
              BAGASI (KG)
            </Text>
            <Text className=" text-lg text-slate-600">
            {item.bagasi_berangkat || '0'}
            </Text>
          </View>
        </View>
        </>)}
      </View>
    </View>



  </View>)
}












