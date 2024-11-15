import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  StatusBar,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import Colors from '../assets/commonCSS/Colors';
import CInput from '../components/CInput';
import {CommonActions, useIsFocused} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ButtonNew from '../components/ButtonNew';
import Images from '../assets/image';
import CustomAlert from '../components/CustomAlert';
import FSize from '../assets/commonCSS/FSize';
import {
  storeDataToAsyncStorage,
  validateEmail,
  validatePhoneNumber,
} from '../services/CommonFunction';
import {mobile_siteConfig} from '../services/mobile-siteConfig';
import countryCodes from '../countries_codes.json';
import {postData} from '../services/mobile-api';
import Toast from 'react-native-toast-message';

const Signup = ({navigation, route}: {navigation: any; route: any}) => {
  const {profileType} = route.params;
  const isFocused = useIsFocused();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [country, setCountry] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [isProfessional, setIsProfessional] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setItems(countryCodes);
  }, []);

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const validpassword = (pass: string) => {
    return pass?.match(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    );
  };

  const handleOnPress = () => {
    if (!name.trim()) {
      showAlert('Invalid Name', 'Please Enter your name');
      return;
    }

    if (!validateEmail(email.trim())) {
      showAlert('Invalid Email', 'Please enter a valid email');
      return;
    }

    if (!phone.trim()) {
      showAlert('Invalid Phone Number', 'Please Enter your phone number');
      return;
    }
    if (phone.length > 10 || phone.length < 10) {
      showAlert('Invalid phone Number', 'Please Enter a valid phone number');
      return;
    }
    if (!password.trim()) {
      showAlert('Invalid Password', 'Please enter password');
      return;
    }
    if (!validpassword(password.trim())) {
      showAlert(
        'Invalid Password',
        'Password must contain minimum 8 characters, at least 1 letter, 1 number and 1 special character',
      );
      return;
    }

    if (!validpassword(confirmPassword.trim())) {
      showAlert(
        'Invalid Password',
        'Password must contain minimum 8 characters, at least 1 letter, 1 number and 1 special character',
      );
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Invalid Password', 'Password do not match');
      return;
    }

    const payload = {
      is_buyer: profileType === 'Client' ? 1 : 0,
      name: name,
      email: email,
      country: country,
      countryCode: countryCode,
      mobile: phone,
      password: password,
      repeatPassword: confirmPassword,
    };

    postData(payload, mobile_siteConfig.REGISTER)
      .then(response => {
        if (response.msg === 'ok' || response.status === 200) {
          console.log('Success:::::', response);

          // Show success message
          Toast.show({
            type: 'success',
            text1: 'Registration Successful',
            text2: 'You have registered successfully!',
            position: 'top',
          });

          storeDataToAsyncStorage(mobile_siteConfig.IS_LOGIN, 'TRUE');
          storeDataToAsyncStorage(mobile_siteConfig.EMAIL, email);
          storeDataToAsyncStorage(mobile_siteConfig.NAME, name);
          // let resetAction = CommonActions.reset({
          //   index: 0,
          //   routes: [
          //     { name: profileType === 'Client' ? 'ClientLoggedIn' : 'ProfessionalLoggedIn' }
          //   ],
          // });
          navigation.navigate('Login', {profileType: profileType});
        } else if (response.status === 400) {
          console.log('Failure:::::', response);
          // Show error message for status 400
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Registration failed. Please try again.',
            position: 'top',
          });
        }
      })
      .catch(error => {
        console.error('Error:', error.message);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong. Please try again.',
          position: 'top',
        });
      });
  };

  // const setccode = val => {
  //   console.log('valll::', val);
  // };

  const signupWithGoogle = ()=>{

  }

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
            <Text style={styles.titleText}>Sign Up</Text>
            <Text style={styles.subTitleText}>
              Discover a world of opportunities on Sooprs
            </Text>
            {/* <ButtonNew
              imgSource={Images.googleIcon}
              btntext="Continue with Google"
              bgColor="#F6F6F6"
              textColor="black"
              onPress={signupWithGoogle}
              isBorder={undefined}
              isDisabled={undefined}
            />
            <View style={styles.orSection}>
              <View style={styles.line} />
              <Text style={styles.or}>or</Text>
              <View style={styles.line} />
            </View> */}
          </View>
          {/* <View style={styles.inputContainer}>
            <CInput
              title="Email address"
              name="Enter your email address"
              newlabel={false}
              style={undefined}
              setValue={(val: any) => setEmail(val)}
              value={email}
              isPassword={false}
              keyboardType={'default'}
            />

            <CInput
              title="Password"
              name="Enter your password"
              newlabel={false}
              style={undefined}
              setValue={(val: React.SetStateAction<string>) => setPassword(val)}
              value={password}
              isPassword={true}
              keyboardType={'default'}
            />
          </View> */}
            <View style={styles.inputContainer}>
            <CInput
              title=""
              name="Enter your full name"
              newlabel={false}
              style={undefined}
              setValue={(val: any) => setName(val)}
              value={name}
              isPassword={false}
              keyboardType={'default'}
            />
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
            <View style={styles.phoneContainer}>
              <View style={styles.countryCodePickerContainer}>
                <DropDownPicker
                  open={open}
                  value={countryCode}
                  items={items}
                  setOpen={setOpen}
                  setValue={setCountryCode}
                  setItems={setItems} // Uncomment if you need to update items dynamically
                  style={styles.countryCodePickerStyle}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  placeholder="Select your country code"
                  labelStyle={styles.labelStyle}
                  containerStyle={styles.countryCodePicker}
                  textStyle={styles.countryCodeTextStyle}
                  onSelectItem={item => {
                    setCountryCode(item.value);
                    setCountry(item.label.split('(')[0].trim());
                  }}
                  // Adjust the item appearance if needed
                  // itemSeparator={true}
                />
              </View>
              <CInput
                title=""
                name="Enter your phone no."
                newlabel={true}
                style={{width: '70%'}}
                setValue={(val: React.SetStateAction<string>) => {
                  setPhone(val);
                }}
                value={phone}
                isPassword={false}
                keyboardType={'number-pad'}
              />
            </View>

            <CInput
              title=""
              name="Input your password"
              newlabel={false}
              style={undefined}
              setValue={(val: React.SetStateAction<string>) => setPassword(val)}
              value={password}
              isPassword={true}
              keyboardType={'default'}
            />

            <CInput
              title=""
              name="Confirm your password"
              newlabel={false}
              style={undefined}
              setValue={(val: React.SetStateAction<string>) => {
                setConfirmPassword(val);
              }}
              value={confirmPassword}
              isPassword={true}
              keyboardType={'default'}
            />
          </View>
          <View style={styles.buttons}>
            <ButtonNew
              imgSource={null}
              btntext={
                loading ? <ActivityIndicator color={Colors.white} /> : 'Sign up'
              }
              bgColor={Colors.sooprsblue}
              textColor={Colors.white}
              onPress={handleOnPress}
              isBorder={true}
              isDisabled={loading}
            />
            <View style={styles.forgotSection}>
              <Text style={styles.forgotyourPass}>Already have an account?</Text>
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => {
                  navigation.navigate('Login', {profileType: profileType === 'Client' ? 1 : 0});
                }}>
                <Text style={styles.forgotText}>Login</Text>
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

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginRight: wp(15),
  },
  countryCodePickerContainer: {
    width: '50%',
    height: '105%',
  },
  countryCodePicker: {
    height: hp(5),
  },
  countryCodePickerStyle: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    height: hp(4),
  },
  dropDownContainerStyle: {
    borderWidth: 1,
    flexDirection: 'row',
    borderColor: 'gray',
  },

  countryCodeTextStyle: {
    fontSize: FSize.fs10,
    textAlign: 'center',
  },

  labelStyle: {
    fontSize: FSize.fs14,
    textAlign: 'center',
    color: Colors.black,
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
    marginBottom: hp(5),
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
    gap: hp(1.2),
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
    marginTop: hp(4),
    gap: hp(1),
  },

  forgotPassword: {
    alignItems: 'center',
    // marginBottom: 15,
    justifyContent: 'center',
  },

  forgotyourPass: {
    fontFamily: 'inter',
    fontWeight: '700',
    color: Colors.black,
    fontSize: FSize.fs14,
  },

  forgotText: {
    fontFamily: 'inter',
    fontWeight: '800',
    fontSize: FSize.fs14,
    color: Colors.sooprsblue,
    textDecorationLine: 'underline',
  },
});
