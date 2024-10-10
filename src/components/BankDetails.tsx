import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useState } from 'react';
import Colors from '../assets/commonCSS/Colors';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import FSize from '../assets/commonCSS/FSize';
import Images from '../assets/image';
import ButtonNew from './ButtonNew';
import CInput from './CInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { mobile_siteConfig } from '../services/mobile-siteConfig';

const BankDetails = ({navigation}: {navigation: any}) => {

    const [bankName, setBankName] = useState('');
    const [accNumber, setAccountNumber] = useState('');
    const [bankIFSC, setBankIFSC] = useState('');

    const handleOnPress = async () => {
        try {
          // Fetch the user id from AsyncStorage
          const id = await AsyncStorage.getItem('uid');
          const name = await AsyncStorage.getItem(mobile_siteConfig.NAME);

          const cleanedId = id ? id.replace(/^"|"$/g, '') : null;
    
          if (!bankName || !accNumber || !bankIFSC) {
            Toast.show({
              type: 'error',
              text1: 'Form Incomplete',
              text2: 'Please fill all the fields',
            });
            return;
          }
    
          // Prepare form data
          const formData = new FormData();
          formData.append('id', cleanedId);
          formData.append('bank_name', bankName);
          formData.append('account_no', accNumber);
          formData.append('ifsc', bankIFSC);
          formData.append('user', name);
    
          // API call
          const response = await fetch('https://sooprs.com/api2/public/index.php/add_bank_details', {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          });
    
          const res = await response.json();
    
          if (response.status === 200) {
            Toast.show({
              type: 'success',
              text1: 'Success',
              text2: res.msg || 'Bank details added successfully!',
            });
            navigation.navigate('Account'); // Navigate back to Account page
          } else {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: res.msg || 'Error adding bank details.',
            });
          }
        } catch (error) {
          console.error('Error adding bank details:', error);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Something went wrong. Please try again.',
          });
        }
      };
    

  return (
    <View style={styles.container}>
         <View style={styles.headerSection}>
        <TouchableOpacity onPress={() => navigation.navigate('Account')}>
          <Image
            source={Images.backArrow}
            resizeMode="contain"
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Your Bank Details</Text>
      </View>
        <View style={styles.title}>
          <View style={styles.inputContainer}>
            <CInput
              title="Bank Name"
              name="Enter your bank name"
              newlabel={false}
              style={undefined}
              setValue={(val: any) => setBankName(val)}
              value={bankName}
              isPassword={false}
              keyboardType={'default'}
            />
            <CInput
              title="Bank Account No."
              name="Enter your bank account no."
              newlabel={false}
              style={undefined}
              setValue={(val: any) => setAccountNumber(val)}
              value={accNumber}
              isPassword={false}
              keyboardType={'number-pad'}
            />
            <CInput
              title="Bank IFSC"
              name="Enter your bank IFSC"
              newlabel={false}
              style={undefined}
              setValue={(val: any) => setBankIFSC(val)}
              value={bankIFSC}
              isPassword={false}
              keyboardType={'default'}
            />
            <ButtonNew
              imgSource={null}
              btntext="Add Details"
              bgColor="#0077FF"
              textColor="#FFFFFF"
              onPress={handleOnPress}
            />
          </View>
        </View>
      </View>
  );
};

export default BankDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerSection: {
    marginHorizontal: wp(5),
    marginVertical: hp(1),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  backArrow: {
    width: wp(8),
    height: hp(8),
  },
  headerTitle: {
    color: Colors.black,
    fontWeight: '500',
    fontSize: FSize.fs16,
  },

  title: {
    marginHorizontal: wp(5),
  },
  titleText: {
    fontFamily: 'poppins',
    fontSize: wp(7),
    fontWeight: '600',
    color: Colors.sooprsblue,
  },
  inputContainer: {
    marginTop: hp(4),
    gap: hp(2),
  },
});
