import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {mobile_siteConfig} from '../../services/mobile-siteConfig';
import {useIsFocused} from '@react-navigation/native';
import AllProfessionals from '../../components/AllProfessionals';

const Professionals = ({navigation}: {navigation: any}) => {
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState<string | null>(null); // New state for selected service
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const isFocused = useIsFocused();

  const getNameAndImage = async () => {
    try {
      const name = await AsyncStorage.getItem(mobile_siteConfig.NAME);
      const profilepic = await AsyncStorage.getItem(mobile_siteConfig.PROFILE_PIC);

      const parsedName = JSON.parse(name);
      const parsedprofilepic = JSON.parse(profilepic);
      if (name !== null) {
        setName(parsedName ?? '');
      }

      if (parsedprofilepic) {
        setProfilePic(parsedprofilepic);
      }
    } catch (e) {
      console.log('Error retrieving profile details:', e);
    }
  };


  useEffect(() => {
    getNameAndImage();
  }, [isFocused]);

  return (
    <ScrollView style={styles.container}>
      <Header
        navigation={navigation}
        img={profilePic}
        name={name || 'User'}
        btnName="Post a project"
        isClient={true}
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
          <SearchBar placeholderName="Professionals..." />
        </View>
        {/* <IntroCard
          cardText="Discover Top Professionals and Connect"
          showBtn={false}
          img={Images.professionalslogo}
          bgColor={['#B24BB2', '#D4E3FC24']}
          cardbgColor="#D4E3FC24"
        /> */}
        <CategoriesList
          navigation={navigation}
          services={services}
          onSelectService={setSelectedService}
        />
        <AllProfessionals navigation={navigation}  selectedService={selectedService}/>
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
