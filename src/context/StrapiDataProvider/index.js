import { FontAwesome, FontAwesome5, MaterialIcons, Ionicons, Entypo, Fontisto, MaterialCommunityIcons, AntDesign, Octicons, Foundation } from "@expo/vector-icons";
import React, { useEffect, useContext, createContext, useState, Fragment, useCallback, useMemo, memo } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, StyleSheet, FlatList, Platform } from 'react-native';
import { Stack, Redirect, Tabs, useSegments, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaLayout } from '@components/safe-area-layout';
import IconPng from "@assets/icon.png";
import { StrapiFormBuilder } from '@context/StrapiFormProvider';
import { FlashList } from "@shopify/flash-list";
import { getFetchClient } from '@api/getFetchClient';
import { formatDistance, format } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { Modal, MenuItem, OverflowMenu, Datepicker, Select, SelectItem, IndexPath, Toggle } from '@ui-kitten/components';
import SearchFilters from './filters';
import RenderFilters from './RenderFilters';


import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';







const StrapiDataContext = createContext(null);
export function useStrapiData() {
  return useContext(StrapiDataContext);
}




const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}


const styles = StyleSheet.create({
  container: {
    minHeight: 192,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});






export const StrapiDataProvider = memo(({
  model,
  title,
  user,
  basepath,
  baseApiUrl,
  sort = 'createdAt:DESC',
  RenderItem,
  FILTERS,
  children,
  canCetak = false,
  canAdd = false,
  canFilter=false,
  setViewMode,
  setItemFocus,
  parentFilter=[],
  showBackButton=true, 
}) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [modalCetakVisible, setModalCetakVisible] = useState(false);
  const { post } = getFetchClient();
  const [{ isLoading, results, pagination, isError }, setState] = useState({ isLoading: true, results: [], pagination: {}, isError: false });
  const [filters, setFilters] = useState([]);
  const [query, setQuery] = useState({
    pageSize: 20,
    page: 1,
    sort: sort,
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
      const { data: { results, pagination } } = await post(`${baseApiUrl}`, {
        model: model,
        query: {
          ...query,
          filters: {
            ...query.filters,
            $and: [
              ...query.filters.$and,
              ...filters,
              ...parentFilter
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
      console.log('PUUUUUUUUUUKLLLIIIEEEE');
      console.log(results)
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
  }, [query, filters])





  const deleteFilter = useCallback((name) => {
    const newArr = filters.filter((item) => Object.keys(item)[0] !== name);
    setFilters(newArr);
  }, [filters, setFilters])




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
  }, [query, filters])









  return (<>

    <View className=" flex-1 bg-slate-200">
      <View className=" flex-col">
        <View className="mx-2 mt-2 bg-white flex-col rounded" >
          <View className="items-center justify-between flex-row p-2">
            <View>
              {showBackButton ? (<TouchableOpacity className="p-1" onPress={() => router.canGoBack() ? router.back() : router.push(basepath)}>
                <Text className=" text-blue-500 text-xs">KEMBALI</Text>
              </TouchableOpacity>) : title ? (<Text className=" text-slate-500 text-xs font-bold uppercase">{title}</Text>) : null}
            </View>
            <View className=" flex-row items-center justify-center space-x-2">

              {canCetak && !isLoading && !isError && (<TouchableOpacity onPress={() => setModalCetakVisible(true)} className=" bg-green-50 border border-green-700 rounded p-1 flex-row space-x-1 items-center justify-center">
                <AntDesign name="printer" size={18} color="black" />
                <Text className=" text-xs text-green-700">CETAK</Text>
              </TouchableOpacity>)}

              {canAdd && !isLoading && !isError && (<TouchableOpacity onPress={() => setViewMode('add')} className=" bg-red-50 border border-red-700 rounded p-1 flex-row space-x-1 items-center justify-center">
                <AntDesign name="pluscircleo" size={18} color="rgb(185 28 28)" />
                <Text className=" text-xs text-red-700">BARU</Text>
              </TouchableOpacity>)}


              {canFilter && !isLoading && !isError && (<TouchableOpacity onPress={() => setModalVisible(true)} className=" bg-blue-50 border border-blue-700 rounded p-1 flex-row space-x-1 items-center justify-center">
                <AntDesign name="filter" size={18} color="rgb(29 78 216)" />
                <Text className=" text-xs text-blue-700">FILTER</Text>
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


            <View className=" flex-col items-center justify-center">
            <Text className=" text-xs text-slate-700 font-semibold">
              {!isLoading && !isError ? `TOTAL  ${pagination.total} RECORDS` : ``}
            </Text>
            <Text className=" text-xs text-slate-700">
              {!isLoading && !isError ? `PAGE ${pagination?.pageCount ? pagination?.page : 0} OF ${pagination?.pageCount || 0}` : ``}
            </Text>
            
            </View>



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
                return (<RenderFilters key={index} item={item} index={index} FILTERS={FILTERS} deleteFilter={deleteFilter} />);
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

  </>)
})







const ListData = ({ results, setViewMode, setItemFocus, user, reloadData, RenderItem }) => {


  return (<View className=" flex-1 mt-2 mx-2">
    <FlashList

      ListEmptyComponent={<View className="items-center justify-center mt-24"><Text>BELUM ADA DATA</Text></View>}
      data={results || []}
      renderItem={({ item }) => <RenderItem item={item} user={user} setViewMode={setViewMode} setItemFocus={setItemFocus}/>}
      estimatedItemSize={200}
      //  onEndReached={() => onEndReached(infinityData.pagination || null)}
      //onEndReachedThreshold={0.1}
      refreshing={false}
      onRefresh={() => reloadData()}
    />
  </View>)
}







const CetakData = ({ user, baseApiUrl, title, setViewMode, reloadData, setModalCetakVisible, data }) => {

  console.log(data);
  const ws_data = [
    ["NO", "ID", "TITLE", "URAIAN"], // header row
    ...data.map((item, index) => [index + 1, item.id, item.title, item.descriptions])
  ];

  const test_Data = [
    ['Invoice No:', '12345'],
    ['Date:', '2023-08-24'],
    [],
    ['To:', 'Customer Name'],
    ['Address:', 'Customer Address'],
    [],
    ['Item', 'Quantity', 'Price', 'Total'],
    ['Item 1', '1', '10', '10'],
    ['Item 2', '2', '20', '40'],
    [],
    ['Subtotal:', '', '', '50'],
    ['Tax:', '', '', '5'],
    ['Total:', '', '', '55'],
  ]
  const signature = [
    [],
    [],
    [],
    ['Left Signature:', '', '', '', '', 'Right Signature:'],
    ['________________', '', '', '', '', '________________'],
    ['Name', '', '', '', '', 'Name'],
  ];








  const generateExcel = () => {

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet(test_Data);
    XLSX.utils.sheet_add_aoa(ws, signature, { origin: -1 });
    XLSX.utils.book_append_sheet(wb, ws, "TEST DATA SHARE", true);




    const base64 = XLSX.write(wb, { type: "base64" });
    const filename = FileSystem.documentDirectory + `LOG BOOK SCP I - ${title}.xlsx`;
    FileSystem.writeAsStringAsync(filename, base64, {
      encoding: FileSystem.EncodingType.Base64
    }).then(() => {
      Sharing.shareAsync(filename);
    });
  };
  return (<View className="flex-1 bg-white rounded-lg w-full relative">
    <View className={classNames('flex-row items-center justify-between p-2 border-b border-slate-100', Platform.OS == 'android' ? 'w-80' : 'w-96')}>
      <Text className="text-lg">CETAK DATA </Text>
      <Text className="text-lg" onPress={() => setModalCetakVisible(false)}>CLOSE</Text>
    </View>




    <View className="mt-2 p-2">
      <Text>sdasdasdasdasdas</Text>
    </View>



    <View className="w-full mt-4 mb-2">
      <TouchableOpacity onPress={generateExcel} className=" bg-blue-700 items-center justify-center mx-4 rounded p-2">
        <Text className=" text-white">CETAK DATA</Text>
      </TouchableOpacity>
    </View>
  </View>)
}













