import { FontAwesome, FontAwesome5, MaterialIcons, Ionicons, Entypo, Fontisto, MaterialCommunityIcons, AntDesign, Octicons, Foundation } from "@expo/vector-icons";
import React, { useEffect, useContext, createContext, useState, Fragment, useCallback, useMemo } from 'react';
import { Text, View, } from 'react-native';
import moment from "moment-timezone";




export default ({ item, index, FILTERS, deleteFilter }) => {
    const name = Object.keys(item)[0];
    let fieldItem = FILTERS.find((item_) => item_.name === name);

    const operator = Object.keys(item[fieldItem.name])[0];
    const value = item[fieldItem.name][operator];



    const RederOperator = (operator) => {
        switch (operator) {
            case 'sdas': {
                return 'sdasdasd';
                break;
            }
            default: {
                return '='
            }
        }
    }



    const RederValue = (value) => {
        if (typeof value === 'string') {
            return value
        } else {
            if (value instanceof Date) {
                return moment(value).format('ll');
            } else {
                const conditions = Object.keys(value)[0];
                const value_target = value[conditions];
                return value_target;
            }
        }
    }



    return (
        <View className=" flex-row items-center justify-between rounded-lg bg-blue-500 p-1 space-x-6 mr-2">
            <Text className="text-xs text-white lowercase">{index + 1}. {fieldItem?.label || name} {RederOperator(operator)} {RederValue(value)}</Text>
            <Text onPress={() => deleteFilter(name)} className="text-xs text-white font-bold px-2">x</Text>
        </View>
    )
}
