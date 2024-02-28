import React, { useState } from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

const Searchbar = ({ dataList }: any) => {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleInputChange = (inputValue: any) => {
    setQuery(inputValue);

    // Filter the data list based on the input value
    const filtered = dataList.filter(
      (item: string) =>
        typeof item === "string" &&
        item.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleItemClick = (item: any) => {
    setQuery(item);
    setFilteredData([]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={handleInputChange}
        placeholder="Search..."
      />
      {filteredData.length > 0 && (
        <FlatList
          data={filteredData}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleItemClick(item)}>
              <Text style={styles.item}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  item: {
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default Searchbar;
