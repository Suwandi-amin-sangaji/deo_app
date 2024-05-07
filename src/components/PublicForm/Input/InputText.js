import { View, Text, TextInput, Platform } from 'react-native'
import React from 'react'



const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export default ({ name, value, onChange, label, type, placeholder, error, attribute }) => {


  return (
    <View className=" flex-col mb-4">
      <View>
        <Text className={
          classNames(error ? 'text-red-600' : 'text-slate-600', 'uppercase text-xs font-bold mb-1')
          }>{label}</Text>
      </View>
      <View>
        {['biginteger','number', 'integer', 'float', 'decimal'].includes(attribute.type) ? 
        
        (<TextInput
          className={classNames(error ? 'border-red-600' : 'border-slate-300', 'border rounded',  Platform.OS == 'android' ? 'p-1' : 'p-2')}
          placeholder={placeholder}
          keyboardType="numeric"
          value={value}
          onChangeText={(text) => {
            onChange({ target: { name, value: text, type: attribute.type } }, false);
          }}
        />) : 
        
        attribute.type == 'text' ? ((<TextInput
          className={classNames(error ? 'border-red-600' : 'border-slate-300', 'border rounded p-1', 'h-24 p-2')}
          style={{ textAlignVertical: 'top' }}
          multiline={true}
          numberOfLines={4}
          placeholder={placeholder}
          value={value}
          onChangeText={(text) => {
            onChange({ target: { name, value: text, type: attribute.type } }, false);
          }}
        />)) : 
        
        
        ((<TextInput
          className={classNames(error ? 'border-red-600' : 'border-slate-300', 'border rounded',  Platform.OS == 'android' ? 'p-1' : 'p-2')}
          placeholder={placeholder}
          value={value}
          onChangeText={(text) => {
            onChange({ target: { name, value: text, type: attribute.type } }, false);
          }}
        />))}


        {!error ? null : (<Text className="text-sm text-red-600">{error?.defaultMessage}</Text>)}
      </View>
    </View>
  )
}

