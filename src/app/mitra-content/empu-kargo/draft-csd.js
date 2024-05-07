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
import classNames from "@utils/classNames";
import formatTanggal from "@utils/formatTanggal";
import { v4 as uuidv4 } from 'uuid';


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
const MODEL = 'api::data-empu-cargo-csd.data-empu-cargo-csd';
const TITLE = "DRAFT PTI";
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
    //{is_verified_kanit : { $eq : true}},
    //{is_verified_operator : { $eq : null}},
    //{is_final : { $eq : true}},
    { m_empu_cargo: { id: { $eq: user.m_empu_cargo?.id || '--------' } } },
    {is_submit : { $eq : null}}
  ]);




  const canAdd = useMemo(() => {
    if (!user) {
      return false;
    }
    if (user.is_pic) {
      return true;
    }
    if (user.is_superadmin) {
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
    if (user.is_superadmin) {
      return true
    }
    return false;
  }, [user])


  const canFilter = useMemo(() => {
    if (!user) {
      return false;
    }
    if (user.is_admin_it) {
      return true;
    }
    if (user.is_superadmin) {
      return true
    }
    return false;
  }, [user])



  const setViewModeCallback = useCallback((params) => {
    setViewMode(params)
  }, [])



  const setItemFocusCallback = useCallback((params) => {
    setItemFocus(params)
  }, [])




  if (viewMode == 'add') {
    return (<AddForm
      title={title}
      user={user}
      baseApiUrl={baseApiUrl}
      setViewMode={setViewModeCallback}
      itemFocus={itemFocus}
      setItemFocus={setItemFocusCallback}
    />)
  }


  
  if(viewMode == 'teruskan-ke-bandara'){
    return (<Final 
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
        canAdd={true}
        canFilter={false}
        setViewMode={setViewModeCallback}
        setItemFocus={setItemFocusCallback}
        RenderItem={RenderItem}
        parentFilter={parentFilter}
      />
    </View>
  </SafeAreaLayout>)
}







const RenderItem = ({ item, user, setViewMode, setItemFocus }) => {

  const [visible, setVisible] = useState(false);

  const menu = [
    {
      title: 'PENGAJUAN CSD',
      is_active: () => true,
      onPress: () => {
        setItemFocus(item);
        setViewMode('teruskan-ke-bandara')
      }
    }/*,
    {
      title: 'DELETE',
      is_active: () => true,
      onPress: () => {
        setItemFocus(item);
        setViewMode('delete')
      }
    }*/
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



  const RenderMenu = () => {
    let sanitize_menu = menu.filter((item, index) => {
      return item.is_active();
    });

    if (sanitize_menu.length == 0) {
      return null
    }


    return (<OverflowMenu
      anchor={renderMenuButton}
      visible={visible}
      selectedIndex={null}
      onSelect={onMenuSelect}
      onBackdropPress={() => setVisible(false)}
    >
      {sanitize_menu.map((item, index) => {
        return (<MenuItem title={item.title} key={item.title} />)
      })}
    </OverflowMenu>)
  }



  return (<View className="bg-white border border-slate-100 mb-2 rounded p-2">
    <View className=" flex-row items-center justify-between border-b border-slate-100">
      <View className=" flex-col">
        <Text className=" text-sm uppercase font-bold text-slate-700">
          NO SMU - {item.no_smu}
        </Text>
        <Text className="text-xs text-gray-500 lowercase">
          {formatTanggal(item.createdAt)}
        </Text>
      </View>


      <View className=" flex-col items-center">
        <RenderMenu />
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
              OPERATOR
            </Text>
            {item.m_op_airlines ? (<View className=" flex-col items-start justify-start">
              <Text className=" text-lg font-bold text-slate-600">
                {item.no_penerbangan}
              </Text>
              <Text className=" text-xs text-slate-500">
                {item.m_op_airlines.name}
              </Text>
            </View>) : (<Text className=" text-lg font-bold text-slate-500">
              -
            </Text>)}
          </View>

          <View className=" flex-col items-start justify-start">
            <Text className=" text-xs text-slate-500">
              PENGIRIM
            </Text>
            <View className="flex-col">
              <Text className=" text-lg text-slate-600 font-bold">
                {item.airport_asal?.name || '-'}
              </Text>
              <Text className=" text-xs">

              </Text>
            </View>
          </View>

          <View className=" flex-col items-end justify-end">
            <Text className=" text-xs text-slate-500">
              PENERIMA
            </Text>
            <View className="flex-col">
              <Text className=" text-lg text-slate-600 font-bold">
                {item.airport_tujuan?.name || '-'}
              </Text>
              <Text className=" text-xs">

              </Text>
            </View>
          </View>

        </View>


        <View className=" items-center flex-row justify-between">
          <View className=" flex-col items-start justify-start">
            <Text className=" text-xs text-slate-500">
              JUMLAH KOLI
            </Text>
            <View className="flex-col">
              <Text className=" text-lg text-slate-600 font-bold">
                {item.jumlah_koli}
              </Text>
              <Text className=" text-xs">

              </Text>
            </View>
          </View>

          <View className=" flex-col items-end justify-end">
            <Text className=" text-xs text-slate-500">
              BERAT - KG
            </Text>
            <View className="flex-col">
              <Text className=" text-lg text-slate-600 font-bold">
                {item.berat_total}
              </Text>
              <Text className=" text-xs">

              </Text>
            </View>
          </View>

          <View className=" flex-col items-end justify-end">
            <Text className=" text-xs text-slate-500">
              TRANSIT / TRANSFER
            </Text>
            <View className="flex-col">
              <Text className=" text-lg text-slate-600 font-bold">
                {item.transit_transfer || '-'}
              </Text>
              <Text className=" text-xs">

              </Text>
            </View>
          </View>
        </View>
      </View>

      <Text className=" items-start justify-start text-slate-500 text-xs">PENJELASAN ISI BARANG</Text>
        <View className="border-t border-slate-200">
            <Text className=" text-slate-700 text-sm mt-1">{item.content}</Text>
          </View>
    </View>
  </View>)
}






const AddForm = memo(({ setViewMode, title, baseApiUrl, user, reloadData = () => { }, itemFocus, setItemFocus }) => {


  const populateForm = {
    m_empu_cargo: {
      qr_code : uuidv4(),
      disconnect: [],
      connect: [
        {
          id: user.m_empu_cargo?.id,
          position: {
            end: true
          }
        }]
    }
  };

  const custom_fields = {
    no_smu: {
      label: 'NO SMU',
      type: "string",
      required: true,
    },
    m_op_airlines: {
      label: 'OPERATOR / AIRLINES',
      type: "relation",
      relationType: "manyToOne",
      targetModel: "api::data-op-airline.data-op-airline",
    },
    no_penerbangan: {
      label: 'NO PENERBANGAN',
      type: "string",
      required: true,
    },
    tanggal: {
      label: 'TANGGAL PENERBANGAN',
      type: "date",
      required: true,
    },
    airport_asal: {
      label: 'DARI',
      type: "relation",
      relationType: "manyToOne",
      targetModel: "api::data-airport.data-airport"
    },

    airport_tujuan: {
      label: 'MENUJU',
      type: "relation",
      relationType: "manyToOne",
      targetModel: "api::data-airport.data-airport"
    },

    nama_penerima: {
      label: 'NAMA PENERIMA',
      type: "string",
      required: true,
    },

    jumlah_koli: {
      label: 'JUMLAH KOLI',
      type: "number",
      required: true,
    },
    berat_total: {
      label: 'BERAT - KG',
      type: "number",
      required: true,
    },
    content: {
      label: 'PEMBERITAHUAN TENTANG ISI',
      type: "text",
      required: true,
    },
    
    lampiran_before: {
      label: 'LAMPIRAN FOTO KARGO',
      required: true,
      type: "media",
      multiple: false,
      allowedTypes: [
        "images"
      ]
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
        <Text className=" text-md font-bold">NEW {TITLE}</Text>
        <Text className="text-xs text-slate-500">BLU UPBU KELAS I DEO - SORONG</Text>
      </View>
    </View>

    <View className=" flex-1 bg-slate-200">
      <StrapiFormBuilder
        mutateLink={`${baseApiUrl}/add`}
        onCreateSuccess={onBack}
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






const Final = memo(({ setViewMode, title, baseApiUrl, user, reloadData = () => { }, itemFocus, setItemFocus }) => {
 
  
  const populateForm = {
    is_submit : true
  };


  const custom_fields = {
    catatan_final: {
      label: 'CATATAN PENGAJUAN - JIKA ADA',
      type: "text",
      required : true
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
