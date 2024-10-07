import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import React from 'react';
import {hp, wp} from '../../assets/commonCSS/GlobalCSS';
import FSize from '../../assets/commonCSS/FSize';
import Images from '../../assets/image';
import Header from '../../components/Header';
import SearchBar from '../../components/SearchBar';
import Filter from '../../components/Filter';
import Colors from '../../assets/commonCSS/Colors';
import IntroCard from '../../components/IntroCard';
import HomeSectionTitle from '../../components/HomeSectionTitle';
import CategoriesList from '../../components/CategoriesList';

const Professionals = ({navigation}: {navigation: any}) => {
  return (
    <ScrollView style={styles.container}>
      <Header
        navigation={navigation}
        img={Images.profileImagetwo}
        name="Jacob Collis"
        btnName="Post a project"
      />
      <View style={styles.section}>
        <View style={styles.textAlign}>
          <Text style={styles.homeInfo}>Find and </Text>
          <Text style={[styles.homeInfo, styles.profText]}>Connect</Text>
          <Text style={styles.homeInfo}> with</Text>
          <Text style={[styles.homeInfo, styles.profText]}> Industry</Text>
          <Text style={[styles.homeInfo, styles.profText]}>Professionals</Text>
        </View>

        <View style={styles.searchFilter}>
          <SearchBar placeholderName='Gigs' />
          <Filter />
        </View>
        {/* <IntroCard
          cardText="Discover Top Professionals and Connect"
          showBtn={false}
          img={Images.professionalslogo}
          bgColor={['#B24BB2', '#D4E3FC24']}
          cardbgColor="#D4E3FC24"
        /> */}
        <HomeSectionTitle navigation={navigation} titleOne="Categories" titleTwo="" btntxt="See all" onPress=""/> 
        <CategoriesList navigation={navigation}/>
      </View>
    </ScrollView>
  );
};

export default Professionals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  section: {
    marginHorizontal: wp(5),
    marginVertical: hp(3),
  },
  homeInfo: {
    color: Colors.black,
    fontWeight: '600',
    fontSize: FSize.fs19,
  },

  textAlign: {
    flexDirection: 'row',
    flexWrap: 'wrap',

  },

  profText: {
    color: Colors.sooprsblue,
  },

  searchFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
