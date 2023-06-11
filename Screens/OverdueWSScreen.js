import { Text, StyleSheet, View, KeyboardAvoidingView } from "react-native";
import React, { Component, useEffect } from "react";
import { StatusBar, Animated } from "react-native";
import Header from "../components/HeaderWithTextAndAvatar";
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { TextInput } from "react-native";
import { Feather, FontAwesome, SimpleLineIcons } from "@expo/vector-icons";
import { Colors } from "react-native/Libraries/NewAppScreen";
import HomeSection from "../components/HomeSection";
import TaskCard from "../components/TaskCardOverdue";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef } from "react";

import UserAvatar from "@muhzi/react-native-user-avatar";
const Progress = ({ step, steps, height }) => {
  const [width, setWidth] = React.useState(0);
  const animatedValue = React.useRef(new Animated.Value(-1000)).current;
  const reactive = React.useRef(new Animated.Value(-1000)).current;
  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: reactive,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);
  React.useEffect(() => {
    //-width + width * step/steps
    reactive.setValue(-width + (width * step) / steps);
  }, [step, width]);
  return (
    <>
      <Text
        style={{
          // fontFamily: "Menlo",
          marginHorizontal: 20,
          fontSize: 12,
          fontWeight: "500",
          marginVertical: 8,
        }}
      >
        {step}/{steps}
      </Text>
      <View
        onLayout={(e) => {
          const newWidth = e.nativeEvent.layout.width;
          setWidth(newWidth);
        }}
        style={{
          height,
          backgroundColor: "rgba(0,0,0,0.1)",
          borderRadius: height,
          overflow: "hidden",
          marginHorizontal: 20,
        }}
      >
        <Animated.View
          style={{
            height,
            width: "100%",
            borderRadius: height,
            backgroundColor: "#4B7BE5",
            position: "absolute",
            left: 0,
            top: 0,
            transform: [
              {
                translateX: animatedValue,
              },
            ],
          }}
        />
      </View>
    </>
  );
};
const CONTAINER_HEIGHT = 80;
const projectCard = {
  title1: "Landing Page Agency",
  subtitle1: "Webb Design",
  time1: "10:00 - 12:30 am",
  status1: "On Progress",
  icon: "user-circle",
};
export default function OverdueWSSreen() {
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
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index + 1) % (10 + 1));
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [index]);
  return (
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
          <TouchableOpacity style={styles.headerBehave}>
            <SimpleLineIcons name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBehave}>
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
        <View style={{ marginTop: 80 }}>
          {/* Hello user */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.title}>Web Design</Text>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={30}
                color="black"
                style={{ marginHorizontal: 20, marginTop: 20 }}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.detailText}>created in 20/03/2023</Text>
          {/* Progress Bar */}
          <Progress step={5} steps={10} height={20} />
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
        <View style={styles.contentName}>
          <Text style={{ fontSize: 20, fontWeight: 600 }}>Overdue</Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "gray",
              marginHorizontal: 6,
            }}
          >
            3
          </Text>
          <TouchableOpacity>
            <FontAwesome name="sort" size={20} color="black" />
          </TouchableOpacity>
        </View>
        {/* TaskCard */}
        <TaskCard
          title={projectCard.title1}
          subtitle={projectCard.subtitle1}
          time={projectCard.time1}
          status={projectCard.status1}
          iconName={projectCard.icon}
        ></TaskCard>
        {/* End of TaskCard */}
        {/* TaskCard */}
        <TaskCard
          title={projectCard.title1}
          subtitle={projectCard.subtitle1}
          time={projectCard.time1}
          status={projectCard.status1}
          iconName={projectCard.icon}
        ></TaskCard>
        {/* End of TaskCard */}
        {/* TaskCard */}
        <TaskCard
          title={projectCard.title1}
          subtitle={projectCard.subtitle1}
          time={projectCard.time1}
          status={projectCard.status1}
          iconName={projectCard.icon}
        ></TaskCard>
        {/* End of TaskCard */}
        {/* TaskCard */}
        <TaskCard
          title={projectCard.title1}
          subtitle={projectCard.subtitle1}
          time={projectCard.time1}
          status={projectCard.status1}
          iconName={projectCard.icon}
        ></TaskCard>
        {/* End of TaskCard */}
        {/* End of My Task */}
      </Animated.ScrollView>
    </KeyboardAvoidingView>
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
  contentName: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
});
