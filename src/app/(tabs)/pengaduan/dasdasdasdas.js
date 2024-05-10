import { FontAwesome, FontAwesome5, MaterialIcons, Ionicons, Entypo, Fontisto, MaterialCommunityIcons, AntDesign, Octicons, Foundation } from "@expo/vector-icons";
import React, { useEffect, useContext, createContext, useState, Fragment, useCallback } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, StyleSheet, FlatList, Platform } from 'react-native';
import { Stack, Redirect, Tabs, useSegments, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaLayout } from '@components/safe-area-layout';
import IconPng from "@assets/icon.png";
import { useLayoutContext } from './_layout';
import { StrapiFormBuilder } from '@context/StrapiFormProvider';
import { FlashList } from "@shopify/flash-list";
import { getFetchClient } from '@api/getFetchClient';
import { formatDistance, format } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';


import { Modal, MenuItem, OverflowMenu, Datepicker, Select, SelectItem, IndexPath, Toggle } from '@ui-kitten/components';


const MODEL = 'api::data-pengaduan.data-pengaduan';
//=========================================

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






export default () => {

  const [modalVisible, setModalVisible] = useState(false);
  const [modalCetakVisible, setModalCetakVisible] = useState(false);

  const { title, user, basepath, baseApiUrl } = useLayoutContext();
  const { post } = getFetchClient();
  const [viewMode, setViewMode] = useState(null);
  const [itemFocus, setItemFocus] = useState(null);
  const [{ isLoading, results, pagination, isError }, setState] = useState({ isLoading: true, results: [], pagination: {}, isError: false });
  const [filters, setFilters] = useState([]);
  const [hanyaPengaduanSaya, setHanyaPengaduanSaya] = useState([{ createdBy: { id: user.id } }]);
  const [query, setQuery] = useState({
    pageSize: 10,
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




  useEffect(() => {
    loadData(query);
  }, [query, filters, hanyaPengaduanSaya])




  if (viewMode == 'ADD') {
    return (<FormAdd
      user={user}
      baseApiUrl={baseApiUrl}
      title={title}
      setViewMode={setViewMode}
      reloadData={reloadData}
    />)
  }






  const RenderFilterItem = ({ item, index }) => {
    const name = Object.keys(item)[0];
    let fieldItem = FILTERS.find((item_) => item_.name === name);
    console.log(fieldItem);
    return (<View className=" flex-row items-center justify-between rounded-lg bg-blue-500 p-1 space-x-6 mr-2">
      <Text className="text-xs text-white lowercase">{index + 1}. {fieldItem?.label || name} = 'sdasdasdasda sdasd'</Text>
      <Text onPress={() => deleteFilter(name)} className="text-xs text-white font-bold px-2">x</Text>
    </View>)
  }





  return (<SafeAreaLayout style={{ flex: 1 }} insets='top'>
    <Stack.Screen
      options={{
        headerShown: false
      }}
    />
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
                  <Text className=" text-xs uppercase">{!!hanyaPengaduanSaya ? 'PENGADUAN ANDA' : 'SEMUA PENGADUAN'}</Text>
                  <Text className=" text-xs uppercase">{!isLoading && !isError ? `TOTAL - ${pagination.total}` : 'LOADING ...'}</Text>
                </View>
              </Toggle>
            </View>
            <View className=" flex-row items-center justify-center space-x-2">

              {/*!isLoading && !isError && (<TouchableOpacity onPress={() => setModalCetakVisible(true)} className=" bg-green-50 border border-green-700 rounded p-1">
              <Text className=" text-xs text-green-700">CETAK</Text>
              </TouchableOpacity>)*/}

              <TouchableOpacity onPress={() => setViewMode('ADD')} className=" bg-red-50 border border-red-700 rounded p-1">
                <Text className=" text-xs text-red-700">PENGADUAN BARU</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModalVisible(true)} className=" bg-blue-50 border border-blue-700 rounded p-1">
                <Text className=" text-xs text-blue-700">F</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="items-center justify-between flex-row p-2 border-t border-slate-100">

            <View className=" flex-row space-x-6">
              <TouchableOpacity onPress={() => setModalVisible(true)} className=" bg-blue-50 border border-blue-700 rounded p-1">
                <Text className=" text-xs text-blue-700">F</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModalVisible(true)} className=" bg-blue-50 border border-blue-700 rounded p-1">
                <Text className=" text-xs text-blue-700">F</Text>
              </TouchableOpacity>
              </View>

           
                <Text className=" text-xs text-slate-700">
                  {!isLoading && !isError ? `PAGE ${pagination?.page} OF ${pagination?.pageCount} PAGES` : `` }
                </Text>
             


              <View className=" flex-row space-x-6">
              <TouchableOpacity onPress={() => setModalVisible(true)} className=" bg-blue-50 border border-blue-700 rounded p-1">
                <Text className=" text-xs text-blue-700">F</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModalVisible(true)} className=" bg-blue-50 border border-blue-700 rounded p-1">
                <Text className=" text-xs text-blue-700">F</Text>
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
          </View>) :
          (<ListData
            results={results}
            pagination={pagination}
            setQuery={setQuery}
            setViewMode={setViewMode}
            setItemFocus={setItemFocus}
            user={user}
            reloadData={reloadData}
          />)
      }
    </View>



    <Modal visible={modalVisible} backdropStyle={styles.backdrop}>
      <SearchFilters setFilters={setFilters} filters={filters} setModalVisible={setModalVisible} />
    </Modal>

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
      TOGGLE MENU
    </Text>
  );


  return (<View className="bg-white border border-slate-100 mb-2 rounded p-2">
    <View className=" flex-row items-center justify-between border-b border-slate-100">
      <View className=" flex-col">
        <Text className=" text-sm font-bold">
          ID - #00-2021-{item.id}
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

    <View className="flex-col">
      <Text className=" mt-1 text-sm">
        {item.title}
      </Text>
      <Text className=" mt-1  text-xs">
        {item.uraian}
      </Text>
    </View>



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


const SearchFilters = ({ filters, setFilters, setModalVisible }) => {
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
