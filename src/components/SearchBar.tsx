import { StyleSheet, View, Image, TextInput } from 'react-native';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { hp, wp } from '../assets/commonCSS/GlobalCSS';
import Images from '../assets/image';
import FSize from '../assets/commonCSS/FSize';
import Colors from '../assets/commonCSS/Colors';
import { postData } from '../services/mobile-api';
import { mobile_siteConfig } from '../services/mobile-siteConfig';
import debounce from 'lodash.debounce';

const SearchBar = ({ placeholderName, setSearched }) => {
  const [search, setSearch] = useState('');
  const [cachedResults, setCachedResults] = useState({});

  const getSearchDetails = useCallback(
    debounce(() => {
      if (!search) {
        setSearched([]);
        return;
      }

      // Check if the result for the current query is cached
      if (cachedResults[search]) {
        setSearched(cachedResults[search]);
        return;
      }

      const formData = new FormData();
      formData.append('dataValue', 0);

      postData(formData, mobile_siteConfig.FILTER_PROF)
        .then((res) => {
          if (res.status === 200 && res.msg) {
            const allProfessionals = res.msg;

            // Filter professionals based on search input
            const filteredProfessionals = allProfessionals.filter((professional) =>
              professional?.data?.name?.toLowerCase().includes(search.toLowerCase().trim())
            );

            console.log('filtered professionals:::::::::', filteredProfessionals)

            // Cache and set the search results
            setCachedResults((prev) => ({ ...prev, [search]: filteredProfessionals }));
            setSearched(filteredProfessionals);
          } else {
            console.log('Error in search results:', res.msg || "No results found.");
            setSearched([]);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setSearched([]);
        });
    }, 300),
    [search, cachedResults]
  );

  useEffect(() => {
    getSearchDetails();
    // Cancel the debounce on component unmount
    return () => getSearchDetails.cancel();
  }, [search, getSearchDetails]);

  return (
    <View style={styles.searchBar}>
      <Image source={Images.searchIcon} resizeMode="contain" style={styles.iconStyle} />
      <TextInput
        style={styles.searchInput}
        placeholder={`Search ${placeholderName}`}
        value={search}
        placeholderTextColor="#BABABA"
        onChangeText={(value) => setSearch(value)}
        keyboardType="default"
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchBar: {
    borderWidth: 1,
    borderColor: '#CFCFCF',
    width: '100%',
    height: hp(5),
    borderRadius: wp(2.5),
    paddingHorizontal: wp(2.5),
    marginVertical: hp(3),
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    width: wp(5),
    height: hp(5),
    tintColor: '#CFCFCF',
  },
  searchInput: {
    paddingHorizontal: wp(3),
    fontSize: FSize.fs12,
    width: '100%',
    color: Colors.black,
  },
});
