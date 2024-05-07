import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { router } from 'expo-router';
import MapView, { Region, PROVIDER_GOOGLE, Marker, Circle } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";


const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ')
}




export default ({
    onChange,
    name,
    value,
    attribute,
    label,
    placeholder,

}) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isMapReady, setMapReady] = useState(false);


    const onValueChange = (value) => {
        onChange({ target: { name, value: value, type: attribute.type } }, false);
        setModalOpen(false);
    }

    const openModal = () => {
        setModalOpen(true);
        setTimeout(() => {
            setMapReady(true);
        }, 300);
    }


    return (
        <>
            <View className=" items-center w-full mt-2 mb-2">
                <TouchableOpacity className=" bg-slate-200 w-full rounded" onPress={openModal}>
                    <Text className="text-slate-600 p-2">{label}</Text>
                </TouchableOpacity>
            </View>

            {isModalOpen && (
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={isModalOpen}
                    onRequestClose={() => setModalOpen(false)}
                >
                    {isMapReady && <ModalYoriMap value={value} onValueChange={onValueChange} setModalOpen={setModalOpen} />}
                    <View style={{ position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', width: "100%" }}>
                        <View className=" flex-col mt-6 mb-6 ml-6">
                            <Text className={classNames(Platform.OS === 'android' ? 'text-white uppercase font-bold text-lg' : 'text-white uppercase font-bold text-lg mt-14')} >DEO AIRPORT - ASSETS LOCATIONS</Text>
                            <Text className={classNames(Platform.OS === 'android' ? 'text-white' : 'text-white')} >{placeholder || label}</Text>
                        </View>
                    </View>








                </Modal>
            )}

        </>
    );
}





const ModalYoriMap = ({
    onValueChange,
    value,
    setModalOpen
}) => {



    //  const navigation = useNavigation();
    const [zoom, setZoom] = useState('');

    const center_point = { latitude: -0.8911746135364345, longitude: 131.28807988017795 };
    const [activeIndex, setActiveIndex] = useState(-1);
    const mapRef = useRef(null);
    const [boundingBox, setBoundingBox] = useState([]);
    const mapdata = [{ lat: -0.886895999451519, lang: 131.28997284919024 }];
    const [locationData, setLocationData] = useState(null);






    const unFocusProperty = () => {
        setActiveIndex(-1);
        // navigation.setOptions({ tabBarStyle: { display: "flex" } });
    };



    const handleMapPress = (e) => {
        const coordinate = e.nativeEvent.coordinate;
        const position = e.nativeEvent.position;
        console.log([{ lat: coordinate.latitude, lang: coordinate.longitude }]);
        setLocationData(coordinate);
        //  console.log({ coordinate, position });
        if (Platform.OS === "android") unFocusProperty();
    };



    const handleMarkerPress = (index) => {
        setTimeout(() => {
            mapRef.current?.animateCamera({
                center: {
                    latitude: properties[index].lat,
                    longitude: properties[index].lng,
                },
            });
        }, 100);

        setTimeout(() => {
            const newRegion = {
                latitude: properties[index].lat,
                latitudeDelta: region?.latitudeDelta && region.latitudeDelta < 4 ? region.latitudeDelta : 4,
                longitude: properties[index].lng,
                longitudeDelta: region?.longitudeDelta && region.longitudeDelta < 4 ? region.longitudeDelta : 4,
            };
            setRegion(newRegion);
        }, 600);
        setActiveIndex(index);
        //navigation.setOptions({ tabBarStyle: { display: "none" } });
    };








    useEffect(() => {
        if (value) {
            setLocationData(JSON.parse(value))
        }
    }, [value])



    return (

        <View style={styles.container}>
            <MapView
                ref={mapRef}
                rotateEnabled={false}
                showsUserLocation={true}
                showsScale={true}
                userLocationUpdateInterval={5000}
                onPress={handleMapPress}
                showsMyLocationButton={true}
                //loadingEnabled={true}
                showsCompass={true}
                mapType={'satellite'}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={{
                    "longitudeDelta": 0.02377208322286606,
                    "latitudeDelta": 0.039483034072978485,
                    "longitude": 131.28637181594968,
                    "latitude": -0.8916497569973014
                }}>

                {locationData && (<Marker coordinate={locationData} onPress={() => { }}>
                    <MaterialCommunityIcons name="map-marker" size={32} color={'#F30C0C'} />
                </Marker>)}

                {mapdata.map((i, index) => (
                    <Circle
                        key={index}
                        strokeColor={'#fff'}
                        center={center_point}
                        strokeWidth={1}
                        radius={9260}
                        fillColor={'transparent'}
                        onPress={() => { }}
                    >
                    </Circle>
                ))}
            </MapView>

            <View style={{ position: 'absolute', bottom: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', width: "100%" }}>

                <TouchableOpacity
                    onPress={() => setModalOpen(false)}
                    className={classNames(Platform.OS === 'android' ? 'mx-2 p-2 bg-red-600 rounded w-20 mb-8 mt-8' : 'p-2 mx-2 bg-red-500 rounded w-20 mb-16 mt-8')} >
                    <Text className={classNames(Platform.OS === 'android' ? 'text-white' : 'text-white')} >CANCEL</Text>
                </TouchableOpacity>

            </View>

            {locationData && (<View style={{ position: 'absolute', bottom: 0, right: 0 }}>
                <TouchableOpacity
                    onPress={() => onValueChange(JSON.stringify(locationData))}

                    className={classNames(Platform.OS === 'android' ? 'mx-2 p-2 bg-blue-600 rounded w-20 mb-8 mt-8' : 'p-2 mx-2 bg-blue-500 rounded w-20 mb-16 mt-8')} >
                    <Text className={classNames(Platform.OS === 'android' ? 'text-white' : 'text-white')} >SELECT</Text>
                </TouchableOpacity>
            </View>)}
        </View>
    );
};




const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: "hidden",
    },
    map: {
        height: "100%",
        width: "100%",
    },
    card: {
        position: "absolute",
        bottom: 10,
    },
    exit: {
        backgroundColor: "#fff",
        padding: 10,
        position: "absolute",
        top: 170,
        left: 15,
        borderRadius: 30,
    }
});