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

import formatTampilanTanggal from "@utils/formatTampilanTanggal";
import formatTampilanJam from "@utils/formatTampilanJam";
import formatTanggal from "@utils/formatTanggal";



const classNames = (...classes) => classes.filter(Boolean).join(' ');
//=========================================
const MODEL = 'api::data-empu-cargo.data-empu-cargo';
const TITLE = "EMPU KARGO";
const FILTERS = [
  {
    name: 'name',
    label: 'NAMA EMPU',
    type: "string",
    optionFilter: [
      { label: 'MENGANDUNG KATA', value: '$containsi' },
      { label: 'TIDAK MENGANDUNG KATA', value: '$notContainsi' }
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
    name: 'createdBy',
    label: 'INPUT OLEH',
    type: "relation",
    relationType: "manyToOne",
    targetField: 'firstname',
    optionFilter: [
      { label: 'NAMA PERSONIL', value: '$containsi' },
    ]
  }
];

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

  if(viewMode == 'manage_user_empu'){
    return (<ManageUserEmpu 
        title={title} 
        user={user} 
        baseApiUrl={baseApiUrl} 
        setViewMode={setViewModeCallback} 
        itemFocus={itemFocus} 
        setItemFocus={setItemFocusCallback}
        basepath={basepath}
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
        model={MODEL}
        title={title}
        user={user}
        basepath={basepath}
        baseApiUrl={`${baseApiUrl}/find-many`}
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






const FormAdd = ({ setViewMode, title, baseApiUrl, user, reloadData = ()=>{} }) => {

  const populateForm = {
  };

  const custom_fields = {
  name: {
    label: 'NAMA EMPU',
    required: true,
    type: "string",
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



const FormEdit = memo(({ setViewMode, title, baseApiUrl, user, reloadData = () => { }, itemFocus, setItemFocus }) => {
  
  const populateForm = {
  };

  

  const custom_fields = {
    name: {
      label: 'NAMA EMPU',
      required: true,
      type: "string",
    }
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
      title : 'EDIT',
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
      title : 'MANAGE USER',
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
        setViewMode('manage_user_empu')
      }
    },
    {
      title : 'DISABLE',
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
         TOTAL USERS - {item.m_empu_cargo_user.count || 0}
        </Text>
      </View>


      <View className=" flex-col items-center">
      <RenderMenu/>
      </View>
    </View>

    <View className="mt-2 flex-row justify-between items-center">
      <View className=" flex-col items-start justify-start">
        <Text className=" text-xs text-gray-500">
          created - {item.createdBy?.firstname || null}
        </Text>
        <Text className=" text-xs text-gray-500">
         {formatTampilanTanggal(item.createdAt)} {formatTampilanJam(item.createdAt)}
        </Text>
      </View>

      <View className=" flex-col items-end justify-end">
      <Text className=" text-xs text-gray-500">
          updated - {item.updatedBy?.firstname || null}
        </Text>
        <Text className=" text-xs text-gray-500">
         {formatTampilanTanggal(item.updatedAt)} {formatTampilanJam(item.updatedAt)}
        </Text>
      </View>
    </View>



  </View>)
}








//================================================================
// USER OPERATOR

const ManageUserEmpu = memo(({ setViewMode, title, baseApiUrl, user, reloadData = () => { }, itemFocus, setItemFocus, basepath }) => {

  const [viewModeUser , setViewModeUsers ] = useState(null)
  const [itemFocusUsers , setItemFocusUsers ] = useState(null)


  const parentFilter = useMemo(()=>{
    return [
      {m_empu_cargo : { id : { $eq :  itemFocus.id}}},
      {admin_user : {$not : null} }
    ]
  },[itemFocus])




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
  }, [user]);



  onBack = useCallback(() => {
    reloadData();
    setItemFocus(null);
    setViewMode(null);
  }, [])


  const setViewModeCallback = useCallback((params)=>{
    setViewModeUsers(params)
  },[])



  if (viewModeUser == 'add') {
    return (<FormAddUsersOperator
      title={title} 
      user={user} 
      baseApiUrl={baseApiUrl} 
      setViewMode={setViewModeCallback} 
      itemFocus={itemFocus}
    />)
  }


  if (viewModeUser == 'edit') {
    return (<FormUpdateUsersOperator
      title={title} 
      user={user} 
      baseApiUrl={baseApiUrl} 
      setViewMode={setViewModeCallback} 
      itemFocus={itemFocus}
      itemFocusUsers={itemFocusUsers}
    />)
  }








  return (<SafeAreaLayout style={{ flex: 1 }} insets='top'>
    <Stack.Screen options={{ headerShown: false }} />
    <View className=" flex-row items-center justify-between p-2">
      <TouchableOpacity className="p-1" onPress={onBack}>
        <Text className=" text-blue-500 text-xs">BATAL</Text>
      </TouchableOpacity>
      <View className=" flex-col items-end justify-end">
        <Text className=" text-md font-bold">MANAGE USER {TITLE}</Text>
        <Text className="text-xs text-slate-500">BLU UPBU KELAS I DEO - SORONG</Text>
      </View>
    </View>

    <View className=" flex-1 bg-slate-200">
      <StrapiDataProvider
        baseApiUrl={`${baseApiUrl}/list-personil-empu`}
        model={'api::data-empu-cargo-user.data-empu-cargo-user'}
        title={itemFocus.name}
        user={user}
        basepath={basepath}
        FILTERS={[]}
        canCetak={false}
        canAdd={canAdd}
        canFilter={false}
        setViewMode={setViewModeUsers}
        setItemFocus={setItemFocusUsers}
        RenderItem={RenderUserOperator}
        parentFilter={parentFilter}
        showBackButton={false}
      />
    </View>
  </SafeAreaLayout>)
})


const RenderUserOperator = memo(({ item, user, setViewMode, setItemFocus }) => {
  const [visible, setVisible] = useState(false);

  const menu = [
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
        {item.is_pic ? (<View className=" bg-red-50 border rounded border-red-700 px-1">
          <Text className=" text-red-700">PIC</Text>
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
})


const FormAddUsersOperator = memo(({ setViewMode, title, baseApiUrl, user, reloadData = () => { }, itemFocus }) => {

  const populateForm = {
    m_empu_cargo : {
      disconnect: [],
      connect: [
        {
          id: itemFocus.id,
          position: {
            end: true
          }
        }]
      }
    };

  const custom_fields = {
    name: {
      label: 'NAMA LENGKAP',
      required: true,
      type: "string",
    },
    email: {
      label: 'EMAIL',
      required: true,
      type: "email",
    },
    no_telp: {
      label: 'NO TELP/HP',
      required: true,
      type: "number",
    },
    is_pic: {
      label: 'PIC OPERATOR',
      required: true,
      type: "boolean",
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
        <Text className=" text-md font-bold">REGISTER PERSONIL OPERATOR - {title}</Text>
        <Text className="text-xs text-slate-500">BLU UPBU KELAS I DEO - SORONG</Text>
      </View>
    </View>

    <View className=" flex-1 bg-slate-200">
      <StrapiFormBuilder
        mutateLink={`${baseApiUrl}/add-personil-empu`}
        onCreateSuccess={onSuccess}
        populateForm={populateForm}
        custom_fields={custom_fields}
        TAG_USEQUERY={'___'}
        isCreatingEntry={true}
        user={user}
        model={'api::data-empu-cargo-user.data-empu-cargo-user'}
      />
    </View>
  </SafeAreaLayout>)
})


const FormUpdateUsersOperator = memo(({ setViewMode, title, baseApiUrl, user, reloadData = () => { }, itemFocus , itemFocusUsers}) => {

  const populateForm = {};

  const custom_fields = {
    name: {
      label: 'NAMA LENGKAP',
      required: true,
      type: "string",
    },
    email: {
      label: 'EMAIL',
      required: true,
      type: "email",
    },
    no_telp: {
      label: 'NO TELP/HP',
      required: true,
      type: "number",
    },
    is_pic: {
      label: 'PIC OPERATOR',
      required: true,
      type: "boolean",
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
        <Text className=" text-md font-bold">UPDATE PERSONIL OPERATOR - {title}</Text>
        <Text className="text-xs text-slate-500">BLU UPBU KELAS I DEO - SORONG</Text>
      </View>
    </View>

    <View className=" flex-1 bg-slate-200">
      <StrapiFormBuilder
        mutateLink={`${baseApiUrl}/update-personil-empu/${itemFocusUsers.id}`}
        onCreateSuccess={onSuccess}
        populateForm={populateForm}
        custom_fields={custom_fields}
        TAG_USEQUERY={'___'}
        isCreatingEntry={false}
        user={user}
        model={'api::data-empu-cargo-user.data-empu-cargo-user'}
        initialValues={itemFocusUsers}
      />
    </View>
  </SafeAreaLayout>)
})