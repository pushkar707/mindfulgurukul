import React, { useState, useEffect } from "react";
import { Pressable, View, Text, StyleSheet, Image, Modal } from "react-native";
import AddUserPopup from "../components/AddUserPopup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserCard from "../components/UserCard";
import SearchBar from "../components/SearchBar";

const Dashboard = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible((prevState) => !prevState);
  };

  const [subUsersArray, setsubUsersArray] = useState([]);
  const [searchResults, setSearchResults] = useState([])
  const [searchTerm, setSearchTerm] = useState('');
  const [editUserDetails, seteditUserDetails] = useState({
    usernameVal: "",
    emailVal: "",
    phoneVal: "",
    editUserId: "",
  });

  useEffect(async() => {
    await getSubUsers();
  
    filterData((await AsyncStorage.getItem("filter")) || "a-z")
  }, []);

  const getAccessToken = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (!accessToken) {
      return navigation.navigate("Login");
    }
    return accessToken;
  };

  const getSubUsers = async () => {
    const accessToken = await getAccessToken();
    const res = await fetch("http://localhost:3000/subuser/all", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken,
      }),
    });
    const data = await res.json();
    console.log(data);
    if (data.success) {
      setsubUsersArray(data.subUsers);
    }
  };

  const filterData = async (filter) => {
    setsubUsersArray((prevUsers) => {
      const sortedUsers = [...prevUsers];
      if (filter === "lastInserted") {
        sortedUsers.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      } else if (filter === "lastModified") {
        sortedUsers.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
      } else if (filter === "a-z") {
        sortedUsers.sort((a, b) => a.username.localeCompare(b.username));
      } else if (filter === "z-a") {
        sortedUsers.sort((a, b) => b.username.localeCompare(a.username));
      }
      return sortedUsers;
    });
    await AsyncStorage.setItem("filter", filter);
  };

  return (
    <View>
      <Pressable
        onPress={toggleModal}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          backgroundColor: "black",
          position: "absolute",
          right: 16,
          top: 16,
          zIndex: 1,
        }}
      >
        <Text style={{ fontSize: 14, color: "white" }}>Add User</Text>
      </Pressable>

      <View style={{ height: 56, justifyContent: "center" }}>
        <Text style={{ fontSize: 16, marginLeft: 24 }}>
          Filters:
          <Pressable
            onPress={() => {
              filterData("a-z");
            }}
          >
            <Text> A-Z</Text>
          </Pressable>
          {" | "}
          <Pressable
            onPress={() => {
              filterData("z-a");
            }}
          >
            <Text> Z-A</Text>
          </Pressable>
          {" | "}
          <Pressable
            onPress={() => {
              filterData("lastInserted");
            }}
          >
            <Text> Last Inserted</Text>
          </Pressable>
          {" | "}
          <Pressable
            onPress={() => {
              filterData("lastModified");
            }}
          >
            <Text> Last Modified</Text>
          </Pressable>
        </Text>
      </View>

      <SearchBar setSearchResults={setSearchResults} subUsersArray={subUsersArray} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <AddUserPopup
        toggleModal={toggleModal}
        isModalVisible={isModalVisible}
        setsubUsersArray={setsubUsersArray}
        {...editUserDetails}
        seteditUserDetails={seteditUserDetails}
      />

      <View>
        {subUsersArray.length ? (searchTerm.length ? searchResults : subUsersArray).map((user) => {
          return (
            <UserCard
              key={user._id}
              {...user}
              setsubUsersArray={setsubUsersArray}
              seteditUserDetails={seteditUserDetails}
              toggleModal={toggleModal}
              navigation={navigation}
            />
          );
        }) : <Text style={{textAlign:"center", fontSize:18, marginTop: 16}} >No Data Found</Text>}
        {(searchTerm.length && !searchResults.length) ? <Text style={{textAlign:"center", fontSize:18, marginTop: 16}} >No Data Found</Text> : ""}
      </View>
    </View>
  );
};

export default Dashboard;
