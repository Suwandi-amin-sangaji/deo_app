import { FontAwesome, FontAwesome5, MaterialIcons, Ionicons, Entypo, Fontisto, MaterialCommunityIcons, AntDesign, Octicons, Foundation } from "@expo/vector-icons";
import React, {  useState,  useCallback, useMemo, useRef } from 'react';
import { Text, View, Image, TouchableOpacity, Platform, Button } from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaLayout } from '@components/safe-area-layout';
import IconPng from "@assets/Logo.png";
import { useLayoutContext } from './_layout';
import { StrapiDataProvider } from "@context/StrapiDataProvider";
import classNames from "@utils/classNames";
import formatTanggal from "@utils/formatTanggal";
import formatTampilanTanggal from "@utils/formatTampilanTanggal";
import formatTampilanJam from "@utils/formatTampilanJam";


import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import generateHTML from "@utils/pdfTemplate";
import ViewShot, {captureRef} from "react-native-view-shot";
import QRCode from 'react-native-qrcode-svg';

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
    {is_submit : { $eq : true}},
    {verified : { $eq : true}}
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
        setItemFocus={setItemFocusCallback}
        RenderItem={RenderItem}
        parentFilter={parentFilter}
      />
    </View>
  </SafeAreaLayout>)
}











const RenderItem = ({ item, user, setViewMode, setItemFocus }) => {
  const [selectedPrinter, setSelectedPrinter] = React.useState();
  const viewShotRef = useRef();





  const print = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html,
      printerUrl: selectedPrinter?.url, // iOS only
    });
  };


  const printToFile = async () => {
    const capture = await captureRef(viewShotRef, {
      format: 'png',
      result: 'base64'
    });
    const qrCode = `data:image/png;base64,${capture}`;
    console.log(qrCode);
    const html = await generateHTML(item, qrCode);
    const { uri } = await Print.printToFileAsync({ html : html });
    await shareAsync(uri, { UTI: `${item.no_smu}.pdf`, mimeType: 'application/pdf' });
  };




  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  };


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
      <TouchableOpacity onPress={printToFile} className="p-1 bg-green-50 border rounded border-green-700">
        <Text className="text-xs text-green-700">CETAK CSD</Text>
      </TouchableOpacity>
      {Platform.OS === 'ios' && (
        <>
          <View style={{}} />
          <Button title="Select printer" onPress={selectPrinter} />
          <View style={{}} />
          {selectedPrinter ? (
            <Text style={styles.printer}>{`Selected printer: ${selectedPrinter.name}`}</Text>
          ) : undefined}
        </>
      )}
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
          <ViewShot ref={viewShotRef}>
            <QRCode value="http://awesome.link.qr" logo={IconPng} />
            </ViewShot>
          </View>
        </View>
      </View>
    </View>
  </View>)
}




