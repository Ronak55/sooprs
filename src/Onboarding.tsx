import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GestureRecognizer from 'react-native-swipe-gestures';
import {CommonActions} from '@react-navigation/native';
import Images from './assets/image';
import {hp, wp} from './assets/commonCSS/GlobalCSS';
import ButtonNew from './components/ButtonNew';
import Toast from 'react-native-toast-message';
import Colors from './assets/commonCSS/Colors';
import FSize from './assets/commonCSS/FSize';

const Onboarding = ({navigation} : {navigation:any}) => {
  const [activeScreen, setActiveScreen] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    const checkUserLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('TOKEN');
        const usertype = await AsyncStorage.getItem('IS_BUYER');
        if (token && usertype) {
          let resetAction = CommonActions.reset({
            index: 0,
            routes: [
              {
                name:
                  JSON.parse(usertype) == 1
                    ? 'ClientLoggedIn'
                    : 'ProfessionalLoggedIn',
              },
            ],
          });
          navigation.dispatch(resetAction);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error reading data from AsyncStorage', error);
        setLoading(false);
      }
    };
    checkUserLoginStatus();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const profiles = [
    {
      id: 1,
      name: 'Professional',
      des: 'Showcase Your Expertise',
      img: Images.Professionallogo,
    },
    {
      id: 2,
      name: 'Client',
      des: 'Elevate Your Business',
      img: Images.Clientlogo,
    },
  ];

  const handleRadioChange = id => {
    setSelectedCard(id);
  };

  const handleButtonPress = action => {
    if (!selectedCard) {
      Toast.show({type: 'info', text1: 'Please select your profile'});
      return;
    }
    navigation.navigate(action, {
      profileType: profiles.find(p => p.id === selectedCard)?.name,
    });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={Images.Sooprslogo} style={styles.logo} />
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={
              activeScreen === 0
                ? Images.OnboardingScreen1
                : activeScreen === 1
                ? Images.OnboardingScreen2
                : Images.OnboardingScreen3
            }
            style={styles.onboardingImage}
          />
        </View>
        <View style={styles.section}>
          <View style={styles.profileSelectionContainer}>
            <View style={styles.gestures}>
              <GestureRecognizer
                style={styles.containerItems}
                onSwipeLeft={() =>
                  activeScreen < 2 && setActiveScreen(activeScreen + 1)
                }
                onSwipeRight={() =>
                  activeScreen > 0 && setActiveScreen(activeScreen - 1)
                }>
                <View style={styles.titleSection}>
                  {activeScreen === 0 ? (
                    <>
                      <Text style={styles.title}>Get Professional</Text>
                      <Text style={styles.subtitle}>
                        Discover a world of opportunities with our Browse Gigs
                      </Text>
                    </>
                  ) : activeScreen === 1 ? (
                    <>
                      <Text style={styles.title}>Browse Gigs</Text>
                      <Text style={styles.subtitle}>
                        Discover a world of opportunities with our Browse Gigs
                        section
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.title}>Find Projects</Text>
                      <Text style={styles.subtitle}>
                        Discover a world of opportunities with our Browse Gigs
                        section.
                      </Text>
                    </>
                  )}
                </View>
                <View style={styles.dotsContainer}>
                  {[0, 1, 2].map(index => (
                    <View
                      key={index}
                      style={[
                        styles.dot,
                        {
                          backgroundColor:
                            activeScreen === index ? '#0077ff' : '#D9D9D9',
                        },
                      ]}
                    />
                  ))}
                </View>
              </GestureRecognizer>
            </View>
            <View style={styles.profileTypes}>
              {profiles.map(profile => (
                <TouchableOpacity
                  key={profile.id}
                  style={[
                    styles.profileCard,
                    {
                      backgroundColor:
                        selectedCard === profile.id ? '#F2F7FF' : '#FFFFFF',
                    },
                  ]}
                  onPress={() => handleRadioChange(profile.id)}>
                  <Image source={profile.img} style={styles.profileImage} />
                  <Text style={styles.profileName}>
                    Join as a {profile.name}
                  </Text>
                  <Text style={styles.profileDescription}>{profile.des}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.actionButtonContainer}>
            <ButtonNew
              btntext="Sign Up"
              bgColor="#FFFFFF"
              textColor="#0077FF"
              isBorder={false}
              onPress={() => handleButtonPress('Signup')}
              imgSource={undefined}
              isDisabled={undefined}
            />
            <Text style={styles.or}>or</Text>
            <ButtonNew
              btntext="Log in"
              bgColor="#0077FF"
              textColor="#FFFFFF"
              onPress={() => handleButtonPress('Login')}
              isBorder={true}
              imgSource={undefined}
              isDisabled={undefined}
            />
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    flex: 1,
    backgroundColor: Colors.white,
    position: 'absolute',
    top: hp(40),
    left: 0,
    right: 0,
    bottom: 0,
    // marginBottom:hp(20)
  },
  container: {flex: 1, backgroundColor: '#fff', paddingHorizontal: wp(6)},
  loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  logoContainer: {alignItems: 'center', marginTop: hp(3)},
  logo: {width: wp(40), height: hp(13), resizeMode: 'contain'},
  containerItems: {alignItems: 'center', justifyContent: 'center'},
  titleSection: {alignItems: 'center', marginTop: hp(2), gap: hp(0.5)},
  title: {fontSize: FSize.fs22, fontWeight: 'bold', color: '#000'},
  subtitle: {
    paddingHorizontal: wp(14),
    fontSize: FSize.fs12,
    color: Colors.gray,
    textAlign: 'center',
  },
  dotsContainer: {flexDirection: 'row', marginVertical: hp(3)},
  dot: {
    height: hp(1),
    width: hp(1),
    borderRadius: hp(0.5),
    marginHorizontal: wp(1),
  },
  imageContainer: {alignItems: 'center', marginVertical: hp(3)},
  onboardingImage: {width: wp(120), height: hp(60), resizeMode: 'contain'},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(3),
  },

  profileSelectionContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginVertical: hp(1),
    marginHorizontal: wp(7),
    // backgroundColor:'red',
  },

  profileTypes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gestures: {
    justifyContent: 'center',
  },

  profileCard: {
    width: wp(42),
    alignItems: 'center',
    paddingHorizontal: wp(2),
    paddingVertical: hp(3),
    borderRadius: 10,
    gap: hp(1),
    borderColor: Colors.gray,
    // backgroundColor:'#F2F7FF',
    borderWidth: 1,
  },
  profileImage: {width: wp(8), height: hp(4), resizeMode: 'contain'},
  // profileImagetwo: {width: wp(16), height: hp(6), resizeMode: 'contain'},
  profileName: {
    fontSize: FSize.fs13,
    fontWeight: 'bold',
    color: '#000',
    marginTop: hp(1),
  },
  profileDescription: {
    fontSize: FSize.fs11,
    color: '#7c7c7c',
    textAlign: 'center',
  },
  actionButtonContainer: {alignItems: 'center', marginTop: hp(1)},
  or: {fontSize: FSize.fs12, color: '#7c7c7c', marginBottom: hp(2)},
});

export default Onboarding;
