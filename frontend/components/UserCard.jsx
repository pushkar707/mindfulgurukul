import React from "react";
import {View, Text, Image, StyleSheet, Pressable} from "react-native"
import Svg, { Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserCard = ({_id,username,email,phone, setsubUsersArray, seteditUserDetails, toggleModal}) => {

    const getAccessToken = async() => {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if(!accessToken){
          return navigation.navigate('Login')
        }
        return accessToken
    }

    const deleteUser = async (id) => {
        if(window.confirm("Are you sure you want to delete the user?")){
            const accessToken = await getAccessToken()
            const res = await fetch("http://localhost:3000/subuser/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  accessToken,id
                }),
            })
            const data = await res.json()
            if(data.success){
                setsubUsersArray(prevState => {
                    const previousUsers = prevState.filter(user => {
                        return user._id !== id
                    })
                    return previousUsers
                })
            }
        }
    }

    const updateUser = async (id,username,email,phone) => {
      seteditUserDetails({editUserId:id, usernameVal:username, emailVal:email, phoneVal:phone})
      toggleModal()
    }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{username}</Text>
      <Text style={styles.description}>Email: {email}</Text>
      <Text style={styles.description}>Phone: {phone}</Text>
      <Text style={{ ...styles.description, marginTop: 8 }}>
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 48 48"
          style={{ marginRight: 12 }}
        >
          <Path
            d="M40.960938 4.9804688 A 2.0002 2.0002 0 0 0 40.740234 5 L 28 5 A 2.0002 2.0002 0 1 0 28 9 L 36.171875 9 L 22.585938 22.585938 A 2.0002 2.0002 0 1 0 25.414062 25.414062 L 39 11.828125 L 39 20 A 2.0002 2.0002 0 1 0 43 20 L 43 7.2460938 A 2.0002 2.0002 0 0 0 40.960938 4.9804688 z M 12.5 8 C 8.3826878 8 5 11.382688 5 15.5 L 5 35.5 C 5 39.617312 8.3826878 43 12.5 43 L 32.5 43 C 36.617312 43 40 39.617312 40 35.5 L 40 26 A 2.0002 2.0002 0 1 0 36 26 L 36 35.5 C 36 37.446688 34.446688 39 32.5 39 L 12.5 39 C 10.553312 39 9 37.446688 9 35.5 L 9 15.5 C 9 13.553312 10.553312 12 12.5 12 L 22 12 A 2.0002 2.0002 0 1 0 22 8 L 12.5 8 z"
            fill="#000000"
          />
        </Svg>

        <Pressable onPress={() => updateUser(_id,username,email,phone)}>
            <Svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            style={{ marginRight: 12 }}
            >
            <Path d="M 19.171875 2 C 18.448125 2 17.724375 2.275625 17.171875 2.828125 L 16 4 L 20 8 L 21.171875 6.828125 C 22.275875 5.724125 22.275875 3.933125 21.171875 2.828125 C 20.619375 2.275625 19.895625 2 19.171875 2 z M 14.5 5.5 L 3 17 L 3 21 L 7 21 L 18.5 9.5 L 14.5 5.5 z" />
            </Svg>
        </Pressable>

        <Pressable onPress={() => deleteUser(_id)}>
            <Image
            source={{
                uri: "https://img.icons8.com/material-rounded/24/waste.png",
            }}
            style={{ width: 20, height: 20 }}
            />
        </Pressable>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
    card: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
      marginVertical: 8,
      marginHorizontal:8,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    description: {
      fontSize: 16,
      color: '#555',
      marginBottom:8
    },
  });

export default UserCard;
