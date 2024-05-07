import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from 'expo-router';
import moment from 'moment-timezone';

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



const formatTampilanJam = (value) => {
  if (!value) {
    return null;
  }
  const dateTime = moment(value).tz('Asia/Tokyo');
  const hoursUTC = dateTime.format('HH');
  const minutesUTC = dateTime.format('mm');
  return `${hoursUTC}:${minutesUTC}`;
};



export default ({ name, value, onChange, label, type, placeholder, error, attribute }) => {


  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [tempDate, setTempDate] = useState(null);




  const convertToTanggal = useMemo(()=>{
    if(!value){
      return null;
    }
    return formatTampilanTanggal(new Date(value));
  }, [value, tempDate])



  const formatToJam = useMemo(()=>{
    console.log('JAM BABI')
    if(!value){
      return null;
    }
    return formatTampilanJam(new Date(value));
  }, [value, tempDate])






  const onChangeDate = useCallback((event, selectedDate) => {
    console.log(value);
    const formattedDate = moment(selectedDate);
   // console.log(moment(selectedDate).format('YYYY-MM-DD'))
    console.log(`${new Date(selectedDate).toISOString()}`);
    setTempDate(`${new Date(selectedDate).toISOString()}`)
    setShowDate(false);
    setShowTime(true);

    if(!convertToTanggal || formatToJam){
      return null
    }
  },[value, convertToTanggal, formatToJam])


  

  const onChangeTime = useCallback((event, selectedDate) => {
    console.log(value);
    const formattedDate = `${new Date(selectedDate).toISOString()}`;
    console.log(formattedDate);
    setShowTime(false);
    console.log('ANJING');
    console.log(formattedDate);
    onChange({ target: { name, value: formattedDate, type: attribute.type } }, false);

    //if(!convertToTanggal || formatToJam){
    //  return null
    //}
    //const currentDate = selectedDate;
    //onChange({ target: { name, value: `${new Date(currentDate).toISOString()}`, type: attribute.type } }, false);
    //setShowDate(false);
  },[value, name, attribute, tempDate])








  return (
    <View className=" flex-col mb-4">
      <View>
        <Text className={classNames(error ? 'text-red-600' : 'text-slate-600', 'uppercase text-xs font-bold mb-1')}>{label}</Text>
      </View>

      {!value ? 
        (<View className=" items-center w-full mt-2 mb-2">
        <TouchableOpacity className={classNames('bg-slate-200 w-full rounded', error ? ' border border-red-700' : '', Platform.OS == 'android' ? 'p-1' : 'p-1')} onPress={() => setShowDate(true)}>
          <Text className={classNames(error ? 'text-red-700 p-2' : 'text-slate-600 p-2')}>{`${label}`}</Text>
        </TouchableOpacity>
      </View>) 
      : 
      (<View className=" items-center w-full mt-2 mb-2">
        <TouchableOpacity className={classNames('bg-slate-200 w-full rounded', error ? ' border border-red-700' : '', Platform.OS == 'android' ? 'p-1' : 'p-1')} onPress={() => setShowDate(true)}>
          <Text className={classNames(error ? 'text-red-700 p-2' : 'text-slate-600 p-2')}>{`${convertToTanggal} ${formatToJam}`}</Text>
        </TouchableOpacity>
      </View>)
      }



      
      
      {!error ? null : (<Text className="text-sm text-red-600">{error?.defaultMessage}</Text>)}
      {showDate && (<DateTimePicker
        value={value ? new Date(value) : new Date()}
        mode={'date'}
        is24Hour={true}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={onChangeDate}
      />)}


      {showTime && (<DateTimePicker
        value={tempDate ? new Date(tempDate) : new Date()}
        mode={'time'}
        is24Hour={true}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={onChangeTime}
      />)}
    </View>
  )
}

