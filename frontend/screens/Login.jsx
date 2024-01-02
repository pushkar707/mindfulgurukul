import React,{useState} from "react";
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, Text, TextInput, Pressable, Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const saveForm = async () => {
    if(!email.length || !password.length)
        return
    try {
        const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
        });
        const data = await res.json();
        if(data.success){
          await AsyncStorage.setItem('accessToken', data.accessToken);
          navigation.navigate('Dashboard')
        }
    } catch (e) {
        console.log(e);
    }
  }

  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
    >
        <ScrollView keyboardShouldPersistTaps="handled" >
            <View style={styles.inputDiv}>
                <Text style={styles.inputLabel}>Your Email: </Text>
                <TextInput
                    style={styles.inputField}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Your Email here"
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.inputDiv}>
                <Text style={styles.inputLabel}>Password: </Text>
                <TextInput
                    style={styles.inputField}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password here"
                    autoCorrect={false}
                    secureTextEntry={true}
                />
            </View>

            <Pressable
                onPress={saveForm}
                style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    backgroundColor: "black",
                    width: 80,
                }}
            >
                <Text style={{ color: "white" }}>Submit</Text>
            </Pressable>
        </ScrollView> 
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 24,
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

export default Login;
