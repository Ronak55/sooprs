import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View, Alert, StatusBar} from 'react-native';
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
  const [alertMessage, setAlertMessage] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'India (+91)', value: '+91'},
    {label: 'United States (+1)', value: '+1'},
    {label: 'United Kingdom (+44)', value: '+44'},
    {label: 'Australia (+61)', value: '+61'},
    {label: 'Germany (+49)', value: '+49'},
    {label: 'France (+33)', value: '+33'},
    {label: 'Japan (+81)', value: '+81'},
    {label: 'China (+86)', value: '+86'},
    {label: 'Brazil (+55)', value: '+55'},
  ]);
  const [isProfessional, setIsProfessional] = useState(false);

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

  const handleOnPress = () => {
    // if (!name.trim()) {
    //   showAlert('Invalid Name', 'Please Enter your name');
    //   return;
    // }

    // if (!validateEmail(email.trim())) {
    //   showAlert('Invalid Email', 'Please enter a valid email');
    //   return;
    // }

    // if (!phone.trim()) {
    //   showAlert('Invalid Phone Number', 'Please Enter your phone number');
    //   return;
    // }
    // if (phone.length > 10 || phone.length < 10) {
    //   showAlert('Invalid phone Number', 'Please Enter a valid phone number');
    //   return;
    // }
    // if (!password.trim()) {
    //   showAlert('Invalid Password', 'Please enter password');
    //   return;
    // }
    // if (!validpassword(password.trim())) {
    //   showAlert(
    //     'Invalid Password',
    //     'Password must contain minimum 8 characters, at least 1 letter, 1 number and 1 special character',
    //   );
    //   return;
    // }

    // if (!validpassword(confirmPassword.trim())) {
    //   showAlert(
    //     'Invalid Password',
    //     'Password must contain minimum 8 characters, at least 1 letter, 1 number and 1 special character',
    //   );
    //   return;
    // }

    // if (password !== confirmPassword) {
    //   showAlert('Invalid Password', 'Password do not match');
    //   return;
    // }
    if (profileType === 'Client') {
      navigation.navigate('ClientLoggedIn');
    } else if (profileType === 'Professional') {
      navigation.navigate('ProfessionalLoggedIn');
    }
  };

  // const setccode = val => {
  //   console.log('valll::', val);
  // };

  return (
    <>
    <StatusBar barStyle="dark-content" backgroundColor="white" />
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Sign up</Text>
        <View style={styles.inputContainer}>
          <CInput
            title="Your name"
            name="Enter your full name"
            newlabel={false}
            style={undefined}
            setValue={(val: any) => setName(val)}
            value={name}
            isPassword={false}
            keyboardType={'default'}
          />
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
        onSelectItem={(item) => {
          setCountryCode(item.value);
        }}
        // Adjust the item appearance if needed
        // itemSeparator={true}
      />
            </View>
            <CInput
              title="Mobile"
              name="Enter your mobile number"
              newlabel={true}
              style={{width: '73%'}}
              setValue={(val: React.SetStateAction<string>) => {
                setPhone(val);
              }}
              value={phone}
              isPassword={false}
              keyboardType={'number-pad'}
            />
          </View>

          <CInput
            title="Password"
            name="Input your password"
            newlabel={false}
            style={undefined}
            setValue={(val: React.SetStateAction<string>) => setPassword(val)}
            value={password}
            isPassword={true}
            keyboardType={'default'}
          />

          <CInput
            title="Confirm Password"
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

          <ButtonNew
            imgSource={null}
            btntext="Sign up"
            bgColor="#0077FF"
            textColor="#FFFFFF"
            onPress={handleOnPress}
          />

          <ButtonNew
            imgSource={Images.googleIcon}
            btntext="Continue with Google"
            bgColor="white"
            textColor="black"
            onPress={() => {
              navigation.navigate('Login');
            }}
          />
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
  title: {
    marginHorizontal: wp(10),
    marginVertical: hp(8),
  },
  titleText: {
    fontFamily: 'poppins',
    fontSize: wp(7),
    fontWeight: '600',
    color: Colors.sooprsblue,
  },
  inputContainer: {
    marginTop: hp(4),
    gap: 4,
  },

  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginRight: wp(15),
  },
  countryCodePickerContainer: {
    width: '50%',
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
    fontSize: FSize.fs11,
    textAlign: 'center',
    color: Colors.black,
  },
});
