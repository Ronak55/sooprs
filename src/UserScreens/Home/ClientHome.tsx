import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  StatusBar,
  RefreshControl,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Header from '../../components/Header';
import Images from '../../assets/image';
import Colors from '../../assets/commonCSS/Colors';
import { wp, hp } from '../../assets/commonCSS/GlobalCSS';
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

const Home = ({ navigation }: { navigation: any }) => {
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // State to manage loading status

  const getProfessionals = async () => {
    setLoading(true); // Set loading to true when fetching
    const formdata = new FormData();
    formdata.append('offset', 0);
    formdata.append('limit', 10);

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formdata,
    };

    try {
      const response = await fetch('https://sooprs.com/api2/public/index.php/get_professionals_ajax', requestOptions);
      const res = await response.json();
      if (res.status === 200) {
        // console.log('professional data:::::', res.msg);
        setProfessionals(res.msg); // Update the state with fetched data
      } else {
        console.error('Failed to fetch professionals:', res.message);
      }
    } catch (error) {
      console.error('Error fetching professionals:', error);
    } finally {
      setLoading(false); 
    }
  };

  const getNameAndImage = async () => {
    try {
      const name = await AsyncStorage.getItem(mobile_siteConfig.NAME);
      const profilepic = await AsyncStorage.getItem(mobile_siteConfig.PROFILE_PIC);

      const parsedName = JSON.parse(name);
      console.log('name of the client:::::::::;', name)
      const parsedprofilepic = JSON.parse(profilepic);
      if (name !== null) {
        setName(parsedName ?? '');
      }
        setProfilePic(parsedprofilepic);
    } catch (e) {
      console.log('Error retrieving profile details:', e);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getNameAndImage();
      await getProfessionals();
    };
    fetchData();
  }, [isFocused]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getProfessionals(); // Fetch professionals when refreshing
    setRefreshing(false); // Set refreshing to false after fetching
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Header
          navigation={navigation}
          img={profilePic}
          name={name || 'User'}
          btnName="Post a project"
          isClient={true}
        />
        <View style={styles.section}>
          <View style={styles.textAlign}>
            <Text style={styles.homeInfo}>Find the Top </Text>
            <Text style={[styles.homeInfo, styles.profText]}>
              Professionals
            </Text>
            <Text style={styles.homeInfo}> for you</Text>
            <Text style={styles.homeInfo}> super </Text>
            <Text style={[styles.homeInfo, styles.profText]}>quick!</Text>
          </View>
          {/* <View style={styles.searchFilter}>
            <SearchBar placeholderName="Professionals" />
          </View> */}
          <IntroCard
            cardText="Your One-Stop Solution for Quality and Convenience!"
            showBtn={true}
            img={Images.introLogo}
            bgColor={['#0077FF', '#D6E9FF']}
            cardbgColor="#D4E3FC24"
          />
          <HomeSectionTitle
            navigation={navigation}
            titleOne="Our"
            titleTwo="Professionals"
            btntxt="See all"
            onPress="Professionals"
          />
          {loading ? ( // Show loading text when fetching professionals
            <Text style={styles.loadingText}>Loading Professionals...</Text>
          ) : (
            <ProfessionalList professionals={professionals} navigation={navigation} />
          )}
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
    marginVertical: hp(2),
  },
  homeInfo: {
    color: Colors.black,
    fontWeight: '600',
    fontSize: FSize.fs19,
  },

  textAlign: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom:hp(3)
  },

  profText: {
    color: Colors.sooprsblue,
  },

  searchFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    textAlign: 'center',
    fontSize: FSize.fs16,
    color: Colors.gray,
    fontWeight:'500',
    marginVertical: hp(2), // Adjust margin for better spacing
  },
});
