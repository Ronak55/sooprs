import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FSize from '../assets/commonCSS/FSize';
import Colors from '../assets/commonCSS/Colors';
import Images from '../assets/image';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions, useIsFocused} from '@react-navigation/native';
import {mobile_siteConfig} from '../services/mobile-siteConfig';
import ButtonNew from './ButtonNew';

const AccountProfile = ({
  navigation,
  isClient,
}: {
  navigation: any;
  isClient: any;
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [profileImage, setProfileImage] = useState(Images.profileImage);
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadProfileDetails = async () => {
      try {
        const storedDetails = await AsyncStorage.getItem('profileDetails');

        const name = await AsyncStorage.getItem(mobile_siteConfig.NAME);

        const parsedName = JSON.parse(name);

        if (storedDetails !== null) {
          const {role, profileImage} = JSON.parse(storedDetails);

          setName(parsedName);
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

  const confirmLogout = async () => {
    await AsyncStorage.removeItem(mobile_siteConfig.TOKEN);
    await AsyncStorage.setItem(mobile_siteConfig.IS_LOGIN, 'FALSE');
    let reset = CommonActions.reset({
      index: 0,
      routes: [{name: 'Authentication'}],
    });
    navigation.dispatch(reset);
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure want to logout?', [
      {
        text: 'No',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => confirmLogout(),
        style: 'cancel',
      },
    ]);
  };

  return (
    <View style={styles.profile}>
      <View style={styles.profileHeading}>
        <View style={[styles.profileIcon]}>
          <Image style={styles.Icon} resizeMode="cover" source={profileImage} />
        </View>
        <Text style={styles.profileName}>{name ? name : 'User'}</Text>
        <Text style={styles.profileRole}>{role ? role : 'Role'}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.profileSection}>
        <View style={styles.commonSettings}>
          <View style={styles.settings}>
            <Image
              style={styles.accountIcon}
              resizeMode="cover"
              source={Images.accountIcon}
            />
            <Text style={styles.accountText}>Profile Settings</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ManageDetails');
            }}>
            <View style={styles.details}>
              <Text style={styles.detailsText}>Manage Details</Text>
              <Image
                style={styles.rightArrowIcon}
                resizeMode="cover"
                source={Images.rigthArrowIcon}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ManagePassword');
            }}>
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
              source={Images.bankIcon}
            />
            <Text style={styles.accountText}>Bank Details</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('BankDetails');
            }}>
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
        {!isClient && (
          <>
            <View style={styles.commonSettings}>
              <View style={styles.settings}>
                <Image
                  style={styles.accountIcon}
                  resizeMode="cover"
                  source={Images.walletIcon}
                />
                <Text style={styles.accountText}>Wallet</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('AddCredits');
                }}>
                <View style={styles.details}>
                  <Text style={styles.detailsText}>Add credits</Text>
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
                <Text style={styles.accountText}>Portfolio</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ManagePortfolio');
                }}>
                <View style={styles.details}>
                  <Text style={styles.detailsText}>Manage Portfolio</Text>
                  <Image
                    style={styles.rightArrowIcon}
                    resizeMode="cover"
                    source={Images.rigthArrowIcon}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('AddSkills');
                }}>
                <View style={styles.details}>
                  <Text style={styles.detailsText}>Skills</Text>
                  <Image
                    style={styles.rightArrowIcon}
                    resizeMode="cover"
                    source={Images.rigthArrowIcon}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ManageExperience');
                }}>
                <View style={styles.details}>
                  <Text style={styles.detailsText}>Experience</Text>
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
                <Text style={styles.accountText}>Lead Settings</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('AddServices');
                }}>
                <View style={styles.details}>
                  <Text style={styles.detailsText}>Manage Services</Text>
                  <Image
                    style={styles.rightArrowIcon}
                    resizeMode="cover"
                    source={Images.rigthArrowIcon}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
        <View style={styles.logout}>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Image source={Images.logoutIcon} style={styles.icon} />
            <Text style={styles.text}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    // marginVertical: hp(1),
    marginBottom: hp(5),
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

  logout: {
    marginVertical: hp(2),
    marginHorizontal: wp(17),
    
  },


  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    padding: hp(2),
    borderRadius: wp(3),
    justifyContent: 'center',
    
  },
  icon: {
    width: wp(4),
    height: hp(2),
    marginRight: wp(2),
  },
  text: {
    color: 'white',
    fontSize: FSize.fs14,
    fontWeight: 'bold',
  },
});
