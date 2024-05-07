import { FontAwesome, FontAwesome5, MaterialIcons, Ionicons, Entypo, Fontisto, MaterialCommunityIcons, AntDesign, Octicons, Foundation } from "@expo/vector-icons";
import React, { useEffect, useContext, createContext, useState, Fragment } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, Redirect, Tabs, useSegments, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaLayout } from '@components/safe-area-layout';
import IconPng from "@assets/icon.png";
import axios from 'axios';
import { useLayoutContext } from './_layout';
import Retool from '@components/Retool'



const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}




export default () => {
  const [webViewUrl, setWebViewUrl] = useState(null);
  const homeBackUrl  = '/(tabs)/beranda';
 
  const { title, user, basepath, baseApiUrl, logout } = useLayoutContext();
  const url = 'https://editor.deoairport.co.id/mobile/apps/android_pengaduan/home';



  const setDevID = async(user) => {
    const device_id = await SecureStore.getItemAsync('deviceId');
    if(user?.token){
      setWebViewUrl(`${url}?device_id=${device_id}&token=${user.token}&baseApiUrl=${baseApiUrl}`);
    }else{
      setWebViewUrl(`${url}?device_id=${device_id}`);
    }
  }



  useEffect(()=>{
    setDevID(user);
  },[user])




  return (
    <SafeAreaLayout style={{ flex: 1 }} insets='top'>
    <Stack.Screen
      options={{
        headerShown: false
      }}
    />
      {!!webViewUrl && (
        <Retool 
          url={webViewUrl} 
          homeBackUrl={homeBackUrl} 
          user={user}
          baseApiUrl={baseApiUrl}
          logout={logout}
          />)}
    </SafeAreaLayout>
  )
}






