import { Entypo } from "@expo/vector-icons";
import React, { useEffect, useRef, memo, useCallback, useState } from 'react';
import { View, Text, BackHandler, Platform, TouchableOpacity, Modal } from 'react-native'
import { WebView } from 'react-native-webview';
import { Link, Stack, router, useNavigation, useFocusEffect } from 'expo-router';
import { SafeAreaLayout } from '@components/safe-area-layout';
import { StrapiFormBuilder } from '@context/StrapiFormProvider';




const Retool = ({ url, user, homeBackUrl, baseApiUrl, logout = ()=>{} }) => {


  const webViewRef = useRef(null);
  const [{
    isModalAddOpen, 
    customFieldsAdd , 
    populateFormAdd 
  }, setModalAddState] = useState({isModalAddOpen : false, customFieldsAdd : null, populateFormAdd : null});
  




  const onAndroidBackPress = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }
    return false;
  };



  const reload = useCallback(() => {
    if (webViewRef) {
      webViewRef.current.reload();
    }
  }, [webViewRef])



  const onMessage = useCallback((messageData) => {
    try {
      const data = JSON.parse(messageData);
      if (!data.type) {
        return void 0;
      }

      switch (data.type) {
        case 'logout': {
          logout()
          break;
        }


        case 'back': {
          router.canGoBack() ? router.back() : router.push('/(tabs)/beranda');
          break;
        }

        case 'push': {
          if (typeof data.params == 'string') {
            router.push(data.params);
          } else {
            alert('error zlock-122 : params must string')
          }
          break;
        }


        case 'openFormAdd': {
          if (data.params?.custom_fields) {
            setModalAddState((e)=>{
              return {
                ...e,
                isModalAddOpen : true, 
                customFieldsAdd : data.params.custom_fields, 
                populateFormAdd : {} 
              }
            })
          } else {
            alert('error zlock-122 : params must string')
          }
          break;
        }


        default: {
          alert('sdasdasdasdas')
          break
        }
      }
    } catch (e) {
      console.log(e)
    }
  }, [])








  useEffect(() => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress);
      };
    }
  }, []);


const reloadWebView = () => {
  webViewRef.current.reload();
}



  const INJECTED_JAVASCRIPT = `
  YORI= '12';
  `;




  const LoadingWebView = () =>{
    return (<View className=" flex-1 items-center justify-center bg-white -mt-24">
      <Text className=" text-xl text-red-700 font-bold">LOADING DATA ...</Text>
    </View>)
  }


  const ErrorWebView = () =>{
    return (<TouchableOpacity className=" flex-1 items-center justify-center bg-white -mt-24" onPress={reloadWebView}>
      <Text className=" text-xl text-red-700 font-bold">CANNOT GET DATA</Text>
    </TouchableOpacity>)
  }






  return (


    <>
      <WebView
        ref={webViewRef}
        onMessage={(event) => {
          onMessage(event.nativeEvent.data)
        }}
        applicationNameForUserAgent={'DEO-AIRPORT/1.1.0'}
        source={{ uri: url }}
        cacheEnabled={false}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}
        allowsFullscreenVideo={true}
        allowsInlineMediaPlayback={true}
        style={{ marginTop: 0 }}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        androidHardwareAccelerationDisabled={true}
        startInLoadingState={true}
        renderLoading={() => <LoadingWebView />}
        renderError={(errorName) => <ErrorWebView name={errorName} />}
        onShouldStartLoadWithRequest={(request) => {
          // Only allow navigating within this website
          //return request.url.startsWith('https://reactnative.dev');
          console.log(request);
          return true;
        }}
      />

      {isModalAddOpen ? (
        <ModalYori 
          setModalAddState={setModalAddState}
          customFieldsAdd={customFieldsAdd}
          user={user}
          baseApiUrl={baseApiUrl}
        />) : null}
    </>
  )
}






const ModalYori = ({
  onValueChange,
  attribute,
  name,
  error,
  label,
  placeholder,
  isModalAddOpen,
  customFieldsAdd,
  setModalAddState,
  user,
  baseApiUrl

}) => {





  onSuccess = useCallback(()=>{
    setModalAddState((e)=>{
      return {
        ...e,
        isModalAddOpen : false, 
        customFieldsAdd : null , 
        populateFormAdd : null 
      }
    })
  },[])



  onCancel = useCallback(()=>{
    setModalAddState((e)=>{
      return {
        ...e,
        isModalAddOpen : false, 
        customFieldsAdd : null , 
        populateFormAdd : null 
      }
    })
  },[])




  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={true}
    >

      {Platform.OS == 'android' ? (<View className=" flex-1">

        <View className=" flex-row justify-between p-2 bg-red-700">
          <Text>sdasd</Text>
          <TouchableOpacity onPress={() => setModalAddState(false)}>
            <Text>CLOSE</Text>
          </TouchableOpacity>
        </View>


        <StrapiFormBuilder
          mutateLink={`${baseApiUrl}/add-personil`}
          onCreateSuccess={() => setModalAddState(false)}
          populateForm={{}}
          custom_fields={customFieldsAdd}
          TAG_USEQUERY={'___'}
          isCreatingEntry={true}
          user={user}
          model={''}
        />

      </View>) : (<SafeAreaLayout style={{ flex: 1 }} insets='top'>
        <View className=" flex-1">

          <View className=" flex-row justify-between p-2 bg-red-700">
            <Text>sdasd</Text>
            <TouchableOpacity onPress={onCancel}>
              <Text>CLOSE</Text>
            </TouchableOpacity>
          </View>
          <StrapiFormBuilder
            mutateLink={`${baseApiUrl}/add-personil`}
            onCreateSuccess={onSuccess}
            populateForm={{}}
            custom_fields={customFieldsAdd}
            TAG_USEQUERY={'___'}
            isCreatingEntry={true}
            user={user}
            model={''}
          />
        </View>
        </SafeAreaLayout>)}
    </Modal>
  );
};



export default memo(Retool)