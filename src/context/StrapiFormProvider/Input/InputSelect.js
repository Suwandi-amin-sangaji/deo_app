import React, { useState, useEffect, useCallback } from 'react';
import { Platform, View, TextInput, FlatList, TouchableOpacity, Text, Modal, SafeAreaView } from 'react-native';
import { Stack, useRouter, useNavigation, usePathname, router } from 'expo-router';
import { FontAwesome, FontAwesome5, MaterialIcons, Ionicons, Entypo, MaterialCommunityIcons, AntDesign, Octicons, Foundation } from "@expo/vector-icons";
import { getFetchClient } from '@api/getFetchClient';
import { SafeAreaLayout } from '@components/safe-area-layout';
import { debounce } from 'lodash';
import { formatDistance, format } from 'date-fns';


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
        <TouchableOpacity className={classNames('bg-slate-200 w-full rounded', error ? ' border border-red-700' : '')} onPress={() => setModalOpen(true)}>
          <Text className={classNames(error ? 'text-red-700 p-2' : 'text-slate-600 p-2')}>{`${label}`}</Text>
        </TouchableOpacity>
      </View>) : value?.length == 0 ? (<View className=" items-center w-full mt-2 mb-2">
        <TouchableOpacity className={classNames('bg-slate-200 w-full rounded', error ? ' border border-red-700' : '')} onPress={() => setModalOpen(true)}>
          <Text className={classNames(error ? 'text-red-700 p-2' : 'text-slate-600 p-2')}>{`${label}`}</Text>
        </TouchableOpacity>
      </View>) : null}

      {!error ? null : (<Text className="text-sm text-red-600">{error?.defaultMessage}</Text>)}


      {value && value.map((item, index) => {
        return (<View key={index} className={classNames(Platform.OS == 'android' ? 'flex-row  w-full rounded items-center justify-between' : 'flex-row w-full rounded p-2 items-center justify-between', 'mt-2 bg-slate-50 text-slate-500 border border-slate-300')}>
          <View className="flex-col mx-2">
            <Text className="text-xs text-slate-500">{`${label}`}</Text>
            <Text className="text-sm text-slate-600">{item.name || item.title || item.description || item.id}</Text>
          </View>
          <TouchableOpacity
            onPress={() => removeItem(item)} className="border border-slate-300 rounded-full px-2 mx-2 items-center justify-center">
            <Text className="text-sm uppercase text-slate-500 font-extrabold ">x</Text>
          </TouchableOpacity>
        </View>)
      })}


      {isModalOpen ? (
        <ModalYori
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




  const [{ isLoading, isError, data }, setData] = useState({ isLoading: true, isError: false, data: [] });
  const { post } = getFetchClient();
  const [text, setText] = useState('');





  const delayedOnChange = useCallback(debounce((textValue) => {
    // Eksekusi kode Anda di sini setelah delay 500ms
    console.log("Executing after delay:", textValue);
    getData(textValue)
  }, 500), []);  // 500ms delay





  const getData = async (search) => {
    try {
      setData((e) => {
        return {
          ...e,
          isLoading: true,
          isError: false
        }
      });
      const { data } = await post('/yori-android/get-data', {
        model: attribute.targetModel,
        query: {
          page: 1,
          pageSize: 20,
          _q: search || undefined
        }
      },
        {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      setData((e) => {
        return {
          ...e,
          data: data.results || [],
          isLoading: false,
          isError: false
        }
      });
    } catch (e) {
      setData((e) => {
        return {
          ...e,
          data: [],
          isLoading: false,
          isError: true
        }
      });
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
      <SafeAreaLayout style={{ flex: 1 }} insets='top'>
        <View className=" flex-1">
          <View className='flex-row items-center justify-between py-2 mx-4'>
            <Text className=" text-slate-600 uppercase font-bold">{label || 'LIST OPTION'}</Text>
            <TouchableOpacity
              className="bg-red-50 border border-red-700 p-2 rounded mx-4"
              onPress={() => {
                setModalOpen(false);
              }}
            >
              <Text className=" text-red-700">CLOSE</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder={`Search ${label} ...`}
            className="border rounded p-2 border-slate-300 mx-2 my-2"
            onChangeText={(textValue) => {
              setText(textValue);
              delayedOnChange(textValue);
            }}
            value={text}
          />


          {isLoading ? (<View className=" flex-1 items-center justify-center">
            <Text>LOADING DATA ...</Text>
          </View>) : isError ? (<View className=" flex-1 items-center justify-center flex-col">
            <Text className=" uppercase text-slate-700 mb-4 text-xs">terjadi kesalahan</Text>
            <TouchableOpacity className="p-2 bg-red-700 rounded">
              <Text className="text-xs text-white">click for reload</Text>
            </TouchableOpacity>
          </View>) : data.length == 0 ? (<View className=" flex-1 items-center justify-center flex-col">
            <Text className=" uppercase text-slate-700 mb-4 text-xs">NO DATA TO SHOW</Text>

          </View>) : (<FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (<RenderItem item={item} onSelect={onSelect} />)}
          />)}

        </View>

      </SafeAreaLayout>


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
          <Text className="font-bold uppercase">{item.name || item.title || item.description || item.id}</Text>
          <Text className="font-normal text-gray-500 text-xs lowercase">created - {formatTanggal(item.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}