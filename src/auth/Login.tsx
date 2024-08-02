import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  StatusBar,

} from 'react-native';

import Images from '../assets/image';

import {hp, wp} from '../assets/commonCSS/GlobalCSS';

import Colors from '../assets/commonCSS/Colors';

import React, {useState} from 'react';

import CInput from '../components/CInput';

import ButtonNew from '../components/ButtonNew';

import CustomAlert from '../components/CustomAlert';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Login = ({navigation, route}: {navigation: any, route:any}) => {

  // const {profileType} = route.params;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

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
    if (!validateEmail(email.trim())) {
      showAlert('Invalid Email', 'Please enter a valid email');
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

    // if(profileType === 'Client'){

    //     navigation.navigate('ClientLoggedIn');

    // } else if(profileType === 'Professional'){

    //     navigation.navigate('ProfessionalLoggedIn');
    // }
  };

  return (
    <>
    <StatusBar barStyle="dark-content" backgroundColor="white" />
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={Images.Sooprslogo} style={styles.img} />
      </View>
      <View style={styles.section}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Login</Text>
        </View>
        <View style={styles.inputContainer}>
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
        </View>
        <View style={{}}>
        <ButtonNew
            imgSource={null}
            btntext="Login"
            bgColor="#0077FF"
            textColor="#FFFFFF"
            onPress={handleOnPress}
          />
          <TouchableOpacity style={styles.forgotPassword} onPress={()=>{navigation.navigate('Forgot')}}>
               <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
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

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  title: {
    marginVertical: hp(4),
  },
  titleText: {
    fontFamily: 'poppins',
    fontSize: wp(6.5),
    fontWeight: '600',
    color: Colors.sooprsblue,
  },

  imageContainer: {
    backgroundColor: 'rgba(64, 123, 255, 0.11)',
    width: wp(100),
    height: hp(37),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: wp(25),
    borderBottomRightRadius: wp(25),
  },

  img: {
    objectFit: 'contain',
    width: wp(70),
  },

  section: {
    marginHorizontal: wp(10),
    marginVertical: hp(3),
  },

  inputContainer:{
    gap:1
  },

  forgotPassword:{

    alignItems:'center',
    marginBottom:15
  },

  forgotText:{

    fontFamily:'inter',
    fontWeight:'800',
    fontSize:wp(3),
    color:Colors.sooprsblue
  },

});
