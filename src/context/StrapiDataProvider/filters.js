import React, { useEffect, useState, Fragment, useCallback } from 'react';
import { Text, View, TouchableOpacity, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Modal, MenuItem, OverflowMenu, Datepicker, Select, SelectItem, IndexPath, Toggle, Input } from '@ui-kitten/components';
import { debounce } from 'lodash';




const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ')
}




export default ({ filters, setFilters, setModalVisible, FILTERS }) => {

    const [targetField, setTargetField] = React.useState(null);
    const [targetFieldReal, setTargetFieldReal] = React.useState(null);

    const [optionFilter, setOptionFilter] = React.useState(null);
    const [optionFilterReal, setOptionFilterReal] = React.useState(null);

    const [valueFilter, setValueFilter] = React.useState(null);



    const onFieldSelect = useCallback((val) => {
        setOptionFilterReal(null);
        setOptionFilter(null);
        setValueFilter(null);
        setTargetFieldReal(FILTERS[val.row]);
        setTargetField(FILTERS[val.row]['label']);
    }, [])





    const onOptionSelect = useCallback((val) => {
        if (!targetFieldReal) {
            return null;
        }
        setOptionFilterReal(targetFieldReal.optionFilter[val.row]);
        setOptionFilter(targetFieldReal.optionFilter[val.row]['label']);
    }, [targetFieldReal])







    const onValueSelect = useCallback((val) => {
        if (!targetFieldReal) {
            return null;
        }

        console.log(optionFilterReal)
        switch (targetFieldReal['type']) {
            case 'relation': {
                setValueFilter({ [targetFieldReal['targetField']]: { [optionFilterReal['value']]: val } });
                break;
            }
            default: {
                setValueFilter({ [optionFilterReal['value']]: val });
            }

        }

    }, [setValueFilter, targetFieldReal, optionFilterReal])





    const antidebounceTextKeyboardClose = debounce((val) => {
        console.log(val);
        onValueSelect(val);
        console.log('Teks disimpan:', val);
    }, 500);







    const onApplyNewFilter = useCallback((val) => {

        const new_filter = [...filters];
        new_filter.push({ [targetFieldReal.name]: valueFilter });
        console.log(JSON.stringify(new_filter));
        setFilters(new_filter);
        return setModalVisible(false);
    }, [targetFieldReal, optionFilterReal, valueFilter, filters, setFilters, setModalVisible])







    const RenderFiendTargetFilter = () => {
        return (
            <Select onSelect={onFieldSelect} value={targetField}>
                {FILTERS.map((item, index) => {
                    return (<SelectItem title={() => (<Text>{item['label']}</Text>)} key={index} />)
                })}
            </Select>
        )
    }




    const RenderOptionsFilter = ({ targetFieldReal, optionFilter }) => {
        if (!targetFieldReal) {
            return null;
        }

        return (
            <Select onSelect={onOptionSelect} value={optionFilter}>
                {targetFieldReal.optionFilter.map((item, index) => {
                    return (<SelectItem title={() => (<Text>{item['label']}</Text>)} key={index} />)
                })}
            </Select>
        )
    }




    const RenderValueFilter = ({ targetFieldReal, optionFilterReal }) => {
        //  console.log(optionFilterReal)
        if (targetFieldReal == null) {
            return null;
        }

        if (optionFilterReal == null) {
            return null;
        }

        switch (targetFieldReal['type']) {
            case 'relation': {
                return (
                    <Input
                        defaultValue={valueFilter ? valueFilter?.[targetFieldReal['targetField']]?.[optionFilterReal['value']] : ''}
                        onChangeText={antidebounceTextKeyboardClose}
                    />)
                break;
            }
            case 'date': {
                if (!valueFilter?.[optionFilterReal['value']]) {
                    return (<Datepicker date={new Date()} onSelect={onValueSelect} />)
                }
                else {
                    return (<Datepicker date={new Date(valueFilter[optionFilterReal['value']])} onSelect={onValueSelect} />)
                }
                break;
            }
            case 'string': {
                return (<Input defaultValue={valueFilter?.[optionFilterReal['value']] || ''} onChangeText={antidebounceTextKeyboardClose} />)
            }
            case 'text': {
                return (<Input defaultValue={valueFilter?.[optionFilterReal['value']] || ''} onChangeText={antidebounceTextKeyboardClose} />)
            }
            default: {
                return null
            }
        }

    }



    return Platform.OS == 'android' ? (
        <View className="flex-1 bg-white rounded-lg w-full relative mb-44">
            <View className={classNames('flex-row items-center justify-between p-2 border-b border-slate-100', Platform.OS == 'android' ? 'w-80' : 'w-96')}>
                <Text className="text-lg">FILTER DATA</Text>
                <Text className="text-lg" onPress={() => setModalVisible(false)}>CLOSE</Text>
            </View>

            <View className="mt-2 p-2 ">
                <RenderFiendTargetFilter />
            </View>

            <View className="mt-2 p-2">
                <RenderOptionsFilter targetFieldReal={targetFieldReal} optionFilter={optionFilter} />
            </View>

            <View className="mt-2 p-2">
                <RenderValueFilter targetFieldReal={targetFieldReal} optionFilterReal={optionFilterReal} />
            </View>



            <View className="w-full mt-4 mb-2">
                {!!targetFieldReal && !!valueFilter && !!optionFilterReal && (<TouchableOpacity onPress={onApplyNewFilter} className=" bg-blue-700 items-center justify-center mx-4 rounded p-2">
                    <Text className=" text-white">TAMBAH FILTER DATA</Text>
                </TouchableOpacity>)}
            </View>
        </View>
    ) : (
        <View className="flex-1 bg-white rounded-lg w-full relative">
            <View className={classNames('flex-row items-center justify-between p-2 border-b border-slate-100', Platform.OS == 'android' ? 'w-80' : 'w-96')}>
                <Text className="text-lg">FILTER DATA</Text>
                <Text className="text-lg" onPress={() => setModalVisible(false)}>CLOSE</Text>
            </View>

            <View className="mt-2 p-2 ">
                <RenderFiendTargetFilter />
            </View>

            <View className="mt-2 p-2">
                <RenderOptionsFilter targetFieldReal={targetFieldReal} optionFilter={optionFilter} />
            </View>

            <View className="mt-2 p-2">
                <RenderValueFilter targetFieldReal={targetFieldReal} optionFilterReal={optionFilterReal} />
            </View>



            <View className="w-full mt-4 mb-2">
                {!!targetFieldReal && !!valueFilter && !!optionFilterReal && (<TouchableOpacity onPress={onApplyNewFilter} className=" bg-blue-700 items-center justify-center mx-4 rounded p-2">
                    <Text className=" text-white">TAMBAH FILTER DATA</Text>
                </TouchableOpacity>)}
            </View>
        </View>)
}
