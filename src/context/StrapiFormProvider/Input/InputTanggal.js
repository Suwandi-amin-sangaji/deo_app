import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import {  useFocusEffect } from 'expo-router';
import moment from "moment-timezone";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
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




export default ({ name, value, onChange, label, type, placeholder, error, attribute }) => {



  const [show, setShow] = useState(false);

 


  const onChangeA = (event, selectedDate) => {
    const currentDate = selectedDate;
    onChange({ target: { name, value: `${new Date(currentDate).toISOString()}`, type: attribute.type } }, false);
    setShow(false);
  };

  const showMode = (currentMode) => {
    setShow(true);
  };

  const showDatepicker = () => {
    if(!value){
      onChange({ target: { name, value: `${new Date().toISOString()}`, type: attribute.type } }, false);
    }
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };


 


  return (
    <View className=" flex-col mb-4">
      <View>
        <Text className={classNames(error ? 'text-red-600' : 'text-slate-600', 'uppercase text-xs font-bold mb-1')}>{label}</Text>
      </View>
      <View className=" items-center w-full mt-2 mb-2">
        <TouchableOpacity className={classNames('bg-slate-200 w-full rounded', error ? ' border border-red-700' : '',  Platform.OS == 'android' ? 'p-1' : 'p-1')} onPress={()=> show ? setShow(!show) :  showDatepicker()}>
          <Text className={classNames(error ? 'text-red-700 p-2' : 'text-slate-600 p-2')}>{value ? formatTampilanTanggal(value) :  `${label}`}</Text>
        </TouchableOpacity>
      </View>
      {!error ? null : (<Text className="text-sm text-red-600">{error?.defaultMessage}</Text>)}
      {show && (<DateTimePicker
        value={new Date(value)}
        mode={'date'}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={onChangeA}
      />)}
    </View>
  )
}

