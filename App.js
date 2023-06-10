import React, { Component } from "react";
import AppContainer from "./Navigation/AppNavigator";
import AppNavigator from "./Navigation/AppNavigator";
import { UserProvider } from "./contextObject";

export default function App() {
  return (
    <UserProvider>
      <AppNavigator></AppNavigator>
    </UserProvider>
  );
}
