import {Alert, Image, Keyboard, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
import { validateEmail } from '../services/CommonFunction';
import { postData } from '../services/mobile-api';
import { mobile_siteConfig } from '../services/mobile-siteConfig';
import Toast from 'react-native-toast-message';

const ForgotPassword = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState('');
  const [isEmailSubmit, setIsEmailSubmit] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const EmailHandlePress = () => {
    if (!validateEmail(email.trim())) {
      showAlert('Invalid Email', 'Please enter a valid email');
      return;
    }

    const payload = {
      email:email,
      type:1
    }

    postData(payload, mobile_siteConfig.FORGOT_PASSWORD)
    .then((res) => {
      console.log('success::::::::', res);
      if (res.status === 200) {
        // Show success message
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res.msg || 'Email sent successfully!',
          position: 'top',
        });
        setIsEmailSubmit(true); // Update state to show password inputs
      } else if (res.status === 400) {
        // Show error message
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.msg || 'Something went wrong. Please try again.',
          position: 'top',
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || "Something went wrong. Please try again.",
        position: 'top',
      });
    });
    
  };

  const handleNewPasswordSubmit = () => {
    // Add logic to submit the new password, e.g., to update it in the database
    if (newPassword !== confirmNewPassword) {
      showAlert('Password Mismatch', 'New password and confirmation do not match.');
      return;
    }

    // Simulate API call to update the password
    // Replace this with your actual API call
    fetch('your-api-endpoint-to-update-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, newPassword }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          navigation.navigate('Success', {
            successMessage: 'Your password has been updated successfully',
            btnText: 'Login',
            navigateTo: 'Login',
          });
        } else {
          showAlert('Error', data.message || 'Something went wrong. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        showAlert('Error', 'Something went wrong. Please try again.');
      });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <KeyboardAwareScrollView style={styles.container}>
        <Password desc="Enter your registered email below to receive password reset instructions" />
        <View style={styles.emailBox}>
          {!isEmailSubmit ? (
            <>
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
              <ButtonNew
                imgSource={null}
                btntext="Submit"
                bgColor="#0077FF"
                textColor="#FFFFFF"
                onPress={EmailHandlePress}
              />
            </>
          ) : (
            <>
              <CInput
                title="New Password"
                name="Enter New Password"
                newlabel={false}
                style={undefined}
                setValue={(val: React.SetStateAction<string>) => setNewPassword(val)}
                value={newPassword}
                isPassword={true}
                keyboardType={'default'}
              />
              <CInput
                title="Confirm New Password"
                name="Re-Enter New Password"
                newlabel={false}
                style={undefined}
                setValue={(val: React.SetStateAction<string>) => setConfirmNewPassword(val)}
                value={confirmNewPassword}
                isPassword={true}
                keyboardType={'default'}
              />
              <ButtonNew
                imgSource={null}
                btntext="Update Password"
                bgColor="#0077FF"
                textColor="#FFFFFF"
                onPress={handleNewPasswordSubmit}
              />
            </>
          )}
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
