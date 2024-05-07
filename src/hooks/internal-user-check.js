import React, { useState, useEffect } from 'react'
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect, router } from 'expo-router';


const InternalUserCheck = () => {
    const [user, setUser] = useState(null);
    

    const reChekingUser = async () => {
        try {
            const jsonValue = await SecureStore.getItemAsync(process.env.EXPO_PUBLIC_ASYNC_STORAGE_NAME);
            const restoredUser = jsonValue != null ? JSON.parse(jsonValue) : null;
            if (!restoredUser) {
                router.replace('/error/internal-user-not-match');
            } else {
                setUser(restoredUser);
            }
        } catch (e) {
            console.error(e);
            router.replace('/error/internal-user-not-match');
        }
    };


    useFocusEffect(() => {
        reChekingUser();
    })

    return { user, setUser }
}



export default InternalUserCheck