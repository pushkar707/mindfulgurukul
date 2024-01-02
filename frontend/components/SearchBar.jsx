import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

const SearchBar = ({setSearchResults,subUsersArray,searchTerm,setSearchTerm}) => {

    const [selectedCategory, setSelectedCategory] = useState("username");

    const search = (text) => {
        const filteredUsers = subUsersArray.filter(user => {
            const searchTermMatch = user[selectedCategory].toLowerCase().includes(text.toLowerCase());
            return searchTermMatch;
        });
        console.log(filteredUsers);
        setSearchResults(filteredUsers)
    };
  const searchCategories = [
    "username",
    "email",
    "phone",
  ];
  return (
    <View style={{ padding: 16 , flexDirection:"row", overflow: "hidden", width:"100%"}}>
      <TextInput
        placeholder="Enter search term"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 8,
          fontSize: 16,
        //   flexGrow:1
        }}
        
        value={searchTerm}
        onChangeText={(text) => {setSearchTerm(text);search(text)}}
      />

      <SelectDropdown
        data={searchCategories}
        onSelect={(selectedItem, index) => setSelectedCategory(selectedItem)}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        buttonTextStyle={{
            fontSize: 16,          
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
        buttonStyle={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 8,
          width: 170
        }}
        defaultButtonText={selectedCategory}
      />
    </View>
  );
};

export default SearchBar;
