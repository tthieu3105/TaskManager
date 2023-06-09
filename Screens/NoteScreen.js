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
  ActivityIndicator,
} from "react-native";
import React, { Component, useEffect, useRef } from "react";
import { useContext, useState } from "react";
import { UserContext, UserProvider } from "../contextObject";
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
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../components/FirestoreConfig";
const CONTAINER_HEIGHT = 80;

export default function NoteScreen({ navigation }) {
  const { userId } = useContext(UserContext);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");

  const getNameAvatar = async () => {
    const docRef = doc(db, "User", userId.toString());
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const fullName = docSnap.data().Name;
      const nameArray = fullName.split(" ");
      const lastName = nameArray[nameArray.length - 1];
      setUserName(lastName);

      let avatarUrl = docSnap.data().Avatar;
      if (avatarUrl == "") {
        const initials = fullName
          .split(" ")
          .map((name) => name.charAt(0))
          .join("");
        avatarUrl = `https://ui-avatars.com/api/?name=${fullName}&background=random&size=25`;
      }

      setUserAvatar(avatarUrl);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      setUserName("John");
    }
  };

  useEffect(() => {
    getNameAvatar();
  }, []);

  const [isLoading, setIsLoading] = useState(true); // Add a state for loading indicator
  const formatDateUS = () => {
    const date = new Date();
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  };
  const currentDate = formatDateUS(new Date());
  console.log('current date: ', currentDate);
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

  //Lấy danh sách note đã có trên FireStore
  const notesCollection = collection(db, "Note");
  const [noteList, setnoteList] = useState([]);
  const [count, setCount] = useState(0);
  var d = 0;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(notesCollection);
        const notes = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.CreatorID == userId) {
            d++;
            const timestamp = data.CreateAt;
            const seconds = timestamp.seconds;
            const date = new Date(seconds * 1000); // Chuyển đổi thành đối tượng Date
            const formattedDate = formatDate(date); // Định dạng ngày tháng
            notes.push({ ...data, CreateAt: formattedDate });
          }
        });
        setnoteList(notes);
        setCount(d);
        setIsLoading(false);
      } catch (error) {
        console.error("Lỗi lấy ds note: ", error);
      }

    };
    fetchData();
  }, []);
  const formatDate = (date) => {
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // Tìm kiếm
  const [searchText, setSearchText] = useState('');
  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };
  const filteredNotes = noteList.filter((note) => {
    const { Title, Description } = note;
    const searchTextLowercase = searchText.toLowerCase();
    return (
      Title.toLowerCase().includes(searchTextLowercase) ||
      Description.toLowerCase().includes(searchTextLowercase)
    );
  });//jjjj

  console.log(count);
  // Render danh sách note
  const rendernoteList = () => {
    return filteredNotes.map((note) => (
      <NoteCard
        title={note.Title}
        content={note.Description}
        date={note.CreateAt}
        navigation={navigation}
        screenName="NoteInfo"
        id={note.NodeID}
      />
    ));
  };
  // 
  // const rendernoteList = () => {
  //   return noteList.map((note) => (
  //     <NoteCard
  //       title={note.Title}
  //       content={note.Description}
  //       date={note.CreateAt}
  //       navigation={navigation}
  //       screenName="NoteInfo"
  //       id = {note.NodeID}

  //     />
  //   ));
  // };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
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
                size={40}
                active
                src={userAvatar}
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
            <Text style={styles.title}>Hello {userName}</Text>
            <Text style={styles.detailText}>{currentDate}</Text>

            {/* SearchBox */}
            <View style={styles.SearchBox}>
              <TextInput
                style={styles.textInSearchBox}
                placeholder="Find your note"
                placeholderTextColor={Colors.placeholder}
                value={searchText}
                onChangeText={handleSearchTextChange}
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
                {count}
              </Text>
              <TouchableOpacity>
                <FontAwesome name="sort" size={20} color="black" />
              </TouchableOpacity>
            </View>
            {rendernoteList()}
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
