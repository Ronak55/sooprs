import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  StatusBar
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';
import Images from '../../assets/image';
import Colors from '../../assets/commonCSS/Colors';
import {wp, hp} from '../../assets/commonCSS/GlobalCSS';
import SearchBar from '../../components/SearchBar';
import Filter from '../../components/Filter';
import IntroCard from '../../components/IntroCard';
import ProfessionalList from '../../components/ProfessionalList';
import HomeSectionTitle from '../../components/HomeSectionTitle';
import GigsList from '../../components/GigsList';
import FSize from '../../assets/commonCSS/FSize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { mobile_siteConfig } from '../../services/mobile-siteConfig';

const Home = ({navigation} : {navigation:any}) => {

  const [name, setName] = useState('');
  const isFocused = useIsFocused();
  

  const getName = async()=>{

    try {
      const name = await AsyncStorage.getItem(mobile_siteConfig.NAME);
      const parsedName = JSON.parse(name)
      if (name !== null) {
        setName(parsedName ?? '');
      }
    } catch (e) {
      console.log('Error retrieving profile details:', e);
    }


  }

  useEffect(()=>{

    getName();
    
  }, [isFocused])

  return (
    <>
    <StatusBar barStyle="dark-content" backgroundColor="white" />
    <ScrollView style={styles.container}>
      <Header
        navigation={navigation}
        img={Images.profileImagetwo}
        name={name || 'User'}
        btnName="Post a project"
        isClient={true}
      />
      <View style={styles.section}>
        <View style={styles.textAlign}>
          <Text style={styles.homeInfo}>Find the Top </Text>
          <Text style={[styles.homeInfo, styles.profText]}>Professionals</Text>
          <Text style={styles.homeInfo}> for you</Text>
          <Text style={styles.homeInfo}> super </Text>
          <Text style={[styles.homeInfo, styles.profText]}>quick!</Text>
        </View>
        <View style={styles.searchFilter}>
          <SearchBar placeholderName='Professionals'/>
          <Filter />
        </View>
        <IntroCard
          cardText="Your One-Stop Solution for Quality and Convenience!"
          showBtn={true}
          img={Images.introLogo}
          bgColor={['#0077FF', '#D6E9FF']}
          cardbgColor="#D4E3FC24" 
        />
       <HomeSectionTitle navigation={navigation} titleOne="Our" titleTwo="Professionals" btntxt="See all" onPress="Professionals"/> 
        <ProfessionalList navigation={navigation}/>
        <HomeSectionTitle navigation={navigation} titleOne="Checkout" titleTwo="GIGS" btntxt="See all" onPress="Gigs"/> 
        <GigsList/>
      </View>
    </ScrollView>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  section: {
    marginHorizontal: wp(5),
    marginVertical: hp(5),
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

  profText:{

    color:Colors.sooprsblue
  },

  searchFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
