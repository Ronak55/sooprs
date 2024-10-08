import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import React, { useEffect, useState } from 'react';
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

  const [professionals, setProfessionals] = useState<any[]>([]);
  const [services, setServices] = useState([]);
  

  const getProfessionals = () => {
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

    fetch(
      'https://sooprs.com/api2/public/index.php/get_professionals_ajax',
      requestOptions,
    )
      .then(response => response.json())
      .then(res => {
        if (res.status === 200) {
          res.msg.map((item)=>{
            console.log('professional data::::::', item.data);
            setProfessionals(item.data);
            setServices(item.services);
          })

        }
      })
      .catch(error => {
        console.error('Error fetching professionals:', error);
      });
  };

  useEffect(() => {
    getProfessionals();
  }, []);


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
        <CategoriesList navigation={navigation} professionals={professionals}/>
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
