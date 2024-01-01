import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  StatusBar,
  Switch,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { RadioButton, Checkbox } from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";
import Autocomplete from "react-native-autocomplete-input";

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState('')
  const [cpassword, setcpassword] = useState('')
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [hearAbout, setHearAbout] = useState({
    LinkedIn: false,
    Friends: false,
    JobPortal: false,
    Others: false,
  });
  const cities = ["Mumbai", "Pune", "Ahemdabad"];
  const [city, setCity] = useState("");

  const states = ["Maharashtra", "Karnataka", "Gujarat"];
  const [inputState, setinputState] = useState("");
  const [statesArray, setstatesArray] = useState([]);

  const setStates = (text) => {
    setinputState(text);
    setstatesArray(
      states.filter((state) => {
        return state.toLowerCase().includes(text.toLowerCase());
      })
    );
  };

  const findTrueKeys = (obj) => {
    const trueKeys = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === true) {
        trueKeys.push(key);
      }
    }
    return trueKeys;
  };
  

  const saveForm = async() => {
    if(!name.length || !email.length || !password.length || !cpassword.length || !phone.length || !gender.length || !cities.length || !inputState.length || !findTrueKeys(hearAbout).length){
      console.log("filed not provided");
      return
    }

    if(password !== cpassword)
      return

    try{
      const res = await fetch("http://localhost:3000/login",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({
          name, email, password, phone, gender, city, state:inputState, hearAbout:findTrueKeys(hearAbout)
        })
      })
      const data = await res.json()
    }catch(e){
      console.log(e);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled" >
        <Text style={{ fontSize: 22, marginBottom: 24, textAlign: "center" }}>
          Sign Up
        </Text>
        <View>
          <View style={styles.inputDiv}>
            <Text style={styles.inputLabel}>Your name: </Text>
            <TextInput
              style={styles.inputField}
              value={name}
              onChangeText={setName}
              placeholder="Your name here"
            />
          </View>

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
              onChangeText={setpassword}
              placeholder="Password here"
              autoCorrect={false} 
              secureTextEntry={true}
            />
          </View>

          <View style={styles.inputDiv}>
            <Text style={styles.inputLabel}>Confirm Password: </Text>
            <TextInput
              style={styles.inputField}
              value={cpassword}
              onChangeText={setcpassword}
              placeholder="Confirm Password"
              autoCorrect={false}
              secureTextEntry={true}
            />
          </View>

          <View style={styles.inputDiv}>
            <Text style={styles.inputLabel}>Your Phone: </Text>
            <TextInput
              style={styles.inputField}
              value={phone}
              onChangeText={setPhone}
              placeholder="Your Phone here"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputDiv}>
            <Text style={styles.inputLabel}>You Gender : </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                columnGap: 8,
                flexWrap: "wrap",
              }}
            >
              <View style={styles.radioFieldView}>
                <RadioButton
                  value="Male"
                  status={gender === "Male" ? "checked" : "unchecked"}
                  onPress={() => setGender("Male")}
                />
                <Text>Male</Text>
              </View>
              <View style={styles.radioFieldView}>
                <RadioButton
                  value="Female"
                  status={gender === "Female" ? "checked" : "unchecked"}
                  onPress={() => setGender("Female")}
                />
                <Text>Female</Text>
              </View>
              <View style={styles.radioFieldView}>
                <RadioButton
                  value="Others"
                  status={gender === "Others" ? "checked" : "unchecked"}
                  onPress={() => setGender("Others")}
                />
                <Text>Others</Text>
              </View>
            </View>
          </View>

          <View style={styles.inputDiv}>
            <Text style={styles.inputLabel}>How did you hear about Us?</Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                columnGap: 8,
                flexWrap: "wrap",
              }}
            >
              <View style={styles.radioFieldView}>
                <Checkbox
                  status={hearAbout.LinkedIn ? "checked" : "unchecked"}
                  onPress={() =>
                    setHearAbout((prevState) => {
                      return { ...prevState, LinkedIn: !prevState.LinkedIn };
                    })
                  }
                />
                <Text>Linkedin</Text>
              </View>
              <View style={styles.radioFieldView}>
                <Checkbox />
                <Text>Friends</Text>
              </View>
              <View style={styles.radioFieldView}>
                <Checkbox />
                <Text>Job Portal</Text>
              </View>
              <View style={styles.radioFieldView}>
                <Checkbox />
                <Text>Others</Text>
              </View>
            </View>
          </View>

          <View style={styles.inputDiv}>
            <Text style={styles.inputLabel}>Choose your city: </Text>
            <SelectDropdown
              buttonTextStyle={{ fontSize: 14, marginLeft: 0, marginRight: 0 }}
              buttonStyle={{ padding: 0, height: 40, width: "auto" }}
              statusBarTranslucent={true}
              data={cities}
              value={city}
              onSelect={(selectedItem) => {
                setCity(selectedItem);
              }}
              buttonTextAfterSelection={(selectedItem) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item;
              }}
            />
          </View>

          <View style={styles.inputDiv}>
            <Text style={styles.inputLabel}>Enter your state: </Text>
            <TextInput
              placeholder="Enter your State"
              style={styles.inputField}
              value={inputState}
              onChangeText={setStates}
            />
            {/* <Autocomplete
              data={statesArray}
              renderTextInput={props => {
                <Pressable onPress={() => {
                  console.log("pressed");
                  setinputState(props.value)
                  setstatesArray([])
                }} >
                  <Text>{props.value}</Text>
                </Pressable>
              }}
              key={(item, index) => index.toString()}
            /> */}
          </View>

          <Pressable onPress={saveForm} style={{paddingHorizontal:16, paddingVertical:8, backgroundColor: "black", width:80}} >
            <Text style={{color:"white"}} >Submit</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: StatusBar.currentHeight + 16,
    paddingHorizontal: 24,
    paddingBottom: 24
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
  radioFieldView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  autocompleteContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
});
