import React from 'react'
import { Toggle, Text } from '@ui-kitten/components';
import { View, TextInput, Platform } from 'react-native'



const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}



export default ({ name, value, onChange, label, type, placeholder, error, attribute }) => {

  const onChangeValue = (value) => {
    console.log(value);
    onChange({ target: { name, value: value, type: attribute.type } }, false);
  }

  return (
    <View className=" flex-col mb-2">
      <View>
        <Text className={
          classNames(error ? 'text-red-600' : 'text-slate-600', 'uppercase text-xs font-bold mb-1')
        }>{label}</Text>
      </View>
      <View className=" items-start justify-start">
        <Toggle onChange={onChangeValue} checked={value} />
        {!error ? null : (<Text className="text-sm text-red-600">{error?.defaultMessage}</Text>)}
      </View>
    </View>
  )
}

