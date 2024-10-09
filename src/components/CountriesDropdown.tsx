import countriesData from '../countries.json';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import Colors from '../assets/commonCSS/Colors';
import { wp, hp } from '../assets/commonCSS/GlobalCSS';
import FSize from '../assets/commonCSS/FSize';
import Images from '../assets/image';

const CountriesDropdown = ({
  selectedCountry,
  selectedCountryCode,
  onSelect,
}: {
  selectedCountry: string; 
  selectedCountryCode: string; 
  onSelect: (country: string, countryCode: string) => void; 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // To handle dropdown visibility

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle country selection
  const handleCountrySelect = (country: string, code: string) => {
    onSelect(country, code); // Call parent function to update state with country and code
    setIsDropdownOpen(false); // Close dropdown
  };

  return (
    <View>
      {/* Display selected country */}
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
        <Text style={styles.dropdownButtonText}>
          {selectedCountry ? selectedCountry : 'Select Country'}
        </Text>
        <Image
          source={isDropdownOpen ? Images.uparrowIcon : Images.downArrowLight}
          style={styles.arrowIcon}
        />
      </TouchableOpacity>

      {/* Dropdown content */}
      {isDropdownOpen && (
        <View style={styles.dropdownContent}>
          <ScrollView nestedScrollEnabled style={styles.scrollView}>
            <FlatList
              data={countriesData}
              keyExtractor={(item) => item.code} // Use country code as key
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleCountrySelect(item.name, item.code)} // Pass both name and code
                >
                  <Text style={styles.dropdownItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              nestedScrollEnabled
            />
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default CountriesDropdown;

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: wp(4), // Adjusted for responsiveness
    paddingVertical: hp(1.5),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: Colors.gray,
    marginBottom: hp(1.5),
  },
  dropdownButtonText: {
    color: Colors.black,
    fontSize: FSize.fs14, // Adjusted font size
  },
  arrowIcon: {
    width: wp(4), // Adjusted for responsiveness
    height: wp(4),
  },
  dropdownContent: {
    maxHeight: hp(25), // Limited dropdown height for a smoother UI
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: wp(2),
    backgroundColor: Colors.white,
    marginTop: hp(1),
  },
  dropdownItem: {
    padding: wp(3), // Responsive padding
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  dropdownItemText: {
    color: Colors.black,
    fontSize: FSize.fs14, // Responsive font size
  },
  scrollView: {
    maxHeight: hp(25), // Ensures it doesn't exceed a certain height
  },
});
