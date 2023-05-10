import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Dimensions,
  Modal,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import LoginScreen from "../Screens/LoginScreen.js";
import CreateAccScreen from "../Screens/CreateAccScreen.js";
import AddEmailVerify from "../Screens/AddEmailVerify.js";
import EnterVerifyCode from "../Screens/EnterVerifyCode.js";
import AddNoteScreen from "../Screens/AddNoteScreen.js";
import CalendarScreen from "../Screens/CalendarScreen.js";
import AccountFeature from "../Screens/AccountFeature.js";
import EditProfile from "../Screens/EditProfile.js";
import NoteInfoScreen from "../Screens/NoteInfoScreen.js";
import WorkSpaceScreen from "../Screens/WorkSpaceScreen.js";
import HomeScreen from "../Screens/HomeScreen.js";
import NoteScreen from "../Screens/NoteScreen.js";
//import CreateTaskScreen from "../Screens/CreateTaskScreen.js";
import NotifyScreen from "../Screens/NotifyScreen.js";
import TaskInfoScreen from "../Screens/TaskInfoScreen.js";
// import EditTaskScreen from "../Screens/EditTaskScreen.js";
import EditNoteScreen from "../Screens/EditNoteScreen.js";
import ProjectScreen from "../Screens/ProjectScreen.js";
import NewTaskNote from "../Screens/NewTaskNote.js";

import { tabContextProvider, useTabMenu } from "../context/tabContext.js";
import AddButton from "../components/AddButton.js";
import { Colors } from "react-native/Libraries/NewAppScreen";

//updating

const Stack = createStackNavigator();

const HomeStack = createStackNavigator();
function HomeScreenStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Notify" component={NotifyScreen} />
      <HomeStack.Screen name="AccountFeature" component={AccountFeature} />
      <HomeStack.Screen name="EditProfile" component={EditProfile} />
      <HomeStack.Screen name="NewNote" component={AddNoteScreen} />
      {/* <HomeStack.Screen name="NewTask" component={CreateTaskScreen} /> */}
    </HomeStack.Navigator>
  );
}

const CalendarStack = createStackNavigator();
function CalendarScreenStackNavigator() {
  return (
    <CalendarStack.Navigator screenOptions={{ headerShown: false }}>
      <CalendarStack.Screen name="Calendar" component={CalendarScreen} />
      <CalendarStack.Screen name="TaskInfo" component={TaskInfoScreen} />
      {/* <CalendarStack.Screen name="TaskEdit" component={EditTaskScreen} /> */}
    </CalendarStack.Navigator>
  );
}

// const CreateTaskStack = createStackNavigator();
// function CreateTaskScreenStackNavigator() {
//   return (
//     <CreateTaskStack.Navigator screenOptions={{ headerShown: false }}>
//       <CreateTaskStack.Screen name="AddTask" component={CreateTaskScreen} />
//     </CreateTaskStack.Navigator>
//   );
// }

const AddNoteStack = createStackNavigator();
function AddNoteScreenStackNavigator() {
  return (
    <AddNoteStack.Navigator screenOptions={{ headerShown: false }}>
      <AddNoteStack.Screen name="AddNote" component={AddNoteScreen} />
    </AddNoteStack.Navigator>
  );
}

const NoteScreenStack = createStackNavigator();
function NoteScreenStackNavigator() {
  return (
    <NoteScreenStack.Navigator screenOptions={{ headerShown: false }}>
      <NoteScreenStack.Screen name="NoteScreen" component={NoteScreen} />
      <NoteScreenStack.Screen name="Notify" component={NotifyScreen} />
      <NoteScreenStack.Screen name="NoteInfo" component={NoteInfoScreen} />
      <NoteScreenStack.Screen name="EditNote" component={EditNoteScreen} />
    </NoteScreenStack.Navigator>
  );
}

const WorkSpaceScreenStack = createStackNavigator();
function WorkSpaceScreenStackNavigator() {
  return (
    <WorkSpaceScreenStack.Navigator screenOptions={{ headerShown: false }}>
      <WorkSpaceScreenStack.Screen
        name="Workspace"
        component={WorkSpaceScreen}
      />
      <WorkSpaceScreenStack.Screen name="Notify" component={NotifyScreen} />
      <WorkSpaceScreenStack.Screen
        name="AccountFeature"
        component={AccountFeature}
      />
      <WorkSpaceScreenStack.Screen name="EditProfile" component={EditProfile} />
      <WorkSpaceScreenStack.Screen name="Projects" component={ProjectScreen} />
      <WorkSpaceScreenStack.Screen name="Tasks" component={TaskInfoScreen} />
      {/* <WorkSpaceScreenStack.Screen name="TaskEdit" component={EditTaskScreen} /> */}
    </WorkSpaceScreenStack.Navigator>
  );
}

