
import { Platform, View, Animated, KeyboardAvoidingView, SafeAreaView, Text, FlatList, Image, ScrollView, TouchableOpacity, Pressable, StyleSheet } from "react-native";
import React, { Fragment, useCallback, useEffect, useLayoutEffect, useState, useMemo, useRef } from 'react';
import { FontAwesome, FontAwesome5, MaterialIcons, Ionicons, Entypo, MaterialCommunityIcons, AntDesign, Octicons, Foundation } from "@expo/vector-icons";
import { Link, Stack, router, useNavigation } from 'expo-router';
import IconPng from "@assets/icon.png";
import BluPng from "@assets/blu.png";
import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { getFetchClient } from '@api/getFetchClient';
import { formatDistance, format } from 'date-fns';
import MenuBeranda from "@components/beranda/menu";
import Swiper from 'react-native-swiper';
import axios from 'axios'
import * as Linking from 'expo-linking';

import {
  ImageBackground,
  UIManager,
  LayoutAnimation,
  PixelRatio,
  Dimensions,
  I18nManager,
} from 'react-native';





const scaleValue = PixelRatio.get() / 2;
const scaleWithPixel = (size, limitScale = 1.2) => {
  /* setting default upto 20% when resolution device upto 20% with defalt iPhone 7 */
  const value = scaleValue > limitScale ? limitScale : scaleValue;
  return size * value;
};





const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}
const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


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


function calculateTimeDifference(time1, time2) {
  const date1 = new Date(time1);
  const date2 = new Date(time2);
  let timeDifference = Math.abs(date2 - date1);
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  timeDifference -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  timeDifference -= hours * (1000 * 60 * 60);
  const minutes = Math.floor(timeDifference / (1000 * 60));
  if (days > 0) {
    return `${days} HARI ${hours} JAM ${minutes} MENIT`;
  } else if (hours > 0) {
    return `${hours} JAM ${minutes} MENIT`;
  } else {
    return `${minutes} MENIT`;
  }
}






export default () => {


  return (
    <View className="flex-1 bg-white relative">
      <Stack.Screen options={{ headerShown: false }} />


      <View className={classNames(
        // Platform.OS === 'android' ? 'mt-8' : '',
        //   Platform.OS === 'android' ? 'px-2' : 'px-4',
        'flex-row items-center justify-between bg-red-700 py-4'
      )}>
        <View className={classNames(Platform.OS === 'android' ? 'mt-4' : 'mt-8', 'ml-2 space-y-0 flex-row items-center space-x-4')}>
          <View className=" items-center justify-center">
            <Image source={IconPng} style={{ width: 55, height: 55, borderRadius: 55 / 2 }} resizeMode="cover" />
          </View>
          <View>
            <Text className="text-xl text-white font-bold">SELAMAT DATANG</Text>
            <Text className="text-md text-white font-normal uppercase">BLU UPBU Kelas I DEO - Sorong</Text>
          </View>
        </View>
        <View className={classNames(Platform.OS === 'android' ? 'mt-4' : 'mt-8', 'items-center justify-center shadow-lg mr-4')}>
          <Image source={BluPng} style={{ width: 55, height: 55, borderRadius: 55 / 2 }} resizeMode="cover" />
        </View>

      </View>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>

        <View className=" relative">
        <Banner />
        </View>

        <View className=" mt-40">
        <MenuBeranda />
        </View>





        {/**SECTION 2 */}
        <View>
          {/**CONTENT TITLE */}
          <View className="flex-row items-center justify-between px-4 mt-4">


            <Text className="text-red-700 text-sm font-bold uppercase">
              penting untuk diketahui
            </Text>
            <TouchableOpacity

              className="flex-row items-center justify-center space-x-2">

            </TouchableOpacity>
          </View>

          {/**CONTENT LIST */}
          <View className="px-4 mt-4 flex-row items-center justify-evenly flex-wrap">
            <Penting />
          </View>
        </View>


        <View className="mb-8 mt-4">
          {/**CONTENT TITLE */}
          <View className="flex-row items-center justify-between px-4">


            <Text className="text-red-700 text-sm font-bold uppercase">
              PROMO MENARIK
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/beranda_content/tips')}
              className="flex-row items-center justify-center space-x-2">

            </TouchableOpacity>
          </View>

          {/**CONTENT LIST */}
          <View className="px-4 mt-4 flex-row items-center justify-evenly flex-wrap">
            <Promo />
          </View>
        </View>




      </ScrollView>







    </View>
  )
}







const useGetData = (query) => {
  return useQuery({
    queryKey: ['beranda-get-slides'],
    queryFn: async () => {
      const { data } = await axios({
        method: 'POST',
        url : `https://data.deoairport.co.id/yori-web-public/public/get-banner`,
        data : query
      })
      return data
    }
  })
}


