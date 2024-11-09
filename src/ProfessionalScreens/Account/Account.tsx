import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useEffect, useState } from 'react';
import Images from '../../assets/image';
import FSize from '../../assets/commonCSS/FSize';
import Colors from '../../assets/commonCSS/Colors';
import { hp, wp } from '../../assets/commonCSS/GlobalCSS';
import AccountProfile from '../../components/AccountProfile';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mobile_siteConfig } from '../../services/mobile-siteConfig';


const Account = ({navigation} : {navigation:any}) => {
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const isFocused = useIsFocused();
  
  useEffect(() => {
    const loadProfileDetails = async () => {
      try {
        const name = await AsyncStorage.getItem(mobile_siteConfig.NAME);
        const profilepic = await AsyncStorage.getItem(
          mobile_siteConfig.PROFILE_PIC,
        );

        console.log('profilepic account::::::::;', profilepic);
        setProfileImage(profilepic);
        const parsedName = JSON.parse(name);
        if (name !== null) {
          setName(parsedName ?? '');
        }

      } catch (e) {
        console.log('Error retrieving profile details:', e);
      }
    };

    loadProfileDetails();
  }, [isFocused]);

  return (
    <View style={styles.section}>
      <View style={styles.headerSection}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ProfessionalHome');
          }}>
          <Image
            source={Images.backArrow}
            resizeMode="contain"
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text
          style={{
            color: Colors.black,
            fontWeight: '500',
            fontSize: FSize.fs16,
          }}>
          Edit Profile
        </Text>
      </View>
      <AccountProfile navigation={navigation} isClient={false} name={name} profileImage={profileImage}/>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  section: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerSection: {
    marginHorizontal: wp(5),
    marginVertical: hp(1),
    gap: wp(5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    width: wp(8),
    height: hp(8),
  },
});