const NewTaskNoteScreenStack = createStackNavigator();
function NewTaskNoteScreenStackNavigator() {
  return (
    <NewTaskNoteScreenStack.Navigator screenOptions={{ headerShown: false }}>
      {/* <NewTaskNoteScreenStack.Screen name="NewTask" component={CreateTaskScreen} /> */}
      <NewTaskNoteScreenStack.Screen name="NewNote" component={AddNoteScreen} />
    </NewTaskNoteScreenStack.Navigator>
  );
}

const getIconColor = (focused) => ({
  tintColor: focused ? Colors.primary : Colors.dark,
});

const Tab = createBottomTabNavigator();
function TabNavigator() {
  const { opened, toggleOpened } = useTabMenu();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: [
          {
            position: "relative",
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
            shadowColor: "gray",
            backgroundColor: "white",
            height: 85,
            // height: Dimensions.get("window").height * 0.1,
            ...styles.shadow,
          },
          null,
        ],
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreenStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "center",
                marginBottom: 5,
                marginTop: 7,
              }}
            >
              {focused && (
                <Feather
                  name="home"
                  size={28}
                  color="#4B7BE5"
                  resizeMode="contain"
                  style={[styles.tabIcon2, getIconColor(focused)]}
                />
              )}
              {!focused && (
                <Feather
                  name="home"
                  size={24}
                  color="black"
                  resizeMode="contain"
                  style={[styles.tabIcon, getIconColor(focused)]}
                />
              )}
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => opened && e.preventDefault(),
        }}
      />
      <Tab.Screen
        name="CalendarTab"
        component={CalendarScreenStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "center",
                marginBottom: 5,
                marginTop: 7,
              }}
            >
              {focused && (
                <Feather
                  name="calendar"
                  size={28}
                  color="#4B7BE5"
                  resizeMode="contain"
                  style={styles.tabIcon2}
                />
              )}
              {!focused && (
                <Feather
                  name="calendar"
                  size={24}
                  color="black"
                  resizeMode="contain"
                  style={styles.tabIcon}
                />
              )}
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => opened && e.preventDefault(),
        }}
      />

      <Tab.Screen
        name="NewTab"
        component={NewTaskNoteScreenStackNavigator}
        options={({ navigation }) => ({
          tabBarButton: ({ focused }) => (
            <AddButton
              navigation={navigation}
              opened={opened}
              toggleOpened={toggleOpened}
            ></AddButton>
          ),
        })}
      />

      <Tab.Screen
        name="NoteTab"
        component={NoteScreenStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "center",
                marginBottom: 5,
                marginTop: 7,
              }}
            >
              {focused && (
                <FontAwesome
                  name="sticky-note-o"
                  size={28}
                  color="#4B7BE5"
                  resizeMode="contain"
                  style={styles.tabIcon2}
                />
              )}
              {!focused && (
                <FontAwesome
                  name="sticky-note-o"
                  size={24}
                  color="black"
                  resizeMode="contain"
                  style={styles.tabIcon}
                />
              )}
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => opened && e.preventDefault(),
        }}
      />
      <Tab.Screen
        name="WorkspaceTab"
        component={WorkSpaceScreenStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "center",
                marginBottom: 5,
                marginTop: 7,
              }}
            >
              {focused && (
                <MaterialIcons
                  name="workspaces-outline"
                  size={28}
                  color="#4B7BE5"
                  resizeMode="contain"
                  style={styles.tabIcon2}
                />
              )}
              {!focused && (
                <MaterialIcons
                  name="workspaces-outline"
                  size={24}
                  color="black"
                  resizeMode="contain"
                  style={styles.tabIcon}
                />
              )}
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => opened && e.preventDefault(),
        }}
      />
    </Tab.Navigator>
  );
}
export default TabNavigator;

const styles = StyleSheet.create({
  tabIcon: {
    width: 24,
    height: 24,
  },

  tabIcon2: {
    width: 28,
    height: 28,
  },

  shadow: {
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },

  Box: {
    backgroundColor: "#F5F5F5",
    // marginVertical: 10,
    // marginHorizontal: "auto",
    alignItems: "center",
    height: 100,
    marginTop: 250,
    borderRadius: 10,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    marginHorizontal: 15,
  },

  button: {
    // bordercolor: "white",
    backgroundColor: "#4B7BE5",
    marginTop: 15,
    height: 50,
    borderRadius: 10,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    marginHorizontal: 15,
    marginBottom: 0,
  },

  smallTitle: {
    marginLeft: "auto",
    marginRight: "auto",
    color: "#363942",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,

    // fontStyle
  },
});
