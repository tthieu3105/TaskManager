import {
  Text,
  StyleSheet,
  View,
  Animated,
  KeyboardAvoidingView,
} from "react-native";
import React, { Component, useEffect, useRef } from "react";
import { TouchableOpacity } from "react-native";
import NotifyCard from "../components/NotifyCard";
import { ScrollView } from "react-native";
import { StatusBar } from "react-native";
const CONTAINER_HEIGHT = 80;
const notifyInfo = {
  name: "name of task",
  date: "Mar 10",
  project: "name of project",
  due: "March 12, 2023",
};
export default function NotifyScreen({ navigation }) {
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      enabled
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
    >
      <StatusBar barStyle={"dark-content"} />
      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslate }] },
        ]}
      >
        {/* Header */}
        <View style={styles.rowSection}>
          <TouchableOpacity style={styles.headerBehave}>
            <Text style={styles.textHeader}>Clear all</Text>
          </TouchableOpacity>
          <Text
            style={{
              color: "#363942",
              fontWeight: "bold",
              fontSize: 24,
            }}
          >
            All updates
          </Text>
          <TouchableOpacity
            style={styles.headerBehave}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.textHeader}>Done</Text>
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
        <View style={{ marginTop: CONTAINER_HEIGHT }}>
          {/* Notify Card */}
          <NotifyCard
            nameTask={notifyInfo.name}
            createDate={notifyInfo.date}
            projectName={notifyInfo.project}
            dueDate={notifyInfo.due}
          ></NotifyCard>
          {/* End of Notify Card */}

          {/* Notify Card */}
          <NotifyCard
            nameTask={notifyInfo.name}
            createDate={notifyInfo.date}
            projectName={notifyInfo.project}
            dueDate={notifyInfo.due}
          ></NotifyCard>
          {/* End of Notify Card */}
          {/* Notify Card */}
          <NotifyCard
            nameTask={notifyInfo.name}
            createDate={notifyInfo.date}
            projectName={notifyInfo.project}
            dueDate={notifyInfo.due}
          ></NotifyCard>
          {/* End of Notify Card */}
          {/* Notify Card */}
          <NotifyCard
            nameTask={notifyInfo.name}
            createDate={notifyInfo.date}
            projectName={notifyInfo.project}
            dueDate={notifyInfo.due}
          ></NotifyCard>
          {/* End of Notify Card */}
          {/* Notify Card */}
          <NotifyCard
            nameTask={notifyInfo.name}
            createDate={notifyInfo.date}
            projectName={notifyInfo.project}
            dueDate={notifyInfo.due}
          ></NotifyCard>
          {/* End of Notify Card */}
          {/* Notify Card */}
          <NotifyCard
            nameTask={notifyInfo.name}
            createDate={notifyInfo.date}
            projectName={notifyInfo.project}
            dueDate={notifyInfo.due}
          ></NotifyCard>
          {/* End of Notify Card */}
          {/* Notify Card */}
          <NotifyCard
            nameTask={notifyInfo.name}
            createDate={notifyInfo.date}
            projectName={notifyInfo.project}
            dueDate={notifyInfo.due}
          ></NotifyCard>
          {/* End of Notify Card */}
        </View>
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
    alignItems: "center",
    marginTop: 20,
  },
  headerBehave: {
    padding: 20,
  },
  textHeader: {
    color: "#3379E4",
    fontWeight: "500",
    fontSize: 18,
  },
});
