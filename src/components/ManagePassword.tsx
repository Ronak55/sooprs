import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Images from '../assets/image';
import Colors from '../assets/commonCSS/Colors';
import FSize from '../assets/commonCSS/FSize';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import Toast from 'react-native-toast-message';
import CInput from '../components/CInput'; // Assuming CInput is located here
import ButtonNew from './ButtonNew';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ManagePassword = ({navigation}: {navigation: any}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    // Validate the passwords
    if (currentPassword === newPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Current password cannot be the same as new password.',
      });
      return;
    }
  
    if (newPassword.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'New password must be at least 6 characters long.',
      });
      return;
    }
  
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'New password and confirm password do not match.',
      });
      return;
    }
  
    // Get user ID from AsyncStorage
    let id = await AsyncStorage.getItem('uid');
  
    if (id) {
      id = id.replace(/^"|"$/g, ''); // Remove leading and trailing quotes if present
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'User ID not found.',
      });
      return;
    }
  
    // Create FormData instance
    const formData = new FormData();
    formData.append('id', id);
    formData.append('table_name', 'join_professionals');
    formData.append('currentpass', currentPassword);
    formData.append('newpass', newPassword);
    formData.append('confirmnewpass', confirmPassword);
  
    // Make POST request to update password
    try {
      const response = await fetch(
        'https://sooprs.com/api2/public/index.php/update-password',
        {
          method: 'POST',
          body: formData, // Pass FormData directly
        },
      );
  
      const data = await response.json();
  
      if (data.status==200){

        console.log('pass data::::::::::', data)
        // Adjust according to the actual response structure
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Password changed successfully!',
        });
        // Clear fields after successful change
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        navigation.goBack(); // Navigate back to Account screen
      } else {

        console.log('password error data::::::::::', data)

        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: data.msg || 'Failed to change password.', // Handle API error message
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred while changing password.',
      });
    }
  };
  

  return (
    <View style={styles.section}>
      <View style={styles.headerSection}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={Images.backArrow}
            resizeMode="contain"
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Manage Password</Text>
      </View>
      <View style={styles.passwordSection}>
        <CInput
          title="Current Password"
          name="Enter current password"
          isPassword={true}
          newlabel={false}
          value={currentPassword}
          setValue={setCurrentPassword}
          style={undefined}
          keyboardType={''}
        />

        <CInput
          title="New Password"
          name="Enter new password"
          isPassword={true}
          newlabel={false}
          value={newPassword}
          setValue={setNewPassword}
          style={undefined}
          keyboardType={''}
        />

        <CInput
          title="Confirm Password"
          name="Confirm new password"
          isPassword={true}
          newlabel={false}
          value={confirmPassword}
          setValue={setConfirmPassword}
          style={undefined}
          keyboardType={''}
        />
      </View>
      <View style={styles.saveButton}>
        <ButtonNew
          btntext={'Update Password'}
          bgColor={Colors.sooprsblue}
          textColor={Colors.white}
          onPress={handleChangePassword}
          imgSource={undefined}
          isBorder={true}
        />
      </View>
    </View>
  );
};

export default ManagePassword;

const styles = StyleSheet.create({
  section: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerSection: {
    marginHorizontal: wp(5),
    marginVertical: hp(1),
    gap: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    width: wp(8),
    height: hp(8),
  },
  headerText: {
    color: Colors.black,
    fontWeight: '500',
    fontSize: FSize.fs16,
  },

  passwordSection: {
    marginHorizontal: wp(5),
    marginVertical: hp(2),
  },

  saveButton: {
    marginHorizontal: wp(5),
  },

  button: {
    backgroundColor: Colors.sooprsblue,
    padding: hp(2),
    borderRadius: wp(5),
    alignItems: 'center',
    marginHorizontal: wp(5),
    marginTop: hp(3),
  },
  buttonText: {
    color: Colors.white,
    fontSize: FSize.fs16,
    fontWeight: '500',
  },
});
