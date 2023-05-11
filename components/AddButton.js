import React from "react";
import {
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Animated,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";

// const AddButton = (opened, toggleOpened) => {
const AddButton = ({ navigation }) => {
  const [opened, setOpened] = React.useState(false);
  const animation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: opened ? 1 : 0,
      duration: 300,
      friction: 2,
      useNativeDriver: false,
    }).start();
  }, [opened, animation]);

  const opacity = {
    opacity: animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0, 1],
    }),
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        {/* Button AddNote */}
        <TouchableOpacity onPress={() => navigation.navigate("NewNote")}>
          <Animated.View
            style={[
              styles.item,
              opacity,
              {
                transform: [
                  {
                    translateX: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -60],
                    }),
                  },
                  {
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -50],
                    }),
                  },
                ],
              },
            ]}
          >
            <MaterialCommunityIcons
              name="note-edit-outline"
              size={32}
              style={styles.itemIcon}
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Button AddTask */}
        <TouchableOpacity onPress={() => navigation.navigate("NewTask")}>
          <Animated.View
            style={[
              styles.item,
              opacity,
              {
                transform: [
                  {
                    translateX: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 60],
                    }),
                  },
                  {
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -50],
                    }),
                  },
                ],
              },
            ]}
          >
            <MaterialIcons name="add-task" size={32} style={styles.itemIcon} />
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setOpened(!opened)}
          style={styles.addButton}
        >
          <Animated.View
            style={[
              styles.addButtonInner,
              {
                transform: [
                  {
                    rotate: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "45deg"],
                    }),
                  },
                ],
              },
            ]}
          >
            <AntDesign name="plus" size={35} style={styles.addButtonIcon} />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    height: 0,
  },
  addButton: {
    shadowColor: "gray",
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  addButtonInner: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BDD8F1",
    with: 60,
    height: 60,
    borderRadius: 30,
    borderColor: "#375A7F",
    borderWidth: 2.5,
  },

  addButtonIcon: {
    marginHorizontal: "auto",
    marginVertical: "auto",
    // width: 40,
    // height: 40,
  },

  box: {
    position: "relative",
    width: 60,
    height: 60,
    marginTop: -10,
  },

  item: {
    position: "absolute",
    top: 5,
    left: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BDD8F1",
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: "#375A7F",
    borderWidth: 2.5,
  },

  itemIcon: {
    width: 32,
    height: 32,
  },
});

export default AddButton;
