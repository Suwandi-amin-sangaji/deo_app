import React, { useEffect, useState, useRef, useMemo } from 'react'
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFetchClient } from '@api/getFetchClient';
import axios from 'axios';
import { Image } from 'expo-image';
const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

const InputSingleUpload = ({ label, value, attribute, onChange, name, user , error}) => {

  const [percentage, setPercentage] = useState(0);
  const tokenRef = useRef(axios.CancelToken.source());
  const { post } = getFetchClient();



  const _value = useMemo(() => {
    if (attribute.multiple) {
      return value;
    } else {
      if (!value) {
        return null;
      } else {
        if (Array.isArray(value)) {
          if (value.length == null) {
            return null;
          } else {
            return value[0];
          }
        } else {
          return value
        }
      }
    }
  }, [value, attribute])




  onValueChange = (value) => {
    if (attribute.multiple) {
      onChange({ target: { name, value: value[0], type: attribute.type } }, false);
    } else {
      onChange({ target: { name, value: value, type: attribute.type } }, false);
    }

  }


  useEffect(() => {
    (async () => {
      if (Platform.OS === 'ios') {
        const cameraRollStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (
          cameraRollStatus.status !== "granted" ||
          cameraStatus.status !== "granted"
        ) {
          alert("Sorry, we need these permissions to make this work!");
        }
      }
    })();
  }, []);


  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: "Images",
      allowsEditing: true,
      aspect: [4, 3],
      //quality: 1,
    });
    handleImagePicked(result);
  };



  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      //mediaTypes: ImagePicker.MediaTypeOptions.All,
      mediaTypes: "Images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    handleImagePicked(result);
  };



  handleImagePicked = async (pickerResult) => {
    try {
      if (pickerResult.canceled) {
        alert("Upload dibatalkan");
        return;
      } else {
        setPercentage(0);
        const uri = pickerResult.assets[0].uri;
        let uriArray = uri.split(".");
        let fileType = uriArray[uriArray.length - 1];
        const pre_filename = uri.split('/').pop();
        const filename = `image_${Date.now()}_${pre_filename}`;
        const type = `image/${fileType}`;
        const name = uri.split('/').pop();
        const img = { uri, name, type };
        const uploadResult = await uploadImage(filename, img);
        setPercentage(0);
        onValueChange(uploadResult);
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed");
    }
  };




  uploadImage = async(filename, img) => {
        try{
            const formData = new FormData();
            formData.append('files', img);
            formData.append('fileInfo',
            JSON.stringify({
                    name : filename,
                    folder: null
                })
            );
            const { data } = await post('/yori-android/public-upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress({ total, loaded }) {
                    setPercentage((loaded / total) * 100);
                  },
            });
            console.log(data);
            return data;
        }catch(e){
            console.log(e);
            console.log('ERROR UPLOAD');
            return [];
        }
      };







  const valueImage = useMemo(() => {
    if (Array.isArray(value)) {
      if (value.length == 0) {
        return null
      }
      return value[0]
    } else {
      if (!value) {
        return null
      } else {
        return value
      }
    }
  }, [value])



  return (
    <>

      <View className=" flex-1 mt-2 relative h-56">
        {percentage !== 0 && <Text className="text-xs text-red-500 font-bold mb-2">UPLOAD PROGGRES {percentage}%</Text>}
        {!valueImage ? (
          <View className={classNames('rounded h-56 bg-slate-300')}>
            <View>
              <Text></Text>
            </View>
          </View>) : (<Image
            className={classNames('rounded h-56')}
            source={{ uri: valueImage?.url }}
            placeholder={blurhash}
            contentFit="cover"
            transition={500}
          />)}


        <View className=" absolute flex-1 w-full h-full">
          <View className=" flex-1 items-center justify-center">
            {!valueImage ? (<View className="flex-col w-full my-2 items-center justify-center rounded h-36">
              <View>
                <Text>{label}</Text>
              </View>
              <View className="w-full my-2 items-center justify-center flex-row space-x-4">
                <TouchableOpacity
                  onPress={pickImage}
                  className="bg-green-500 p-2 rounded"
                >
                  <Text className=" uppercase text-white text-xs">PILIH FOTO</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={takePhoto}
                  className="bg-blue-500 p-2 rounded"
                >
                  <Text className=" uppercase text-white text-xs">AKSES KAMERA</Text>
                </TouchableOpacity>
              </View>
            </View>) : (<View className="flex-col w-full my-2 items-center justify-center rounded h-36">
              <View className="w-full my-2 items-center justify-center flex-row space-x-4">

                <TouchableOpacity
                  onPress={pickImage}
                  className="bg-red-50 border border-red-700 p-2 rounded"
                >
                  <Text className=" uppercase text-red-700 text-xs">PILIH FOTO</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={takePhoto}
                  className="bg-blue-50 border border-blue-700 p-2 rounded"
                >
                  <Text className=" uppercase text-blue-700 text-xs">AKSES KAMERA</Text>
                </TouchableOpacity>
              </View>
            </View>)}
          </View>
        </View>
      </View>

      {!error ? null : (<Text className="text-sm text-red-600">{error?.defaultMessage}</Text>)}



    </>
  )

}

export default InputSingleUpload