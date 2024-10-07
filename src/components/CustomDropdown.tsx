import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import { wp, hp } from '../assets/commonCSS/GlobalCSS'; // Importing wp and hp
import FSize from '../assets/commonCSS/FSize';

const CustomDropdown = ({ items, selectedValue, setSelectedValue, setServiceID}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (item) => {
    setSelectedValue(item.value);
    setServiceID(item.id);
    setIsOpen(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleSelect(item)}
    >
      <Text style={styles.itemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selectedValueContainer}
        onPress={() => setIsOpen((prev) => !prev)}
      >
        <Text style={styles.selectedValueText}>
          {selectedValue || 'Select Category'}
        </Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownContainer}>
          <ScrollView nestedScrollEnabled style={styles.scrollView}>
            <FlatList
              data={items}
              renderItem={renderItem}
              keyExtractor={(item) => item.value}
              style={styles.flatList}
              nestedScrollEnabled
            />
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  selectedValueContainer: {
    height: hp(5), // Using hp for responsive height
    borderWidth: 1,
    borderColor: '#2874F0',
    borderRadius: 8,
    backgroundColor: '#2874F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedValueText: {
    fontSize: FSize.fs14, // Using hp for responsive font size
    color: '#FFFFFF',
    textAlign: 'center',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: hp(5), // Adjust this to position the dropdown below the selected value container
    left: 0,
    right: 0,
    maxHeight: hp(25), // Limit the height of the dropdown using hp
    zIndex: 1000,
  },
  scrollView: {
    maxHeight: hp(25), // Ensures it doesn't exceed a certain height
  },
  item: {
    paddingVertical: hp(1.5), // Using hp for padding
    width: wp(50), // Increased width for better visibility
  },
  itemText: {
    fontSize: FSize.fs12, // Using hp for responsive font size
    textAlign: 'center',
    color: 'black', // Set text color to black
  },
});

export default CustomDropdown;
