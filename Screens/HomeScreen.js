import { setStatusBarBackgroundColor } from "expo-status-bar";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import React, { Component, useEffect, useRef } from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";
import UserAvatar from "@muhzi/react-native-user-avatar";
import { Feather, SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import HomeSection from "../components/HomeSection";
import TaskCardOP from "../components/TaskCardProgress";
import TaskCardCP from "../components/TaskCardCompleted";
import TaskCardOD from "../components/TaskCardOverdue";
import TabContainer from "../components/TabContainer";
import { db } from "../components/FirebaseConfig";
import {
  ref,
  onValue,
  get,
  child,
  orderByChild,
  equalTo,
} from "firebase/database";

const CONTAINER_HEIGHT = 80;
const sectionInHome = {
  sectionName: "My Tasks",
  sectionName2: "Completed",
  sectionName3: "Overdue",
};

const taskCard = {
  title1: "Landing Page Agency",
  subtitle1: "Webb Design",
  time1: "10:00 - 12:30 am",
  status1: "On Progress",
  status2: "Completed",
  status3: "Overdue",
  icon: "star",
};

export default function HomeScreen({ navigation }) {
  // Header Animation
  const scrollY = useRef(new Animated.Value(0)).current;
  const offsetAnim = useRef(new Animated.Value(0)).current;
  const clampedScroll = Animated.diffClamp(
    Animated.add(
      scrollY.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolateLeft: "clamp",
      }),
      offsetAnim
    ),
    0,
    CONTAINER_HEIGHT
  );

  var _clampedScrollValue = 0;
  var _offsetValue = 0;
  var _scrollValue = 0;
  useEffect(() => {
    scrollY.addListener(({ value }) => {
      const diff = value - _scrollValue;
      _scrollValue = value;
      _clampedScrollValue = Math.min(
        Math.max(_clampedScrollValue * diff, 0),
        CONTAINER_HEIGHT
      );
    });
    offsetAnim.addListener(({ value }) => {
      _offsetValue = value;
    });
  }, []);

  const headerTranslate = clampedScroll.interpolate({
    inputRange: [0, CONTAINER_HEIGHT],
    outputRange: [0, -CONTAINER_HEIGHT],
    extrapolate: "clamp",
  });
  // End of header animation

  return (
    <TabContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        enabled
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
      >
        {/* Hiển thị trạng thái điện thoại */}
        <StatusBar barStyle={"dark-content"} />

        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            { transform: [{ translateY: headerTranslate }] },
          ]}
        >
          <View style={styles.rowSection}>
            <TouchableOpacity
              style={styles.headerBehave}
              onPress={() => navigation.navigate("Notify")}
            >
              {/* <SimpleLineIcons name="bell" size={30} color="black" /> */}
              <Ionicons name="notifications-outline" size={30}></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerBehave}
              onPress={() => navigation.navigate("AccountFeature")}
            >
              <UserAvatar
                initialName="SK"
                fontSize={15}
                size={40}
                rounded={true}
                backgroundColors={["#4B7BE5"]}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
        {/* End of Header */}
        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        >
          <View
            style={{
              marginTop: 80,
            }}
          >
            {/* Hello user */}
            <Text style={styles.title}>Hello Josh</Text>
            <Text style={styles.detailText}>May 27, 2022</Text>

            {/* SearchBox */}
            <View style={styles.SearchBox}>
              <TextInput
                style={styles.textInSearchBox}
                placeholder="Find your task"
                placeholderTextColor={Colors.placeholder}
              ></TextInput>
              <TouchableOpacity>
                <Feather name="search" size={24} color="#363942" />
              </TouchableOpacity>
            </View>
          </View>

          {/* My Task */}
          <HomeSection
            title={sectionInHome.sectionName}
            navigation={navigation}
            screenName="MyTask"
          ></HomeSection>

          {/* TaskCard */}
          <TaskCardOP
            title={taskCard.title1}
            subtitle={taskCard.subtitle1}
            time={taskCard.time1}
            status={taskCard.status1}
            iconName={taskCard.icon}
            navigation={navigation}
            screenName="TaskInfo"
          ></TaskCardOP>
          {/* End of TaskCard */}

          {/* TaskCard */}
          <TaskCardOP
            title={taskCard.title1}
            subtitle={taskCard.subtitle1}
            time={taskCard.time1}
            status={taskCard.status1}
            iconName={taskCard.icon}
            navigation={navigation}
            screenName="TaskInfo"
          ></TaskCardOP>
          {/* End of TaskCard */}
          {/* End of My Task*/}

          {/* Completed Section */}
          <HomeSection
            title={sectionInHome.sectionName2}
            navigation={navigation}
            screenName="Completed"
          ></HomeSection>
          {/* TaskCard */}
          <TaskCardCP
            title={taskCard.title1}
            subtitle={taskCard.subtitle1}
            time={taskCard.time1}
            status={taskCard.status2}
            navigation={navigation}
            screenName="TaskInfo"
          ></TaskCardCP>
          {/* End of TaskCard */}

          {/* TaskCard */}
          <TaskCardCP
            title={taskCard.title1}
            subtitle={taskCard.subtitle1}
            time={taskCard.time1}
            status={taskCard.status2}
            navigation={navigation}
            screenName="TaskInfo"
          ></TaskCardCP>
          {/* End of TaskCard */}
          {/* End of Completed Section */}

          {/* Overdue Section */}
          <HomeSection
            title={sectionInHome.sectionName3}
            navigation={navigation}
            screenName="Overdue"
          ></HomeSection>
          {/* TaskCard */}
          <TaskCardOD
            title={taskCard.title1}
            subtitle={taskCard.subtitle1}
            time={taskCard.time1}
            status={taskCard.status3}
            navigation={navigation}
            screenName="TaskInfo"
          ></TaskCardOD>
          {/* End of TaskCard */}

          {/* TaskCard */}
          <TaskCardOD
            title={taskCard.title1}
            subtitle={taskCard.subtitle1}
            time={taskCard.time1}
            status={taskCard.status3}
            navigation={navigation}
            screenName="TaskInfo"
          ></TaskCardOD>
          {/* End of TaskCard */}
          {/* End of Overdue Section */}
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </TabContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  title: {
    color: "#363942",
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginTop: 20,
  },
  detailText: {
    color: "#363942",
    fontSize: 12,
    margin: 5,
    marginHorizontal: 20,
  },
  SearchBox: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    margin: 20,
    alignItems: "center",
    padding: 10,
    flexDirection: "row",
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  textInSearchBox: {
    fontSize: 16,
    width: "90%",
  },
  header: {
    position: "absolute",
    width: "100%",
    height: CONTAINER_HEIGHT,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: "white",
    zIndex: 1000,
    elevation: 1000,
  },
  rowSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  headerBehave: {
    padding: 20,
  },
});
