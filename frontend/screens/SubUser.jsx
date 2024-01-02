import React from 'react'
import {View, Text} from "react-native"

const SubUser = ({ route }) => {
    const {user} = route.params
    const {username, email, phone} = user
  return (
    <View>
        <Text>Username: {username}</Text>
        <Text>Email: {email}</Text>
        <Text>Phone: {phone}</Text>
    </View>
  )
}

export default SubUser