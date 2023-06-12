import {
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { Component, useEffect, useRef, useState } from "react";
const deviceHeight = Dimensions.get("window").height;
export class BottomPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }
  show = () => {
    this.setState({ show: true });
  };

  close = () => {
    this.setState({ show: false });
  };
  renderOutsideTouchable(onTouch) {
    const view = <View style={{ flex: 1, width: "100%" }} />;
    if (!onTouch) return view;
    return (
      <TouchableWithoutFeedback
        onPress={onTouch}
        style={{ flex: 1, width: "100%" }}
      >
        {view}
      </TouchableWithoutFeedback>
    );
  }
  handlePressEdit = () => {
    const { screenName, navigation } = this.props;
    navigation.navigate(screenName);
  };
  renderEdit = () => {
    const { titleEdit } = this.props;
    return (
      <TouchableOpacity
        onPress={this.handlePressEdit}
        style={{
          backgroundColor: "#4B7BE5",
          height: 50,
          borderRadius: 10,
          shadowColor: "gray",
          shadowOpacity: 0.5,
          shadowOffset: {
            width: 2,
            height: 2,
          },
          marginHorizontal: 15,
          marginBottom: 20,
        }}
      >
        <Text style={styles.textInButton}>{titleEdit}</Text>
      </TouchableOpacity>
    );
  };
  renderDelete = () => {
    const { titleDelete } = this.props;
    return (
      <TouchableOpacity
        style={{
          backgroundColor: "#E7272D",
          height: 50,
          borderRadius: 10,
          shadowColor: "gray",
          shadowOpacity: 0.5,
          shadowOffset: {
            width: 2,
            height: 2,
          },
          marginHorizontal: 15,
          marginBottom: 20,
        }}
      >
        <Text style={styles.textInButton}>{titleDelete}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    let { show } = this.state;
    const { onTouchOutside, title } = this.props;
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={show}
        onRequestClose={this.close}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "000000AA",
            justifyContent: "flex-end",
          }}
        >
          {this.renderOutsideTouchable(onTouchOutside)}
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 20,
              maxHeight: deviceHeight * 0.3,
            }}
          >
            {this.renderEdit()}
            {this.renderDelete()}
          </View>
        </View>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  textInButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    // fontFamily: "Poppins",
    marginBottom: "auto",
    marginTop: "auto",
    marginLeft: "auto",
    marginRight: "auto",
  },

  button: {
    backgroundColor: "#4B7BE5",
    height: 50,
    borderRadius: 10,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    marginHorizontal: 15,
    marginBottom: 20,
  },
});
