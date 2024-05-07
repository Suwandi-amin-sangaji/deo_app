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
import { Picker } from '@react-native-picker/picker';
import moment from 'moment-timezone';
import { Modal, MenuItem, OverflowMenu, Datepicker, Select, SelectItem, IndexPath,Input  } from '@ui-kitten/components';


import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';


//=========================================
const MODEL = 'api::data-amc.data-amc';
const PAGE_TITLE = 'DATA AMC - ON PROGGRESS';

const FILTERS = [
  {
    name: 'airlines_perusahan',
    label: 'NAMA OPERATOR',
    type: "relation",
    relationType: "manyToOne",
    targetField : 'name',
    optionFilter: [
      { label: 'MENGANDUNG KATA', value: '$containsi' },
    ]
  },
  {
    name: 'aircraft_type',
    label: 'JENIS PESAWAT',
    type: "relation",
    relationType: "manyToOne",
    targetField : 'name',
    optionFilter: [
      { label: 'MENGANDUNG KATA', value: '$containsi' },
    ]
  },
  {
    name: 'from',
    label: 'FROM',
    type: "relation",
    relationType: "manyToOne",
    targetField : 'name',
    optionFilter: [
      { label: 'MENGANDUNG KATA', value: '$containsi' },
    ]
  }
];


//=========================================


const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
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
  const [query, setQuery] = useState({
    pageSize: 10,
    page: 1,
    sort: 'createdAt:DESC',
    filters: {
      $and: [
        { pos: { $eq: 'SCP_I' } }
      ]
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
            $and: [...query.filters.$and, ...filters]
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
  }, [query, filters])





  const deleteFilter = useCallback((name) => {
    const newArr = filters.filter((item) => Object.keys(item)[0] !== name);
    setFilters(newArr);
  }, [filters, setFilters])




  useEffect(() => {
    loadData(query);
  }, [query, filters])




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
      <TouchableOpacity className="p-1" onPress={() => router.canGoBack() ? router.back() : router.push(basepath)}>
        <Text className=" text-blue-500 text-xs">KEMBALI</Text>
      </TouchableOpacity>
      <View className=" flex-col items-end justify-end">
        <Text className=" text-md font-bold">{PAGE_TITLE} - {title}</Text>
        <Text className="text-xs text-slate-500">BLU UPBU KELAS I DEO - SORONG</Text>
      </View>
    </View>

    <View className=" flex-1 bg-slate-200">
      <View className=" flex-col">
        <View className="mx-2 mt-2 bg-white items-center justify-between flex-row p-2 rounded" >
          <View><Text>SEARCH</Text></View>
          <View className=" flex-row items-center justify-center space-x-2">

            {/*!isLoading && !isError && (<TouchableOpacity onPress={() => setModalCetakVisible(true)} className=" bg-green-50 border border-green-700 rounded p-1">
              <Text className=" text-xs text-green-700">CETAK</Text>
              </TouchableOpacity>)*/}

            <TouchableOpacity onPress={() => setModalVisible(true)} className=" bg-blue-50 border border-blue-700 rounded p-1">
              <Text className=" text-xs text-blue-700">FILTER</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setViewMode('ADD')} className=" bg-red-50 border border-red-700 rounded p-1">
              <Text className=" text-xs text-red-700">BARU</Text>
            </TouchableOpacity>
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
          (<Text>ERROR</Text>) :
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

    <Modal visible={modalCetakVisible} backdropStyle={styles.backdrop}>
      <CetakData
        data={results}
        user={user}
        baseApiUrl={baseApiUrl}
        title={title}
        setViewMode={setViewMode}
        reloadData={reloadData}
        setModalCetakVisible={setModalCetakVisible}
      />
    </Modal>

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
        <Text className=" text-sm uppercase">
        {item.airlines_perusahan?.name || 'UNKNOW OPERATOR'}
        </Text>
        <Text className="text-xs text-gray-500 lowercase">
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
      </View>
    </View>



  </View>)
}






const FormAdd = ({ setViewMode, title, baseApiUrl, user, reloadData }) => {

  const populateForm = {
  };

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
    fn_arr: {
      label: 'FLIGHT NUMBER ARRIVAL',
      type: "string"
    },
    eta: {
      label: 'ESTIMATE TIME ARRIVAL',
      type: "datetime"
    },
    data_parking_stand: {
      label: 'PARKING STAND',
      type: "relation",
      relationType: "manyToOne",
      targetModel: "api::data-parking-stand.data-parking-stand",
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
    if (!targetFieldReal) {
      return null;
    }

    console.log(optionFilterReal)
    switch(targetFieldReal['type']){
      case 'relation' :{
        setValueFilter({ [targetFieldReal['targetField']] : { [optionFilterReal['value']] : val} });
       break;
      }
      default : {
        setValueFilter({ [optionFilterReal['val']] : val});
      }

    }
    
  }, [setValueFilter, targetFieldReal, optionFilterReal])







  const onApplyNewFilter = useCallback((val) => {
    console.log(valueFilter);
    const new_filter = [...filters];
    new_filter.push({ [targetFieldReal.name]: valueFilter });
    console.log(JSON.stringify(new_filter));
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
  //  console.log(optionFilterReal)
    if (targetFieldReal == null) {
      return null;
    }

    if (optionFilterReal == null) {
      return null;
    }

    switch(targetFieldReal['type']){
      case 'relation' :{
        return (
          <Input 
            value={valueFilter ? valueFilter?.[targetFieldReal['targetField']]?.[optionFilterReal['value']] : ''} 
            onChangeText={onValueSelect}
            />)
       break;
      }
      case 'date' :{
        return (
          <Datepicker date={new Date()} onSelect={onValueSelect} />
        )
       break;
      }
      default : {
        return (
          <Datepicker date={new Date()} onSelect={onValueSelect} />
        )
      }

    }
    
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