const Banner = () => {
  const { isLoading, error, data, refetch } = useGetData({});



  console.log('----------- home');
  console.log(data)

  if(isLoading){
    return null
  }


  if(error){
    return null
  }


return (<View className="absolute top-0">
        {data?.length > 0 && (<Swiper
          dotStyle={{
            backgroundColor: '#ffffff',
          }}
          activeDotColor={'#ffffff'}
          paginationStyle={styles.contentPage}
          removeClippedSubviews={false}
          autoplay={true}
          autoplayTimeout={3}>
          {data.map((item, index) => {
            return (
              <ImageBackground key={`slider${index}`} source={{uri: item.image?.url}} style={styles.banner}>
                  
              </ImageBackground>
            );
          })}
        </Swiper>)}
      </View>);
  };














//============================================================================
const TAG_USEQUERY_PENTING = 'BERANDA_PENTING_CRAFT';
const MODEL_PENTING = 'api::public-penting-diketahui.public-penting-diketahui';
const baseApiUrl = `${process.env.EXPO_PUBLIC_BACKEND_URL}/public-panduan-penumpang`;
//============================================================================



const Penting = () => {
  const queryClient = useQueryClient()
  const navigation = useNavigation();
  const { post } = getFetchClient();
  const [viewMode, setViewMode] = useState('list');
  const [query, setQuery] = useState({
    pageSize: 10,
    sort: 'createdAt:DESC',
    filters: {
      $and: [

      ]
    }
  });


  const { status, data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey: [TAG_USEQUERY_PENTING, query],
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.pagination.page < lastPage.pagination.pageCount) {
        return lastPage.pagination.page + 1
      }
      return undefined;
    },
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await post(`${baseApiUrl}/find-many`, {
        model: MODEL_PENTING,
        query: {
          ...query,
          page: pageParam
        }
      });
      return data
    }
  });




  const onRefresh = useCallback(() => {
    //queryClient.invalidateQueries({ queryKey: [TAG_USEQUERY_PENTING] })
  }, [queryClient])




  const onEndReached = useCallback(() => {
    //    if (hasNextPage) {
    //      fetchNextPage();
    //    }
  }, [hasNextPage, fetchNextPage])



  const infinityData = useMemo(() => {
    let results = [];
    let pagination = {};

    if (!data) {
      return results;
    }
    data.pages.map((page) => {
      results = [...results, ...page.results];
      pagination = page.pagination;
      // console.log(page.results);
    })
    return { results, pagination };
  }, [data])






  return (
    <View className=" h-56">
      {status === 'loading' ? (
        <Text>Loading ... </Text>
      ) : status === 'error' ? (
        <Text>Error: {error.message}</Text>
      ) : (
        <FlatList
          contentContainerStyle={{ paddingLeft: 5, paddingRight: 15 }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={infinityData.results || []}
          keyExtractor={(item, index) => `locations ${index}`}
          renderItem={({ item, index }) => {
            return (<RenderItemPenting item={item} />)
          }}
        />
      )}
    </View>
  )
}






const RenderItemPenting = ({ item }) => {

  const openUrl = (url) =>{
    Linking.openURL(url);
  }

  if(!item.link){
    return (
      <View 
        className="mr-2 relative" style={{ borderColor: 'rgba(112, 128, 144, 0.2)', borderWidth: 0.5, borderRadius: 6, backgroundColor: 'white' }}>
        <Image source={{ uri: item.image?.url }} className="w-[300px] h-full object-contain rounded" />
        <View className=" absolute bottom-0 w-full p-2 rounded-b-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
          <Text className=" text-xs font-normal text-white">{item.title}</Text>
        </View>
      </View>
    )
  }



  if(!item.link.includes('https')){
    return (
      <View 
        className="mr-2 relative" style={{ borderColor: 'rgba(112, 128, 144, 0.2)', borderWidth: 0.5, borderRadius: 6, backgroundColor: 'white' }}>
        <Image source={{ uri: item.image?.url }} className="w-[300px] h-full object-contain rounded" />
        <View className=" absolute bottom-0 w-full p-2 rounded-b-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
          <Text className=" text-xs font-normal text-white">{item.title}</Text>
        </View>
      </View>
    )
  }


  return (
    <TouchableOpacity 
      onPress={()=>openUrl(item.link)}
      className="mr-2 relative" style={{ borderColor: 'rgba(112, 128, 144, 0.2)', borderWidth: 0.5, borderRadius: 6, backgroundColor: 'white' }}>
      <Image source={{ uri: item.image?.url }} className="w-[300px] h-full object-contain rounded" />
      <View className=" absolute bottom-0 w-full p-2 rounded-b-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
        <Text className=" text-xs font-normal text-white">{item.title}</Text>
      </View>
    </TouchableOpacity>
  )
}









