import React,{useState,useEffect} from "react";
import { Pressable, View, Text, StyleSheet, Image, Modal } from "react-native";
import AddUserPopup from "../components/AddUserPopup";
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserCard from "../components/UserCard";

const Dashboard = ({navigation}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(prevState => !prevState);
  };

  const [subUsersArray, setsubUsersArray] = useState([])
  const [editUserDetails, seteditUserDetails] = useState({usernameVal:"",emailVal:"",phoneVal:"",editUserId:""})

  useEffect(() => {
    getSubUsers()
  },[])
  
  const getAccessToken = async() => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    if(!accessToken){
      return navigation.navigate('Login')
    }
    return accessToken
  }

  const getSubUsers = async () => {
    const accessToken = await getAccessToken()
    const res = await fetch("http://localhost:3000/subuser/all", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken
      }),
    })
    const data = await res.json()
    console.log(data);
    if(data.success){
      setsubUsersArray(data.subUsers)
    }
  }

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
        }}
      >
        <Text style={{ fontSize: 14, color: "white" }}>Add User</Text>
      </Pressable>

      <AddUserPopup toggleModal={toggleModal} isModalVisible={isModalVisible} setsubUsersArray={setsubUsersArray} {...editUserDetails} seteditUserDetails={seteditUserDetails} /> 

      <View style={{marginTop:56}} >
      {subUsersArray.reverse().map(user => {
        return <UserCard key={user._id} {...user} setsubUsersArray={setsubUsersArray} seteditUserDetails={seteditUserDetails} toggleModal={toggleModal} /> 
      })}
      </View>

    </View>
  );
};


export default Dashboard;
