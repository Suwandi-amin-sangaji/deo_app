import React, { useCallback, useMemo } from 'react';
import { IndexPath, Select, SelectItem } from '@ui-kitten/components';
import { View, TextInput, Text, Platform } from 'react-native'


const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}





export default ({ name, value, onChange, label, type, placeholder, error, attribute }) => {


  const onChangeValue = (value) => {
    onChange({ target: { name, value: attribute.enum[value.row], type: attribute.type } }, false);
  }


  const valueRender = (val) => {
    return (<Text>{value || ''}</Text>)
  }

  return (
    <View className=" flex-col mb-2">
      <View>
        <Text className={
          classNames(error ? 'text-red-600' : 'text-slate-600', 'uppercase text-xs font-bold mb-1')
        }>{label}</Text>
      </View>

      <Select onSelect={onChangeValue} value={valueRender}>
       
        {attribute?.enum.map((item) => {
          return (<SelectItem title={item} key={item} />
          )
        })}
      </Select>
      {!error ? null : (<Text className="text-sm text-red-600">{error?.defaultMessage}</Text>)}
    </View>



  );
};