//============================================================================
const TAG_USEQUERY_PROMO = 'BERANDA_PENTING_PROMO';
const MODEL_PROMO = 'api::public-penting-diketahui.public-penting-diketahui';
//============================================================================
const Promo = () => {
  const queryClient = useQueryClient()
  const navigation = useNavigation();
  const { post } = getFetchClient();
  const [viewMode, setViewMode] = useState('list');
  const [query, setQuery] = useState({
    pageSize: 10,
    sort: 'createdAt:DESC',
    filters: {
      $and: [

      ]
    }
  });


  const { status, data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey: [TAG_USEQUERY_PROMO, query],
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.pagination.page < lastPage.pagination.pageCount) {
        return lastPage.pagination.page + 1
      }
      return undefined;
    },
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await post(`${baseApiUrl}/find-many`, {
        model: MODEL_PROMO,
        query: {
          ...query,
          page: pageParam
        }
      });
      return data
    }
  });




  const onRefresh = useCallback(() => {
    //queryClient.invalidateQueries({ queryKey: [TAG_USEQUERY_PROMO] })
  }, [queryClient])




  const onEndReached = useCallback(() => {
    //    if (hasNextPage) {
    //      fetchNextPage();
    //    }
  }, [hasNextPage, fetchNextPage])



  const infinityData = useMemo(() => {
    let results = [];
    let pagination = {};

    if (!data) {
      return results;
    }
    data.pages.map((page) => {
      results = [...results, ...page.results];
      pagination = page.pagination;
      // console.log(page.results);
    })
    return { results, pagination };
  }, [data])






  return (
    <View className=" h-56">
      {status === 'loading' ? (
        <Text>Loading ... </Text>
      ) : status === 'error' ? (
        <Text>Error: {error.message}</Text>
      ) : (
        <FlatList
          contentContainerStyle={{ paddingLeft: 5, paddingRight: 15 }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={infinityData.results || []}
          keyExtractor={(item, index) => `locations ${index}`}
          renderItem={({ item, index }) => {
            return (<RenderItemPromo item={item} />)
          }}
        />
      )}
    </View>
  )
}






const RenderItemPromo = ({ item }) => {
  const openUrl = (url) =>{
    Linking.openURL(url);
  }

  if(!item.link){
    return (
      <View 
        className="mr-2 relative" style={{ borderColor: 'rgba(112, 128, 144, 0.2)', borderWidth: 0.5, borderRadius: 6, backgroundColor: 'white' }}>
        <Image source={{ uri: item.image?.url }} className="w-[300px] h-full object-contain rounded" />
        <View className=" absolute bottom-0 w-full p-2 rounded-b-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
          <Text className=" text-xs font-normal text-white">{item.title}</Text>
        </View>
      </View>
    )
  }



  if(!item.link.includes('https')){
    return (
      <View 
        className="mr-2 relative" style={{ borderColor: 'rgba(112, 128, 144, 0.2)', borderWidth: 0.5, borderRadius: 6, backgroundColor: 'white' }}>
        <Image source={{ uri: item.image?.url }} className="w-[300px] h-full object-contain rounded" />
        <View className=" absolute bottom-0 w-full p-2 rounded-b-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
          <Text className=" text-xs font-normal text-white">{item.title}</Text>
        </View>
      </View>
    )
  }


  return (
    <TouchableOpacity 
      onPress={()=>openUrl(item.link)}
      className="mr-2 relative" style={{ borderColor: 'rgba(112, 128, 144, 0.2)', borderWidth: 0.5, borderRadius: 6, backgroundColor: 'white' }}>
      <Image source={{ uri: item.image?.url }} className="w-[300px] h-full object-contain rounded" />
      <View className=" absolute bottom-0 w-full p-2 rounded-b-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
        <Text className=" text-xs font-normal text-white">{item.title}</Text>
      </View>
    </TouchableOpacity>
  )
}






const styles = StyleSheet.create({
  categoryContent: {
    width: 60,
    height: 60,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    flex: 1,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // This will give black color with 50% opacity
},

  imageBackground: {
    height: 140,
    width: '100%',
    position: 'absolute',
  },
  contentPage: {
    bottom: 50,
  },
  searchForm: {
    marginHorizontal: 15,
    padding: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    shadowOffset: {width: 1.5, height: 1.5},
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 1,
  },
  lineForm: {
    width: 1,
    height: '100%',
    margin: 10,
  },
  serviceContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  serviceItem: {
    alignItems: 'center',
    marginBottom: 15,
  },
  serviceCircleIcon: {
    width: 65,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  contentPopular: {
    marginHorizontal: 20,
    marginBottom: 15,
  },
  promotionBanner: {
    height: scaleWithPixel(100),
    width: '100%',
    marginTop: 10,
  },
  popularItem: {
    width: scaleWithPixel(135),
    height: scaleWithPixel(160),
    borderRadius: 8,
  },
  menuIcon: {
    width: 40,
    height: 40,
    position: 'absolute',
    bottom: 15,
    right: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
