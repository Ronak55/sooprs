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
import {getDataWithToken} from '../services/mobile-api';
import BankDetails from './BankDetails';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const AccountProfile = ({
  navigation,
  isClient,
  name,
  profileImage,
}: {
  navigation: any;
  isClient: any;
  name: any;
  profileImage: any;
}) => {
  const isFocused = useIsFocused();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    mobile: '',
    city: '',
    address: '',
    pincode: '',
    country: '',
    organisation: '',
    linkedin: '',
    about: '',
    profileImage: '',
    portfolioDetails: '',
    bankDetails: '',
  });

  const [servicesList, setServices] = useState([]);
  const [slug, setSlug] = useState('');
  const [resume, setResume] = useState('');
  const [experience, setExperience] = useState({});
  const [skillsList, setSkills] = useState('');
  const [academicDetails, setAcademicDetails] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getDataWithToken(mobile_siteConfig.USER_DETAILS);

        if (response?.data) {
          console.log('get user details response:::::::', response?.data);
          const data = response?.data;
          setUserData({
            name: data?.name,
            email: data?.email,
            mobile: data?.mobile,
            city: data?.city,
            address: data?.address,
            pincode: data?.area_code,
            country: data?.country,
            organisation: data?.organisation,
            linkedin: data?.linkedin,
            about: data?.listing_about,
            profileImage: data?.image,
            portfolioDetails: data?.portfolio_details,
            bankDetails: data?.bank_details,
          });

          const servicesArray = data?.services
            ? data?.services.split(',').map(service => service)
            : [];

          const skillsArray = data?.skills
            ? data?.skills.split(',').map(skill => skill)
            : [];
          // console.log('services array::::', servicesArray)
          setServices(servicesArray);
          setExperience(data?.experience_details);
          setResume(data?.resume);
          setAcademicDetails(data?.academic_details);
          setSkills(skillsArray);
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    const getSlug = async () => {
      const slug = await AsyncStorage.getItem(mobile_siteConfig.SLUG);
      const parsedSlug = JSON.parse(slug);
      setSlug(parsedSlug);
    };

    if (isFocused) {
      fetchUserData();
      getSlug();
    }
  }, [isFocused]);

  const confirmLogout = async () => {
    try {
      // Remove token and buyer status from AsyncStorage
      await AsyncStorage.removeItem(mobile_siteConfig.TOKEN);
      await AsyncStorage.removeItem(mobile_siteConfig.IS_BUYER);
      // Set login status to FALSE
      await AsyncStorage.setItem(mobile_siteConfig.IS_LOGIN, 'FALSE');

      // Reset navigation stack to Authentication screen
      const reset = CommonActions.reset({
        index: 0,
        routes: [{name: 'Authentication'}],
      });
      navigation.dispatch(reset);

      console.log('User successfully logged out.');
    } catch (error) {
      console.error('Logout Error: ', error);
      Alert.alert(
        'Error',
        'An error occurred while logging out. Please try again.',
      );
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'No',
        onPress: () => console.log('Logout cancelled'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await confirmLogout();
          } catch (error) {
            console.error('Error confirming logout: ', error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.profile}>
      <View style={styles.profileHeading}>
        <Image
          style={styles.Icon}
          resizeMode="cover"
          source={
            userData?.profileImage
              ? {uri: userData?.profileImage}
              : Images.defaultPicIcon
          }
        />
        <Text style={styles.profileName}>
          {userData?.name ? userData?.name : 'User'}
        </Text>
        {/* <Text style={styles.profileRole}>{role ? role : 'Role'}</Text> */}
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
              navigation.navigate('ManageDetails', {
                name: userData.name,
                profileImage: userData.profileImage,
                email: userData.email,
                mobile: userData.mobile,
                city: userData.city,
                address: userData.address,
                pincode: userData.pincode,
                country: userData.country,
                organisation: userData.organisation,
                linkedin: userData.linkedin,
                about: userData.about,
              });
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
        {!isClient && (
          <>
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
                  navigation.navigate('BankDetails', {
                    bankDetails: userData.bankDetails,
                  });
                }}>
                <View style={styles.details}>
                  <Text style={styles.detailsText}>Manage Bank details</Text>
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
                  navigation.navigate('ManagePortfolio', {
                    portfolioDetails: userData.portfolioDetails,
                  });
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
                  navigation.navigate('AddSkills', {skillsList});
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
                  navigation.navigate('ManageExperience', {experience});
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
                  navigation.navigate('AddServices', {servicesList});
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
            <View style={styles.commonSettings}>
              <View style={styles.settings}>
                <Image
                  style={styles.accountIcon}
                  resizeMode="cover"
                  source={Images.resumeIcon}
                />
                <Text style={styles.accountText}>Resume</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ManageResume', {resume});
                }}>
                <View style={styles.details}>
                  <Text style={styles.detailsText}>Resume</Text>
                  <Image
                    style={styles.rightArrowIcon}
                    resizeMode="cover"
                    source={Images.rigthArrowIcon}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ManageAcademics', {academicDetails});
                }}>
                <View style={styles.details}>
                  <Text style={styles.detailsText}>Academics</Text>
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
        <View style={styles.commonSettings}>
          <View style={styles.settings}>
            <Image
              style={styles.accountIcon}
              resizeMode="cover"
              source={Images.referIcon}
            />
            <Text style={styles.accountText}>Refer & Earn</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Refer', {slug: slug});
            }}>
            <View style={styles.details}>
              <Text style={styles.detailsText}>Refer a friend</Text>
              <Image
                style={styles.rightArrowIcon}
                resizeMode="cover"
                source={Images.rigthArrowIcon}
              />
            </View>
          </TouchableOpacity>
        </View>
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

  Icon: {
    width: wp(38),
    height: hp(18),
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
    padding: hp(1.7),
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
