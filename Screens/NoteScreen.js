import {
  Text,
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  KeyboardAvoidingView,
} from "react-native";
import React, { Component, useEffect, useRef } from "react";
import Header from "../components/HeaderWithTextAndAvatar";
import {
  Feather,
  FontAwesome,
  SimpleLineIcons,
  Ionicons,
} from "@expo/vector-icons";
import { Colors } from "react-native/Libraries/NewAppScreen";
import NoteCard from "../components/NoteCard";
import UserAvatar from "@muhzi/react-native-user-avatar";
import TabContainer from "../components/TabContainer";
const CONTAINER_HEIGHT = 80;
const noteCard = {
  tileName: "Landing Page Agency Creative",
  contentCard:
    "Lorem ipsum dolor sit amet consectetur. Velit ut arcu fames quis viverra ",
  dateCard: "February 9",
};
export default function NoteScreen({ navigation }) {
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
                placeholder="Find your note"
                placeholderTextColor={Colors.placeholder}
              ></TextInput>
              <TouchableOpacity>
                <Feather name="search" size={24} color="#363942" />
              </TouchableOpacity>
            </View>
            {/* End of SearchBox */}
            <View style={styles.contentName}>
              <Text style={{ fontSize: 20, fontWeight: "600" }}>My notes</Text>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "600",
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
            <NoteCard
              title={noteCard.tileName}
              content={noteCard.contentCard}
              date={noteCard.dateCard}
            ></NoteCard>
            <NoteCard
              title={noteCard.tileName}
              content={noteCard.contentCard}
              date={noteCard.dateCard}
            ></NoteCard>
            <NoteCard
              title={noteCard.tileName}
              content={noteCard.contentCard}
              date={noteCard.dateCard}
            ></NoteCard>
            <NoteCard
              title={noteCard.tileName}
              content={noteCard.contentCard}
              date={noteCard.dateCard}
            ></NoteCard>
            <NoteCard
              title={noteCard.tileName}
              content={noteCard.contentCard}
              date={noteCard.dateCard}
            ></NoteCard>
          </View>
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
    // height: 50,
    borderRadius: 10,
    margin: 20,
    alignItems: "center",
    padding: 10,
    flexDirection: "row",
    // width: "90%",
  },
  textInSearchBox: {
    fontSize: 16,
    width: "90%",
  },
  content: {
    marginHorizontal: 20,
  },
  contentName: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
  header: {
    position: "absolute",
    width: "100%",
    height: 80,
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
