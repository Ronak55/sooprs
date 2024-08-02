import {Image, Keyboard, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Images from '../assets/image';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import ButtonNew from '../components/ButtonNew';
import Colors from '../assets/commonCSS/Colors';
import CInput from '../components/CInput';
import CustomAlert from '../components/CustomAlert';
import Password from '../components/Password';
import OTPTextView from 'react-native-otp-textinput';
import FSize from '../assets/commonCSS/FSize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ForgotPassword = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState('');
  const [isEmailSubmit, setIsEmailSubmit] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [otp, setOtp] = useState('');
  const [resend, setResend] = useState(false);
  const [otpView, setOtpView] = useState(false);
  const [newPasswordScreen, setNewPasswordScreen] = useState(false);
  const [newPassword, setnewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');


  const validateEmail = (email: string) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
  };

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const EmailhandlePress = () => {
    // if (!validateEmail(email.trim())) {
    //   showAlert('Invalid Email', 'Please enter a valid email');
    //   return;
    // }

    setIsEmailSubmit(!isEmailSubmit);
    setOtpView(!otpView);
  };

  const OtphandlePress = ()=>{


    if(otp !== '12345'){

        setResend(!resend);

    } else{
        
        setNewPasswordScreen(!newPasswordScreen);
        setOtpView(!otpView);
        

    }

    if(newPasswordScreen){

      navigation.navigate('Success', {
        successMessage: 'Your password has been updated successfully',
        btnText: 'Login',
        navigateTo: 'Login'
      });


    }
   

  }

  return (

    <>
    <StatusBar barStyle="dark-content" backgroundColor="white" />
    <KeyboardAwareScrollView style={styles.container}>
      <Password desc="Enter your registered email below to recieve password reset instructions" />
      <View style={styles.emailBox}>
        {!isEmailSubmit && 
          <CInput
            title="Email address"
            newlabel={false}
            name="Enter your email address"
            style={undefined}
            setValue={(val: any) => setEmail(val)}
            value={email}
            isPassword={false}
            keyboardType={'default'}
          />
        }
        
        { otpView && 
          <OTPTextView
            containerStyle={styles.textInputContainer}
            handleTextChange={text => setOtp(text)}
            tintColor={Colors.sooprsblue}
            inputCount={5}
            keyboardType="numeric"
          />
    
         }
        {resend && (
          <TouchableOpacity style={styles.resendButton}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        )}

        {newPasswordScreen && <><CInput
            title="Password"
            name="Enter New Password"
            newlabel={false}
            style={undefined}
            setValue={(val: React.SetStateAction<string>) => setnewPassword(val)}
            value={newPassword}
            isPassword={true}
            keyboardType={'default'}
          />

          <CInput
            title="Re-Enter New Password"
            name="Confirm your new password"
            newlabel={false}
            style={undefined}
            setValue={(val: React.SetStateAction<string>) => {
              setConfirmNewPassword(val);
            }}
            value={confirmNewPassword}
            isPassword={true}
            keyboardType={'default'}
          />
          </>
          }
        <ButtonNew
          imgSource={null}
          btntext="Submit"
          bgColor="#0077FF"
          textColor="#FFFFFF"
          onPress={!isEmailSubmit ? EmailhandlePress : OtphandlePress}
        />
      </View>
      <View style={styles.rememberPassword}>
        <Text style={styles.rememberText}>Remember your password?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
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

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  section: {
    marginHorizontal: wp(40),
    marginVertical: hp(5),
  },

  imageStyle: {
    width: wp(20),
    height: hp(10),
    marginTop: hp(12),
  },

  forgotText: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: wp(10),
    width: wp(80),
  },

  resendButton:{
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#407BFF',
    width: wp(30),
    alignItems:'center',
    justifyContent:'center',
    height: hp(5),
    borderRadius: wp(2),
    marginHorizontal:wp(25),
    marginBottom:hp(3)
    
  },

  resendText:{
    color: "#0077FF",
    fontWeight: '500',
  },

  textInputContainer: {
    marginHorizontal: wp(6),
    marginVertical: hp(6),
  },

  titleText: {
    fontFamily: 'inter',
    fontWeight: '700',
    fontSize: FSize.fs18,
    color: Colors.black,
  },

  titleDesc: {
    marginTop: hp(2),
    color: Colors.gray,
    fontFamily: 'inter',
    fontSize: FSize.fs13,
    fontWeight: '400',
    textAlign: 'center',
  },

  emailBox: {
    marginHorizontal: wp(10),
    marginVertical: hp(5),
  },

  rememberPassword: {
    flexDirection: 'row',
    gap: 3,
    justifyContent: 'center',
  },

  rememberText: {
    // marginLeft:wp(25),
    fontFamily: 'inter',
    fontSize: FSize.fs14,
    fontWeight: '800',
    color: Colors.black,
  },

  loginText: {
    color: Colors.sooprsblue,
    fontSize: FSize.fs14,
    fontWeight: '900',
  },
});
