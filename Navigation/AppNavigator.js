import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { TabContextProvider } from "../context/tabContext.js";
import TabNavigator from "../Navigation/TabNavigator.js";
import LoginScreen from "../Screens/LoginScreen.js";
import CreateAccScreen from "../Screens/CreateAccScreen.js";
import AddEmailVerify from "../Screens/AddEmailVerify.js";
import EnterVerifyCode from "../Screens/EnterVerifyCode.js";

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccScreen} />
      <Stack.Screen name="AddEmail" component={AddEmailVerify} />
      <Stack.Screen name="Verify" component={EnterVerifyCode} />
      <Stack.Screen name="HomeNavigator" component={TabNavigator} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <TabContextProvider>
      <NavigationContainer>
        <StackNavigator>
          <Stack.Navigator
            initialRouteName="Root"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Begin" component={StackNavigator} />
            <Stack.Screen name="Root" component={TabNavigator} />
          </Stack.Navigator>
        </StackNavigator>
      </NavigationContainer>
    </TabContextProvider>
  );
};

export default AppNavigator;