/*import { FontAwesome, FontAwesome5, MaterialIcons, Ionicons, Entypo, Fontisto, MaterialCommunityIcons, AntDesign, Octicons, Foundation } from "@expo/vector-icons";
import React, { useEffect, useContext, createContext, useState, Fragment, useCallback, useMemo } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, StyleSheet, FlatList, Platform } from 'react-native';
import { Stack, Redirect, Tabs, useSegments, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaLayout } from '@components/safe-area-layout';
import IconPng from "@assets/icon.png";
import { useLayoutContext } from './_layout';

import { FlashList } from "@shopify/flash-list";
import { getFetchClient } from '@api/getFetchClient';
import { formatDistance, format } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';


import { StrapiFormBuilder } from '@context/StrapiFormProvider';






import { Modal, MenuItem, OverflowMenu, Datepicker, Select, SelectItem, IndexPath, Toggle } from '@ui-kitten/components';


const MODEL = 'api::data-pengaduan.data-pengaduan';
//=========================================

const FILTERS = [
  {
    name: 'createdAt',
    label: 'TANGGAL PENGADUAN',
    type: "date",
    optionFilter: [
      { label: 'DIATAS TANGGAL', value: '$gte' },
      { label: 'DIBAWAH TANGGAL', value: '$lte' },
    ]
  }
];

//=========================================


const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}


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



const styles = StyleSheet.create({
  container: {
    minHeight: 192,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});



export default () => {



  const { title, user, basepath, baseApiUrl } = useLayoutContext();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalCetakVisible, setModalCetakVisible] = useState(false);

  const { post } = getFetchClient();
  const [viewMode, setViewMode] = useState(null);
  const [itemFocus, setItemFocus] = useState(null);
  const [{ isLoading, results, pagination, isError }, setState] = useState({ isLoading: true, results: [], pagination: {}, isError: false });
  const [filters, setFilters] = useState([]);
  const [hanyaPengaduanSaya, setHanyaPengaduanSaya] = useState([{ createdBy: { id: user.id || '------------' } }]);
  const [query, setQuery] = useState({
    pageSize: 20,
    page: 1,
    sort: 'createdAt:DESC',
    filters: {
      $and: []
    }
  });





  const loadData = async (query) => {
    try {
      setState((e) => {
        return {
          ...e,
          isLoading: true,
          isError: false
        }
      })
      const { data: { results, pagination } } = await post(`${baseApiUrl}/find-many`, {
        model: MODEL,
        query: {
          ...query,
          filters: {
            ...query.filters,
            $and: [
              ...query.filters.$and,
              ...(Array.isArray(hanyaPengaduanSaya) ? hanyaPengaduanSaya : []),
              ...filters
            ].filter(Boolean)

          }
        }
      },
        {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      setState((e) => {
        return {
          ...e,
          isLoading: false,
          isError: false,
          results: results,
          pagination: pagination
        }
      })

    } catch (e) {

      console.log(e);
      setState((e) => {
        return {
          ...e,
          isLoading: false,
          isError: true,
          results: [],
          pagination: {}
        }
      })
    }
  }




  const reloadData = useCallback(() => {
    loadData(query);
  }, [query, filters, hanyaPengaduanSaya])





  const deleteFilter = useCallback((name) => {
    const newArr = filters.filter((item) => Object.keys(item)[0] !== name);
    setFilters(newArr);
  }, [filters, setFilters, hanyaPengaduanSaya])




  const getCanPreviousPage = useMemo(() => {
    if (!pagination) {
      return false;
    }

    if (pagination.page <= 1) {
      return false;
    }
    return true;
  }, [pagination, query])



  const goToFirst = useCallback(() => {
    if (getCanPreviousPage) {
      setQuery((e) => {
        return {
          ...e,
          page: 1
        }
      });
    }
  }, [setQuery, getCanPreviousPage]);



  const goToPrev = useCallback(() => {
    if (getCanPreviousPage) {
      setQuery((e) => {
        return {
          ...e,
          page: pagination.page - 1
        }
      });
    }
  }, [pagination, getCanPreviousPage, setQuery])



  const getCanNextPage = useMemo(() => {
    if (!pagination) {
      return false;
    }
    if (pagination.page < pagination.pageCount) {
      return true;
    }
    return false;
  }, [pagination])


  const goToNext = useCallback(() => {
    if (getCanNextPage) {
      setQuery((e) => {
        return {
          ...e,
          page: pagination.page + 1
        }
      });
    }
  }, [pagination, setQuery, getCanNextPage])


  const goToLast = useCallback(() => {

    if (!pagination) {
      return void 0;
    }

    if (getCanNextPage) {
      setQuery((e) => {
        return {
          ...e,
          page: pagination.pageCount
        }
      });
    }
  }, [pagination, setQuery, getCanNextPage])




  useEffect(() => {
    loadData(query);
  }, [query, filters, hanyaPengaduanSaya])







  const RenderFilterItem = ({ item, index }) => {
    const name = Object.keys(item)[0];
    let fieldItem = FILTERS.find((item_) => item_.name === name);
    console.log(fieldItem);
    return (<View className=" flex-row items-center justify-between rounded-lg bg-blue-500 p-1 space-x-6 mr-2">
      <Text className="text-xs text-white lowercase">{index + 1}. {fieldItem?.label || name}</Text>
      <Text onPress={() => deleteFilter(name)} className="text-xs text-white font-bold px-2">x</Text>
    </View>)
  }



  if (viewMode == 'ADD') {
    return (<FormAdd setViewMode={setViewMode} title={title} baseApiUrl={baseApiUrl} user={user} reloadData={reloadData} />)
  }







  return (<SafeAreaLayout style={{ flex: 1 }} insets='top'>
    <Stack.Screen options={{ headerShown: false }} />
    <View className=" flex-row items-center justify-between p-2">
      <View className=" flex-col items-start justify-start">
        <Text className=" text-md font-bold">{title}</Text>
        <Text className=" text-md">BLU UPBU DEO KELAS I  DEO - SORONG</Text>
      </View>
      <TouchableOpacity className="p-1 mr-4" onPress={() => router.push(`${basepath}/account`)}>
        <Image source={user.foto ? { uri: user.foto.url } : IconPng} style={{ width: 30, height: 30, borderRadius: 30 / 2 }} resizeMode="cover" />
      </TouchableOpacity>
    </View>

    <View className=" flex-1 bg-slate-200">
      <View className=" flex-1 bg-slate-200">
        <View className=" flex-col">
          <View className="mx-2 mt-2 bg-white flex-col rounded" >
            <View className="items-center justify-between flex-row p-2">
              <View>
                <Toggle checked={!!hanyaPengaduanSaya} onChange={(e) => {
                  if (e) {
                    setHanyaPengaduanSaya([{ createdBy: { id: user.id } }])
                  } else {
                    setHanyaPengaduanSaya(null)
                  }
                }}>
                  <View className=" flex-col">
                    <Text className=" text-xs uppercase">{!!hanyaPengaduanSaya ? 'PENGADUAN ANDA' : 'PENGADUAN PUBLIK'}</Text>
                    <Text className=" text-xs uppercase">{!isLoading && !isError ? `TOTAL - ${pagination.total}` : 'LOADING ...'}</Text>
                  </View>
                </Toggle>
              </View>
              <View className=" flex-row items-center justify-center space-x-2">

               

                {!isLoading && !isError && (<TouchableOpacity onPress={() => setModalVisible(true)} className=" bg-blue-50 border border-blue-700 rounded p-1 flex-row space-x-1 items-center justify-center">
                  <AntDesign name="filter" size={18} color="rgb(29 78 216)" />
                  <Text className=" text-xs text-blue-700">FILTER</Text>
                </TouchableOpacity>)}

                {!isLoading && !isError && (<TouchableOpacity onPress={() => setViewMode('ADD')} className=" bg-red-50 border border-red-700 rounded p-1 flex-row space-x-1 items-center justify-center">
                  <AntDesign name="pluscircleo" size={18} color="rgb(185 28 28)" />
                  <Text className=" text-xs text-red-700">BARU</Text>
                </TouchableOpacity>)}







              </View>
            </View>



            <View className="items-center justify-between flex-row p-2 border-t border-slate-100">

              <View className=" flex-row space-x-6">
                <TouchableOpacity onPress={goToFirst} className="  p-1">
                  <AntDesign name="stepbackward" size={18} color={getCanPreviousPage ? 'rgb(71 85 105)' : 'rgb(226 232 240)'} />
                </TouchableOpacity>

                <TouchableOpacity onPress={goToPrev} className=" p-1">
                  <AntDesign name="banckward" size={18} color={getCanPreviousPage ? 'rgb(71 85 105)' : 'rgb(226 232 240)'} />
                </TouchableOpacity>
              </View>


              <Text className=" text-xs text-slate-700">
                {!isLoading && !isError ? `PAGE ${pagination?.pageCount ? pagination?.page : 0} OF ${pagination?.pageCount || 0}` : ``}
              </Text>



              <View className=" flex-row space-x-6">
                <TouchableOpacity onPress={goToNext} className=" p-1">
                  <AntDesign name="forward" size={18} color={getCanNextPage ? 'rgb(71 85 105)' : 'rgb(226 232 240)'} />
                </TouchableOpacity>

                <TouchableOpacity onPress={goToLast} className="p-1">
                  <AntDesign name="stepforward" size={18} color={getCanNextPage ? 'rgb(71 85 105)' : 'rgb(226 232 240)'} />
                </TouchableOpacity>
              </View>

            </View>
          </View>



          {filters.length > 0 && (<View className=" flex-col">
            <View className="mx-6 mt-2">
              <Text className="text-xs text-slate-500 uppercase font-bold">
                CUSTOM FILTER AKTIF
              </Text>
            </View>
            <View className="mx-2 mt-1 flex-row items-start justify-start">
              <FlatList
                contentContainerStyle={{ paddingLeft: 5, paddingRight: 15 }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={filters}
                keyExtractor={(item, index) => `${index}`}
                renderItem={({ item, index }) => {
                  return (<RenderFilterItem key={index} item={item} index={index} />);
                }}
              />
            </View>
          </View>)}
        </View>

        {isLoading ?
          (<View className="item-center justify-center mt-16">
            <Text className=" uppercase font-bold text-slate-500 mx-auto">LOADING ...</Text>
          </View>) : isError ?
            (<View className="item-center justify-center mt-16 flex-col">
              <Text className=" uppercase font-bold text-slate-500 mx-auto">TERJADI KESALAHAN SAAT PENGAMBILAN DATA</Text>
              <TouchableOpacity className="p-1 bg-red-700 mx-auto rounded mt-4">
                <Text className=" text-white text-xs">RELOAD</Text>
              </TouchableOpacity>
            </View>) : (<ListData
              results={results}
              pagination={pagination}
              setQuery={setQuery}
              setViewMode={setViewMode}
              setItemFocus={setItemFocus}
              user={user}
              reloadData={reloadData}
              RenderItem={RenderItem}
            />)
        }
      </View>


      <Modal visible={modalVisible} backdropStyle={styles.backdrop}>
        <SearchFilters setFilters={setFilters} filters={filters} setModalVisible={setModalVisible} FILTERS={FILTERS} />
      </Modal>
    </View>




  </SafeAreaLayout>)
}


const ListData = ({ results, pagination, setQuery, setViewMode, setItemFocus, user, reloadData }) => {


  return (<View className=" flex-1 mt-2 mx-2">
    <FlashList

      ListEmptyComponent={<View className="items-center justify-center mt-24"><Text>BELUM ADA DATA</Text></View>}
      data={results || []}
      renderItem={({ item }) => <RenderItem item={item} />}
      estimatedItemSize={200}
      //  onEndReached={() => onEndReached(infinityData.pagination || null)}
      //onEndReachedThreshold={0.1}
      refreshing={false}
      onRefresh={() => reloadData()}
    />
  </View>)
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
      A
    </Text>
  );


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






const FormAdd = ({ setViewMode, title, baseApiUrl, user, reloadData }) => {

  const populateForm = {

  };

  const custom_fields = {
    title: {
      label: 'JUDUL PENGADUAN',
      required: true,
      type: "string",

    },
    uraian: {
      label: 'URAIAN PENGADUAN',
      required: true,
      type: "text",
    },
    lampiran: {
      label: 'LAMPIRAN FILE',
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
        <Text className=" text-md font-bold">BARU - {title}</Text>
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







const SearchFilters = ({ filters, setFilters, setModalVisible, FILTERS }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
  const [targetField, setTargetField] = React.useState(null);
  const [targetFieldReal, setTargetFieldReal] = React.useState(null);

  const [optionFilter, setOptionFilter] = React.useState(null);
  const [optionFilterReal, setOptionFilterReal] = React.useState(null);

  const [valueFilter, setValueFilter] = React.useState(null);



  const onFieldSelect = useCallback((val) => {
    setOptionFilterReal(null);
    setOptionFilter(null);
    setValueFilter(null);
    setTargetFieldReal(FILTERS[val.row]);
    setTargetField(FILTERS[val.row]['label']);
  }, [])





  const onOptionSelect = useCallback((val) => {
    if (!targetFieldReal) {
      return null;
    }
    setOptionFilterReal(targetFieldReal.optionFilter[val.row]);
    setOptionFilter(targetFieldReal.optionFilter[val.row]['label']);
  }, [targetFieldReal])



  const onValueSelect = useCallback((val) => {
    setValueFilter(val);
  }, [setValueFilter])







  const onApplyNewFilter = useCallback((val) => {
    console.log(valueFilter);
    const new_filter = [...filters];
    new_filter.push({
      [targetFieldReal.name]: { [optionFilterReal.value]: valueFilter }
    });
    setFilters(new_filter);
    return setModalVisible(false);
  }, [targetFieldReal, optionFilterReal, valueFilter, filters, setFilters, setModalVisible])







  const RenderFiendTargetFilter = () => {
    return (
      <Select onSelect={onFieldSelect} value={targetField}>
        {FILTERS.map((item, index) => {
          return (<SelectItem title={() => (<Text>{item['label']}</Text>)} key={index} />)
        })}
      </Select>
    )
  }




  const RenderOptionsFilter = ({ targetFieldReal, optionFilter }) => {
    if (!targetFieldReal) {
      return null;
    }

    return (
      <Select onSelect={onOptionSelect} value={optionFilter}>
        {targetFieldReal.optionFilter.map((item, index) => {
          return (<SelectItem title={() => (<Text>{item['label']}</Text>)} key={index} />)
        })}
      </Select>
    )
  }




  const RenderValueFilter = ({ targetFieldReal, optionFilterReal }) => {
    console.log(optionFilterReal)
    if (targetFieldReal == null) {
      return null;
    }

    if (optionFilterReal == null) {
      return null;
    }
    return (
      <Datepicker date={new Date()} onSelect={onValueSelect} />
    )
  }



  return (
    <View className="flex-1 bg-white rounded-lg w-full relative">
      <View className={classNames('flex-row items-center justify-between p-2 border-b border-slate-100', Platform.OS == 'android' ? 'w-80' : 'w-96')}>
        <Text className="text-lg">FILTER DATA</Text>
        <Text className="text-lg" onPress={() => setModalVisible(false)}>CLOSE</Text>
      </View>

      <View className="mt-2 p-2 ">
        <RenderFiendTargetFilter />
      </View>

      <View className="mt-2 p-2">
        <RenderOptionsFilter targetFieldReal={targetFieldReal} optionFilter={optionFilter} />
      </View>

      <View className="mt-2 p-2">
        <RenderValueFilter targetFieldReal={targetFieldReal} optionFilterReal={optionFilterReal} />
      </View>



      <View className="w-full mt-4 mb-2">
        {!!targetFieldReal && !!valueFilter && !!optionFilterReal && (<TouchableOpacity onPress={onApplyNewFilter} className=" bg-blue-700 items-center justify-center mx-4 rounded p-2">
          <Text className=" text-white">TAMBAH FILTER DATA</Text>
        </TouchableOpacity>)}
      </View>
    </View>)
}




*/
