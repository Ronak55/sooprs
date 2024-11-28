import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import Images from '../assets/image';

import {hp, wp} from '../assets/commonCSS/GlobalCSS';

import Colors from '../assets/commonCSS/Colors';

import React, {useEffect, useState} from 'react';

import CInput from '../components/CInput';

import ButtonNew from '../components/ButtonNew';

import CustomAlert from '../components/CustomAlert';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {mobile_siteConfig} from '../services/mobile-siteConfig';
import {postData} from '../services/mobile-api';
import Toast from 'react-native-toast-message';
import {storeDataToAsyncStorage} from '../services/CommonFunction';
import {CommonActions, useIsFocused} from '@react-navigation/native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FSize from '../assets/commonCSS/FSize';
import {login} from '../redux/slices/authSlice';

const Login = ({navigation, route}: {navigation: any; route: any}) => {
  const {profileType} = route?.params;
  // const [email, setEmail] = useState('2shaaar.clicked@gmail.com');
  // const [password, setPassword] = useState('@Heartcliff123');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, isLoading] = useState(false);
  const [googleLoading, setgoogleLoading] = useState(false)

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '711271604841-bhp00rb7b4c804a65gvginlf0hq3tfj7.apps.googleusercontent.com',
    });
  }, []);

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const validateEmail = (email: string) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
  };

  const validpassword = (pass: string) => {
    return pass?.match(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    );
  };

  const signInWithGoogle = async () => {
    setgoogleLoading(true);

    try {
      
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const formData = new FormData();
      console.log('userinfo:::::::::', userInfo);
      const idToken = userInfo?.data?.idToken;
      const fcmToken = await AsyncStorage.getItem(mobile_siteConfig.fcmToken);
      // console.log('fcm token::::::::::', fcmToken);
      // console.log('id token:::::::::', idToken);

      formData.append('token', idToken);
      formData.append('fcm_token', fcmToken);

      console.log('formdata for google:::::::::', formData);

      fetch('https://sooprs.com/api2/public/index.php/app-google-login', {
        method: 'POST',
        body: formData,
      })
        .then(res => res.json())
        .then(async res => {
          console.log('google login respose::::::::::', res);
          if (res.status == 200) {
            console.log('client or prof::::::::', res?.is_buyer);
            const googleProfile =
              res?.is_buyer == 0 ? 'Professional' : 'Client';
            // const profile = JSON.stringify(profileType);

            console.log(
              'check professional client first:::::::::',
              googleProfile,
              typeof googleProfile,
            );
            console.log('check professional client:::::::::', profileType);

            if (googleProfile !== profileType) {
              console.log('helllllllllllllo');
              setgoogleLoading(false);
              Toast.show({
                type: 'error',
                text1: 'Invalid Credentials',
                text2: 'Please login using your registered id',
                position: 'top',
              });
            } else {
              console.log('loggedinhelllllllllooooooo');
              storeDataToAsyncStorage(mobile_siteConfig.IS_LOGIN, 'TRUE');
              storeDataToAsyncStorage(mobile_siteConfig.UID, res?.user_id);
              storeDataToAsyncStorage(mobile_siteConfig.TOKEN, res?.token);
              storeDataToAsyncStorage(mobile_siteConfig.EMAIL, email);
              storeDataToAsyncStorage(mobile_siteConfig.NAME, res?.name);
              storeDataToAsyncStorage(mobile_siteConfig.SLUG, res?.slug);
              storeDataToAsyncStorage(
                mobile_siteConfig.IS_BUYER,
                res?.is_buyer,
              );
              storeDataToAsyncStorage(
                mobile_siteConfig.PROFILE_PIC,
                res?.profile_pic,
              );

              Toast.show({
                type: 'success',
                text1: 'Login Successful',
                text2: 'You have loggedin successfully!',
                position: 'top',
                text1Style: { fontSize: 16, fontWeight: '600' },
                text2Style: { fontSize: 14, color: '#666' },
              });

              setgoogleLoading(false);

              let resetAction = CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name:
                      res?.is_buyer === '1'
                        ? 'ClientLoggedIn'
                        : 'ProfessionalLoggedIn',
                  },
                ],
              });
              navigation.dispatch(resetAction);
            }
          } else if (res.status == 400) {
            console.log('response token:::::::::::', res);
            Toast.show({
              type: 'error',
              text2: res.msg || 'Google Signin failed. Please try again.',
              position: 'top',
              text1Style: { fontSize: 16, fontWeight: '600' },
              text2Style: { fontSize: 14, color: '#666' },
            });
            setgoogleLoading(false);
          }
        });
    } catch (error) {
      console.log('Sign-In Error:', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Sign-In Cancelled', 'User cancelled the login flow');
        setgoogleLoading(false);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign-In In Progress', 'Operation is already in progress');
        setgoogleLoading(false);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert(
          'Play Services Not Available',
          'Play Services are not available or outdated',
        );
        setgoogleLoading(false);
      } else {
        console.log('error google:::::::::', error);
        Alert.alert('Sign-In Error', 'An error occurred during sign-in');
        setgoogleLoading(false);
      }
      setgoogleLoading(false);
    }
  };

  const handleOnPress = async () => {
    isLoading(true);

    if (!validateEmail(email.trim())) {
      showAlert('Invalid Email', 'Please enter a valid email');
      return;
    }

    if (!password.trim()) {
      showAlert('Invalid Password', 'Please enter password');
      return;
    }

    // if (!validpassword(password.trim())) {
    //   showAlert(
    //     'Invalid Password',
    //     'Password must contain minimum 8 characters, at least 1 letter, 1 number and 1 special character',
    //   );
    //   return;
    // }
    const fcmToken = await AsyncStorage.getItem(mobile_siteConfig.fcmToken);

    console.log('fcm token get login::::', fcmToken);

    const payload = {
      email: email,
      password: password,
      fcm_token: fcmToken,
    };

    postData(payload, mobile_siteConfig.LOGIN)
      .then((response: any) => {
        if (response.status == 200 || response.msg === 'Login successful!') {
          console.log('response token:::::::::::', response);

          const googleProfile =
            response?.is_buyer == 0 ? 'Professional' : 'Client';
          // const profile = JSON.stringify(profileType);

          if (googleProfile !== profileType) {
            isLoading(false);
            Toast.show({
              type: 'error',
              text1: 'Invalid Credentials',
              text2: 'Please login using your registered ID',
              position: 'top',
              text1Style: { fontSize: 16, fontWeight: '600', color: '#d9534f' }, // Elegant error title
              text2Style: { fontSize: 14, color: '#999' }, // Softer error details
            });
            
          } else {
             
            storeDataToAsyncStorage(mobile_siteConfig.IS_LOGIN, 'TRUE');
            storeDataToAsyncStorage(mobile_siteConfig.TOKEN, response?.token);
            storeDataToAsyncStorage(mobile_siteConfig.UID, JSON.parse(response?.user_id));
            storeDataToAsyncStorage(mobile_siteConfig.EMAIL, email);
            storeDataToAsyncStorage(mobile_siteConfig.NAME, response.name);
            storeDataToAsyncStorage(mobile_siteConfig.SLUG, response?.slug);
            storeDataToAsyncStorage(
              mobile_siteConfig.IS_BUYER,
              response?.is_buyer,
            );
            storeDataToAsyncStorage(
              mobile_siteConfig.PROFILE_PIC,
              response?.profile_pic,
            );
            storeDataToAsyncStorage(mobile_siteConfig.PASSWORD, password)
            isLoading(false);

            Toast.show({
              type: 'success',
              text1: 'Login Successful',
              text2: 'You have loggedin successfully!',
              position: 'top',
            });


            let resetAction = CommonActions.reset({
              index: 0,
              routes: [
                {
                  name:
                    profileType === 'Client'
                      ? 'ClientLoggedIn'
                      : 'ProfessionalLoggedIn',
                },
              ],
            });
            navigation.dispatch(resetAction);
          }
        } else if (response.status == 400) {
          // Show error message for status 400
          console.log('response token:::::::::::', response);
          Toast.show({
            type: 'error',
            text1: 'Incorrect Password',
            text2: response.msg || 'Login failed. Please try again.',
            position: 'top',
            text1Style: { fontSize: 16, fontWeight: '600' },
            text2Style: { fontSize: 14, color: '#666' },
          });

          isLoading(false);
        }
      })
      .catch(error => {
        console.error('Error:', error.message);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong. Please try again.',
          position: 'top',
          text1Style: { fontSize: 16, fontWeight: '600' },
          text2Style: { fontSize: 14, color: '#666' },
        });
        isLoading(false);
      });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <KeyboardAwareScrollView style={styles.container}>
        <View style={styles.headerSection}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={Images.backArrow}
              resizeMode="contain"
              style={styles.backArrow}
            />
          </TouchableOpacity>
          <Image source={Images.Sooprslogo} style={styles.img} />
        </View>
        <View style={styles.section}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Login</Text>
            <Text style={styles.subTitleText}>
              Discover a world of opportunities on Sooprs
            </Text>
            <ButtonNew
              imgSource={googleLoading ? '' : Images.googleIcon}
              btntext={
                googleLoading ? (
                  <ActivityIndicator color={Colors.black} />
                ) : (
                  'Continue with Google'
                )
              }
              bgColor="#F6F6F6"
              textColor="black"
              onPress={signInWithGoogle}
              isDisabled={googleLoading}
            />

            <View style={styles.orSection}>
              <View style={styles.line} />
              <Text style={styles.or}>or</Text>
              <View style={styles.line} />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <CInput
              title=""
              name="Enter your email address"
              newlabel={false}
              style={undefined}
              setValue={(val: any) => setEmail(val)}
              value={email}
              isPassword={false}
              keyboardType={'default'}
            />

            <CInput
              title=""
              name="Enter your password"
              newlabel={false}
              style={undefined}
              setValue={(val: React.SetStateAction<string>) => setPassword(val)}
              value={password}
              isPassword={true}
              keyboardType={'default'}
            />
          </View>
          <View style={styles.buttons}>
            <ButtonNew
              imgSource={null}
              btntext={
                loading ? <ActivityIndicator color={Colors.white} /> : 'Sign in'
              }
              bgColor={Colors.sooprsblue}
              textColor={Colors.white}
              onPress={handleOnPress}
              isBorder={true}
              isDisabled={loading}
            />
            <View style={styles.forgotSection}>
              <Text style={styles.forgotyourPass}>Don’t have an account?</Text>
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => {
                  navigation.navigate('Signup', {
                    profileType: profileType === 'Client' ? 1 : 0,
                  });
                }}>
                <Text style={styles.forgotText}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <CustomAlert
          isVisible={alertVisible}
          onClose={() => setAlertVisible(false)}
          title={alertTitle}
          message={alertMessage}
        />
      </KeyboardAwareScrollView>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  headerSection: {
    marginHorizontal: wp(5),
    marginVertical: hp(2),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(13),
  },
  backArrow: {
    width: wp(8),
    height: hp(8),
  },
  headerTitle: {
    color: Colors.black,
    fontWeight: '600',
    fontSize: FSize.fs18,
  },

  buttons: {
    flexDirection: 'column',
  },

  orSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    marginVertical: hp(3),
  },

  line: {
    width: wp(30),
    borderWidth: wp(0.1),
    borderColor: '#D9D9D9',
  },

  or: {
    fontFamily: 'poppins',
    fontWeight: '400',
    fontSize: FSize.fs16,
    color: Colors.black,
  },

  title: {
    flexDirection: 'column',
    gap: hp(0.7),
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'poppins',
    fontSize: FSize.fs22,
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.black,
  },

  subTitleText: {
    marginHorizontal: wp(10),
    fontFamily: 'poppins',
    textAlign: 'center',
    marginBottom: hp(3),
    fontSize: FSize.fs14,
    color: '#999999',
  },

  forgotSection: {
    flexDirection: 'row',
    gap: wp(2),
    marginTop: hp(3),
    // alignItems:'center',
    justifyContent: 'center',
  },

  img: {
    objectFit: 'contain',
    width: wp(50),
  },

  section: {
    marginHorizontal: wp(10),
    // marginVertical: hp(1),
  },

  inputContainer: {
    gap: 1,
  },

  forgotPassword: {
    alignItems: 'center',
    // marginBottom: 15,
    justifyContent: 'center',
  },

  forgotyourPass: {
    fontFamily: 'inter',
    fontWeight: '600',
    color: Colors.black,
    fontSize: FSize.fs14,
  },

  forgotText: {
    fontFamily: 'inter',
    fontWeight: '700',
    fontSize: FSize.fs14,
    color: Colors.sooprsblue,
    textDecorationLine: 'underline',
  },
});
