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
  TextInput,
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countriesData);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle country selection
  const handleCountrySelect = (country: string, code: string) => {
    onSelect(country, code); // Call parent function to update state with country and code
    setIsDropdownOpen(false); // Close dropdown
    setSearchText(''); // Clear search input
    setFilteredCountries(countriesData); // Reset filtered countries
  };

  // Handle search input change
  const handleSearchChange = (text: string) => {
    setSearchText(text);

    // Filter countries based on the search text
    const filteredData = countriesData.filter((country) =>
      country.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCountries(filteredData);
  };

  // Clear search box
  const clearSearch = () => {
    setSearchText('');
    setFilteredCountries(countriesData); // Reset to original countries list
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
          {/* Search box */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={handleSearchChange}
              placeholder="Search Country..."
              placeholderTextColor={Colors.gray}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <Image source={Images.crossIcon} style={styles.clearIcon} />
              </TouchableOpacity>
            )}
          </View>

          {/* Country list */}
          <FlatList
            data={filteredCountries}
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

  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(1),
    paddingVertical: hp(0.5),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  searchInput: {
    flex: 1,
    height: hp(4.5),
    paddingHorizontal: wp(2),
    fontSize: FSize.fs14,
    color:Colors.black
  },
  clearIcon: {
    width: 15,
    height: 15,
    // marginLeft: 8,
    marginRight:wp(2)
  },
});
