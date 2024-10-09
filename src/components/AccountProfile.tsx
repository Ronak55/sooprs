import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FSize from '../assets/commonCSS/FSize';
import Colors from '../assets/commonCSS/Colors';
import Images from '../assets/image';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const AccountProfile = ({navigation}: {navigation: any}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [profileImage, setProfileImage] = useState(Images.profileImage);
  const isFocused = useIsFocused();


  useEffect(() => {
    const loadProfileDetails = async () => {
      try {
        const storedDetails = await AsyncStorage.getItem('profileDetails');
        if (storedDetails !== null) {
          const { name, role, profileImage } = JSON.parse(storedDetails);
          setName(name);
          setRole(role);
          setProfileImage(profileImage);
        }
      } catch (e) {
        console.log('Error retrieving profile details:', e);
      }
    };

    const getImageFromStorage = async () => {
        try {
          const imageUrl = await AsyncStorage.getItem('profileImageUrl');
          if (imageUrl) {
            console.log('Retrieved image URL:', imageUrl);
            setProfileImage({uri: imageUrl}); // Use the stored image URL
          }
        } catch (error) {
          console.error('Error retrieving image from AsyncStorage:', error);
        }
      };
    loadProfileDetails();
    getImageFromStorage();

  }, [isFocused]);

  return (
    <View style={styles.profile}>
      <View style={styles.profileHeading}>
          <View style={[styles.profileIcon]}>
            <Image
              style={styles.Icon}
              resizeMode="cover"
              source={profileImage}
            />
          </View>
        <Text style={styles.profileName}>{name ? name : 'User'}</Text>
        <Text style={styles.profileRole}>{role ? role : 'Role'}</Text>
      </View>
      <View style={styles.profileSection}>
        <View style={styles.commonSettings}>
          <View style={styles.settings}>
            <Image
              style={styles.accountIcon}
              resizeMode="cover"
              source={Images.accountIcon}
            />
            <Text style={styles.accountText}>Profile Settings</Text>
          </View>
          <TouchableOpacity onPress={()=>{navigation.navigate('ManageDetails')}}>
          <View style={styles.details}>
            <Text style={styles.detailsText}>Manage Details</Text>
            <Image
              style={styles.rightArrowIcon}
              resizeMode="cover"
              source={Images.rigthArrowIcon}
            />
          </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{navigation.navigate('ManagePassword')}}>
          <View style={styles.details}>
            <Text style={styles.detailsText}>Manage Password</Text>
            <Image
              style={styles.rightArrowIcon}
              resizeMode="cover"
              source={Images.rigthArrowIcon}
            />
          </View>
          </TouchableOpacity>
        </View>

        <View style={styles.commonSettings}>
          <View style={styles.settings}>
            <Image
              style={styles.accountIcon}
              resizeMode="cover"
              source={Images.walletIcon}
            />
            <Text style={styles.accountText}>Wallet</Text>
          </View>
          <TouchableOpacity onPress={()=>{navigation.navigate('')}}>
          <View style={styles.details}>
            <Text style={styles.detailsText}>Add card details</Text>
            <Image
              style={styles.rightArrowIcon}
              resizeMode="cover"
              source={Images.rigthArrowIcon}
            />
          </View>
          </TouchableOpacity>
        </View>

        <View style={styles.commonSettings}>
          <View style={styles.settings}>
            <Image
              style={styles.accountIcon}
              resizeMode="cover"
              source={Images.bankIcon}
            />
            <Text style={styles.accountText}>Bank Details</Text>
          </View>
          <TouchableOpacity onPress={()=>{navigation.navigate('')}}>
          <View style={styles.details}>
            <Text style={styles.detailsText}>Add Bank details</Text>
            <Image
              style={styles.rightArrowIcon}
              resizeMode="cover"
              source={Images.rigthArrowIcon}
            />
          </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AccountProfile;

const styles = StyleSheet.create({
  profile: {
    flex: 1,
  },

  profileHeading: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginVertical: hp(0.5),
    alignItems: 'center',
    gap: 1,
  },

  profileSection: {
    flexDirection: 'column',
    marginVertical: hp(1),
    marginHorizontal: wp(10),
  },

  commonSettings: {
    flexDirection: 'column',
    marginVertical: hp(1.5),
  },

  settings: {
    flexDirection: 'row',
    gap: wp(3),
    alignItems: 'center',
  },

  accountIcon: {
    width: wp(3.5),
    height: hp(2),
    tintColor: Colors.sooprsblue,
  },

  accountText: {
    fontWeight: '400',
    fontSize: FSize.fs16,
    fontFamily: 'Roboto',
    color: Colors.sooprsblue,
  },

  details: {
    marginTop: hp(1.5),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },

  detailsText: {
    fontWeight: '400',
    fontSize: FSize.fs14,
    fontFamily: 'Roboto',
    color: Colors.black,
  },

  profileIcon: {
    width: wp(43),
    height: hp(20),
    borderWidth: 2,
    borderColor: Colors.sooprsblue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(30),
    marginBottom: wp(2),
  },
  Icon: {
    width: wp(41),
    height: hp(19),
    borderRadius: wp(30),
  },

  rightArrowIcon: {
    tintColor: Colors.black,
    width: wp(3),
    height: hp(1.5),
  },

  profileName: {
    fontSize: FSize.fs24,
    fontWeight: '600',
    color: Colors.black,
  },
  profileRole: {
    fontSize: FSize.fs12,
    fontWeight: '500',
    color: Colors.gray,
    maxWidth: '90%',
  },
});
