import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const PopupModal = ({ navigation, visible, type, title, message, onClose }) => {
  // Định nghĩa các kiểu thông báo và màu sắc tương ứng
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      
    },
    modalContainer: {
      backgroundColor: "#fff",
      borderRadius: 10,
      width: "85%",
      height: "15%",
      padding: 20,
      alignItems: "center",
      justifyContent: "space-around",
      shadowColor: "gray",
      shadowOpacity: 0.5,
      shadowOffset: {
        width: 2,
        height: 2,
      },
    },
    successText: {
      //    fontFamily: "lexend-medium",
      fontSize: 18,
      fontWeight: "bold",
      color: "#4B7BE5",
      fontWeight: "bold",
      marginBottom: 8,
      textAlign: "center",
      shadowColor: "gray",
      shadowOpacity: 0.5,
      shadowOffset: {
        width: 2,
        height: 2,
      },
    },
    warningText: {
      color: "orange",
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
    },
    errorText: {
      color: "red",
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
      textAlign: "center",
      shadowColor: "gray",
      shadowOpacity: 0.5,
      shadowOffset: {
        width: 2,
        height: 2,
      },
    },
    closeButton: {
      marginTop: 16,
      paddingTop: 10,
      paddingBottom: 10,
      paddingRight: 30,
      paddingLeft: 30,
      borderRadius: 4,
      backgroundColor: "#eee",
      shadowColor: "gray",
      shadowOpacity: 0.5,
      shadowOffset: {
        width: 2,
        height: 2,
      },
    },
    closeButtonText: {
      //   fontFamily: "lexend-medium",
      fontSize: 16,
      fontWeight: "bold",
      shadowColor: "gray",
      textAlign: "center",
      shadowOpacity: 0.5,
      shadowOffset: {
        width: 2,
        height: 2,
      },
    },
    textMess: {
      //    fontFamily: "lexend-medium",
      fontSize: 12,
      fontWeight: "bold",
      textAlign: "center",
    },
  });

  // Chọn màu sắc và văn bản dựa trên kiểu thông báo
  let textColor = "";
  let textStyle = "";
  switch (type) {
    case "success":
      textColor = styles.successText;
      textStyle = styles.successTextStyle;
      break;
    case "warning":
      textColor = styles.warningText;
      textStyle = styles.warningTextStyle;
      break;
    case "error":
      textColor = styles.errorText;
      textStyle = styles.errorTextStyle;
      break;
    default:
      textColor = styles.errorText;
      textStyle = styles.errorTextStyle;
      break;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          <Text style={[textColor, textStyle]}>{title}</Text>
          <Text style={styles.textMess}>{message}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text
              style={styles.closeButtonText}
              // onPress={()=> navigation.navigate("HomeScreen")}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PopupModal;
