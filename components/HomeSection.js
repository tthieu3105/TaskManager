import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { Component } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Feather } from "@expo/vector-icons";
import TaskCard from "./TaskCardProgress";

export default class HomeSection extends Component {
  handlePress = () => {
    const { screenName, navigation } = this.props;
    navigation.navigate(screenName);
  };
  render() {
    return (
      <View>
        {/* Section task */}

        <View style={styles.rowSection}>
          {/* My task */}
          <Text style={styles.titleSection}>{this.props.title}</Text>
          <TouchableOpacity onPress={this.handlePress}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* End of Section Task*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleSection: {
    color: "#363942",
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 20,
  },
  rowSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  viewAll: {
    color: "gray",
    fontSize: 14,
    marginHorizontal: 20,
    margin: 5,
  },
});
