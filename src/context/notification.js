import { router, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useColorScheme, Alert } from 'react-native';
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import axios from 'axios';
import Constants from "expo-constants";

const NotificationContext = createContext(null);
export function useNotification() {
  return useContext(NotificationContext);
}



Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});




async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId}
      )).data;
      console.log(token)
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}







export function NotificationProvider(props) {



  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();





  const sendExpoToken = async (expoPushToken) => {
    try {
      const deviceId = await SecureStore.getItemAsync('deviceId');
      const { data } = await axios({
        url: `${process.env.EXPO_PUBLIC_BACKEND_URL}/yori-android/setup`,
        method: 'POST',
        data: {
          id_device : deviceId,
          expoPushToken: expoPushToken
        }
      });
    } catch (e) {
      console.log(e)
      
    }
  }





  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
        router.push('global-notification', { data });
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);





  useEffect(() => {
    if (expoPushToken) {
      sendExpoToken(expoPushToken);
    }
  }, [expoPushToken]);




  return (
    <NotificationContext.Provider
      value={{
        notification: notification,
        expoPushToken : expoPushToken
      }}>
      {props.children}
    </NotificationContext.Provider>
  );
}
