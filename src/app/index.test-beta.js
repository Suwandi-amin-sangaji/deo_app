import React, { useRef, useEffect, Fragment } from 'react';
import { Link, Stack, router } from 'expo-router';
import {
  Dimensions,
  Image,
  StyleSheet,
} from 'react-native';
import {
  Card,
  List,
  ListElement,
  ListProps,
  Layout,
  Text,
} from '@ui-kitten/components';



export default function App() {


const renderItem = (info) => {


    const renderItemHeader = (evaProps) => (
      <Layout {...evaProps}>
        <Text category='h6'>sdasdasda</Text>
        <Text category='s1'>sdasdasdasdas</Text>
      </Layout>
    );

    return (
      <Card
        style={styles.itemContainer}
        header={renderItemHeader}
        onPress={() => {}}>
        <Image style={styles.itemImage} source={{uri : 'https://no-cache.hubspot.com/cta/default/2452262/38b7285f-759c-4b4e-aedc-6391d3af697c.png'}} />
      </Card>
    );
  }

    






  return (
    <Fragment>
      <Stack.Screen options={{headerShown: false}}/>
       
          <List 
          data={[1,2,3]}
          onItemPress={()=>{}}
          contentContainerStyle={[styles.container]}
          numColumns={1}
          renderItem={renderItem}
        />
    </Fragment>
  );
}



const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  itemHeader: {
    paddingHorizontal: 8,
  },
  itemContainer: {
    flex: 1,
    margin: 8,
   // maxWidth: Dimensions.get('window').width / 2 - 24,
  },
  itemImage: {
    height: 276,
    width: '100%',
    resizeMode: 'contain',
  },
});