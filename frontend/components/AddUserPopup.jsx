import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddUserPopup = ({
  toggleModal,
  isModalVisible,
  setsubUsersArray,
  usernameVal,
  emailVal,
  phoneVal,
  editUserId,
  seteditUserDetails,
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  useEffect(() => {
    setUsername(usernameVal);
    setEmail(emailVal);
    setPhone(phoneVal);
  }, [usernameVal,emailVal,phoneVal]);

  const addSubUser = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (!accessToken) {
      navigation.navigate("Login");
    }
    if (!username.length || !email.length || !phone.length) return;

    const res = await fetch("http://localhost:3000/subuser/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        phone,
        accessToken,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setUsername("");
      setEmail("");
      setPhone("");
      toggleModal();
      setsubUsersArray((prevUsers) => {
        return [...prevUsers, { username, email, phone }];
      });
    }
  };

  const updateUser = async () => {
    if (!username.length || !email.length || !phone.length) return;

    const res = await fetch("http://localhost:3000/subuser/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        editUserId,
        username,
        email,
        phone,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setUsername("");
      setEmail("");
      setPhone("");
      toggleModal();
      setsubUsersArray((prevUsers) => {
        const newUsers = prevUsers.map(user => {
          if(user._id === editUserId){
            return {...user, username, email, phone}
          }
          return user
        })
        return newUsers
      });
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={toggleModal}
    >
      <View style={styles.modal}>
        <View style={styles.modalContent}>
          <View style={styles.inputDiv}>
            <Text style={styles.inputLabel}>Username: </Text>
            <TextInput
              style={styles.inputField}
              value={username}
              onChangeText={setUsername}
              placeholder="Username here"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputDiv}>
            <Text style={styles.inputLabel}>Email: </Text>
            <TextInput
              style={styles.inputField}
              value={email}
              onChangeText={setEmail}
              placeholder="Email here"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputDiv}>
            <Text style={styles.inputLabel}>Phone: </Text>
            <TextInput
              style={styles.inputField}
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone here"
              keyboardType="phone-pad"
            />
          </View>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable
              onPress={
                editUserId.length ? updateUser : addSubUser
              }
              style={{
                paddingVertical: 8,
                backgroundColor: "skyblue",
                width: 70,
                marginTop: 8,
              }}
            >
              <Text style={{ color: "black", textAlign: "center" }}>
                Submit
              </Text>
            </Pressable>

            <Pressable
              onPress={
                !editUserId.length
                  ? toggleModal
                  : () => {
                      seteditUserDetails({
                        usernameVal: "",
                        emailVal: "",
                        editUserId: "",
                        phoneVal: "",
                      });
                      toggleModal();
                    }
              }
              style={{
                paddingVertical: 8,
                backgroundColor: "black",
                width: 70,
                marginTop: 8,
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: "90%",
  },
  inputDiv: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 14,
  },
  inputField: {
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default AddUserPopup;
