// import {ref, onValue} from "firebase/database";
// import { db } from "../components/FirebaseConfig";
import { useNavigation } from '@react-navigation/native';
import React, { Component} from "react";
import { ToastAndroid } from "react-native";
const navigation = useNavigation();

const LoginFunction = (userName, password) => {
    if (userName === "admin" && password === "1") {
        ToastAndroid.show("Login Successfully!", ToastAndroid.SHORT);
        navigation.navigate('HomeNavigator');
    }
    else {
        ToastAndroid.show("Invalid UserName or Password!", ToastAndroid.SHORT);
    }

}

export {LoginFunction}

// npm install @react-native-community/datetimepicker --save
// npx expo install @react-native-community/datetimepicker@6.2.0