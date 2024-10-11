import { StyleSheet, Text, View, StatusBar, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { wp, hp } from '../../assets/commonCSS/GlobalCSS'
import Colors from '../../assets/commonCSS/Colors'
import FSize from '../../assets/commonCSS/FSize'
import Header from '../../components/Header'
import Images from '../../assets/image'
import SearchBar from '../../components/SearchBar'
import Filter from '../../components/Filter'
import IntroCard from '../../components/IntroCard'
import AllProjects from '../../components/AllProjects'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import { mobile_siteConfig } from '../../services/mobile-siteConfig'

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
        name={name || "user"}
        btnName=""
        isClient={false}
      />
      <View style={styles.section}>
        <View style={styles.textAlign}>
          <Text style={styles.homeInfo}>Browse </Text>
          <Text style={[styles.homeInfo, styles.profText]}>Client Needs</Text>
          <Text style={styles.homeInfo}> and</Text>
          <Text style={styles.homeInfo}> Offer</Text>
          <Text style={[styles.homeInfo, styles.profText]}>Your Expertise</Text>
        </View>
        <View style={styles.searchFilter}>
          <SearchBar placeholderName='Professionals'/>
          <Filter />
        </View>
        <IntroCard
          cardText="Discover projects with ease!"
          showBtn={true}
          img={Images.introLogo}
          bgColor={['#0077FF', '#D6E9FF']}
          cardbgColor="#D4E3FC24" 
        />
         <AllProjects navigation={navigation}/>
        </View>
        </ScrollView>
   </>
  )
}

export default Home

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
})