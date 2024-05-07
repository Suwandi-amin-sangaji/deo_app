import axios from 'axios';
import qs from 'qs';
import { router, useSegments } from 'expo-router';
//import useAuth from '@context/auth';



export const reqInterceptor = async (config) => {
  return config;
};




export const reqErrorInterceptor = (error) => {
  return Promise.reject(error);
};

export const resInterceptor = (response) => response;
export const resErrorInterceptor = async(error) => {
  // whatever you want to do with the error
  //if (error?.response?.status === 401) {
  //  router.replace('/(tabs)/beranda');
 // }
  throw error;
};



export const addInterceptors = (instance) => {
  instance.interceptors.request.use(reqInterceptor, reqErrorInterceptor);
  instance.interceptors.response.use(resInterceptor, resErrorInterceptor);
};



export const fetchClient = () => {
  const instance = axios.create({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    paramsSerializer: (params) => {
      return qs.stringify(params, { encode: false });
    },
  });
  addInterceptors(instance);
  return instance;
};



const instance = fetchClient();
export { instance };