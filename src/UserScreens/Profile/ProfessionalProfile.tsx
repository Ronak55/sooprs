import {StyleSheet, Text, View, Image, TouchableOpacity, Alert, ScrollView} from 'react-native';
import React from 'react';
import {wp, hp} from '../../assets/commonCSS/GlobalCSS';
import FSize from '../../assets/commonCSS/FSize';
import Header from '../../components/Header';
import Images from '../../assets/image';
import Colors from '../../assets/commonCSS/Colors';
import ProfileComponent from '../../components/ProfileComponent';
import ProfileContent from '../../components/ProfileContent';
import ContactDetails from '../../components/ContactDetails';
import ProfileTabs from '../../components/ProfileTabs';

const ProfessionalProfile = ({navigation, route}: {navigation: any; route: any;}) => {

  const {img, name, role, rating} = route.params;

  const tabs = ['Portfolio', 'Services', 'Skills','Reviews'];


  const profileInfo = [
    {
      heading : "Bio", 
      content : "Hello! I am John Doe, a passionate and skilled web developer with over 8 years of experience crafting dynamic, responsive, and user-friendly websites. With a deep understanding of both front-end and back-end development, I have the expertise to bring any digital vision to life."
    }
  ]


  return (
    <View style={styles.container}>
      <ScrollView style={styles.profileView}>
      <ProfileComponent navigation={navigation} img={img} name={name} role={role} rating={rating}/>
      <ProfileContent heading={profileInfo[0].heading} content={profileInfo[0].content}/>
      <ContactDetails email="rj.rjain567@gmail.com" phone="8474081159" location="New Delhi"/>
      <ProfileTabs tabs={tabs}/>
      </ScrollView>
    </View>
  );
};

export default ProfessionalProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  profileView:{

    margin:wp(2)
  },

  profileSection: {
    marginHorizontal: wp(5),
    marginVertical: hp(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  backArrow: {
    width: wp(8),
    height: hp(8),
  },
  profile: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: wp(20),
    marginVertical: hp(5),
    alignItems:'center',
    gap:1
  },
  profileIcon: {
    width: wp(50),
    height: hp(25),
    borderWidth: 5,
    borderColor: '#D4E3FC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(30),
    marginBottom:wp(2)
  },
  Icon: {
    width: hp(23),
    height: hp(23),
    borderRadius: wp(50),

  },
  starIcon: {
    width: wp(3),
    height: hp(3),
  },
  rating: {
    fontSize: FSize.fs12,
    color: Colors.black,
  },
  profileName: {
    fontSize: FSize.fs24,
    fontWeight: '600',
    color:Colors.black
  },
  profileRole: {
    fontSize: FSize.fs12,
    fontWeight: '500',
    color:Colors.gray
  },

  ratings:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  }
});
