import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import React, { Component } from "react";
import { Feather } from "@expo/vector-icons";

export default class NoteCard extends Component {
  render() {
    return (
      <View style={styles.noteCard}>
        {/* Note card */}
        <View style={styles.noteCardInfo}>
          {/* Dòng dầu tiên */}
          <TouchableOpacity>
            <View style={styles.firstRowNoteCard}>
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                {this.props.title}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "400",
                  color: "gray",
                  marginVertical: 5,
                }}
              >
                {this.props.content}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Đường kẻ */}
          <View style={styles.lineInNoteCard} />
          {/* Dòng thứ hai */}
          <TouchableOpacity>
            <View style={styles.secondRowNoteCard}>
              <Feather name="clock" size={24} color="#4B7BE5" />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "gray",
                  marginHorizontal: 5,
                }}
              >
                {this.props.date}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  noteCard: {
    marginTop: 5,
  },
  noteCardInfo: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    alignItems: "flex-start",
    padding: 10,
    shadowColor: "gray",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  firstRowNoteCard: {},
  lineInNoteCard: {
    marginVertical: 2,
    borderBottomColor: "gray",
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: "100%",
  },
  secondRowNoteCard: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
});
