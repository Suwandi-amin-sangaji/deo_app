import React, { useState, useEffect } from 'react';
import { Platform, View, TextInput, FlatList, TouchableOpacity, Text, Modal, SafeAreaView } from 'react-native';
import { Stack, useRouter, useNavigation, usePathname, router } from 'expo-router';
import { FontAwesome, FontAwesome5, MaterialIcons, Ionicons, Entypo, MaterialCommunityIcons, AntDesign, Octicons, Foundation } from "@expo/vector-icons";
import { getFetchClient } from '@api/getFetchClient';

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}




export default ({
  value,
  user,
  onChange,
  name,
  attribute,
  label,
  placeholder,
  error,
}) => {

  const [isModalOpen, setModalOpen] = useState(false);




  const onValueChange = (new_value) => {
    let newValue = value ? [...value] : [];
    newValue.push(new_value);
    onChange({ target: { name, value: newValue, type: attribute.type } }, false);
    setModalOpen(false);
  }




  const removeItem = (val) => {
    let newValue = [...value];
    newValue = newValue.filter(item => item.id !== val.id);
    onChange({ target: { name, value: newValue, type: attribute.type } }, false);
  }
  



  return (
    <>

      {attribute.relationType == 'manyToOne' && !value ? (<View className=" items-center w-full mt-2 mb-2">
        <TouchableOpacity className={classNames('bg-slate-200 w-full rounded', error ? ' border border-red-700' :'')} onPress={() => setModalOpen(true)}>
          <Text className={classNames(error ? 'text-red-700 p-2' :'text-slate-600 p-2')}>{`${label}`}</Text>
        </TouchableOpacity>
      </View>) : value?.length == 0 ? (<View className=" items-center w-full mt-2 mb-2">
        <TouchableOpacity className={classNames('bg-slate-200 w-full rounded', error ? ' border border-red-700' :'')} onPress={() => setModalOpen(true)}>
          <Text className={classNames(error ? 'text-red-700 p-2' :'text-slate-600 p-2')}>{`${label}`}</Text>
        </TouchableOpacity>
      </View>) : null }

      {!error ? null :(<Text className="text-sm text-red-600">{error?.defaultMessage}</Text>)}
      

      {value && value.map((item, index) => {
        return (<View key={index} className={classNames(Platform.OS == 'android' ? 'flex-row bg-green-50 text-green-700 border border-green-700 w-full rounded p-1 items-center justify-between' : 'flex-row bg-green-50 text-green-700 border border-green-700 w-full rounded p-2 items-center justify-between','mt-2')}>
          <View className="flex-col">
            <Text className="text-xs text-green-600">{`${label}`}</Text>
            <Text className="text-lg text-green-700 font-semibold">{item.name || item.id}</Text>
          </View>
          <TouchableOpacity 
            onPress={()=>removeItem(item)} className=" p-2">
            <FontAwesome name="close" size={18} color="rgb(21 128 61)" />
          </TouchableOpacity>
        </View>)
      })}


      {isModalOpen ? (<ModalYori
        onValueChange={onValueChange}
        attribute={attribute}
        name={name}
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}

        label={label}
        placeholder={placeholder}
        user={user}
      />) : null}

    </>
  );
};



const ModalYori = ({
  onValueChange,
  attribute,
  name,
  error,
  label,
  placeholder,
  isModalOpen,
  setModalOpen,
  user,

}) => {


  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const { post } = getFetchClient();



  const getData = async () => {
    try {
      const { data } = await post('/yori-android/get-data', {
        model: attribute.targetModel,
        query: {}
      },
        {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      setData(data.results || []);
    } catch (e) {
      console.log(e);
    }
  }




  const onSelect = (value) => {
    onValueChange(value);
  }



  useEffect(() => {
    getData();
  }, []);




  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isModalOpen}
    >
      <View className=" flex-1">
        <View className='flex-row items-center justify-between py-2 mx-2 my-2'>
          <Text className=" text-slate-400 uppercase">{placeholder || 'LIST OPTION'}</Text>
          <TouchableOpacity
            onPress={() => {
              setModalOpen(false);
            }}
          >
            <Text>BATAL</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder={`Search ${label} ...`}
          className="border rounded p-2 border-slate-300 mx-2"
          onChangeText={setSearch}
          value={search}
        />


        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (<RenderItem item={item} onSelect={onSelect} />)}
        />

      </View>
    </Modal>
  );
};




const RenderItem = ({ item, onSelect }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => onSelect(item)}
      className={classNames(
        // Platform.OS === 'android' ? 'mt-8' : '',
        //   Platform.OS === 'android' ? 'px-2' : 'px-4',
        'px-4 flex-row items-center justify-between py-4 border-t border-slate-200'
      )}>
      <View className={classNames(Platform.OS === 'android' ? '' : '', 'flex-row items-center')}>
        <View className=" items-center justify-center pr-4">
          <Text>{item.id}</Text>
        </View>
        <View>
          <Text className="font-bold uppercase">{item.name}</Text>
          <Text className="font-normal text-gray-500 text-xs uppercase">asdasdasdasda</Text>
        </View>
      </View>
      {/**<TouchableOpacity 
           
            className={classNames(Platform.OS === 'android' ? 'p-2' : 'p-4','rounded-md items-center justify-center mr-4 bg-indigo-700')}>
             <Text className="text-white uppercase">EDIT</Text>
           </TouchableOpacity> */}

    </TouchableOpacity>
  )
}