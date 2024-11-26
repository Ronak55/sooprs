import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../assets/commonCSS/Colors';
import { hp, wp } from '../assets/commonCSS/GlobalCSS';
import FSize from '../assets/commonCSS/FSize';
import Images from '../assets/image';
import ButtonNew from './ButtonNew';
import CInput from './CInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { mobile_siteConfig } from '../services/mobile-siteConfig';
import { useIsFocused } from '@react-navigation/native';

const BankDetails = ({ navigation, route }: { navigation: any, route:any }) => {

  const bankDetails = route?.params?.bankName ? route?.params?.bankName : "";

  const [bankName, setBankName] = useState('');
  const [bankNameError, setBankNameError] = useState('');
  const [accNumber, setAccountNumber] = useState('');
  const [accNumberError, setAccountNumberError] = useState('');
  const [bankIFSC, setBankIFSC] = useState('');
  const [bankIFSCError, setBankIFSCError] = useState('');
  const [loading, isLoading] = useState(false);
  const isFocused = useIsFocused();

  useEffect(()=>{

    console.log('bank details fetched::::::', bankDetails);

    setBankName(bankDetails.bank_name);
    setAccountNumber(bankDetails.account_no);
    setBankIFSC(bankDetails.ifsc);

  }, [isFocused, route?.params?.bankDetails])

  // useEffect(() => {
  //   const getBankDetails = async () => {
  //     let token = await AsyncStorage.getItem(mobile_siteConfig.TOKEN);
  //     let new_token = JSON.parse(token);

  //     const response = await fetch(
  //       'https://sooprs.com/api2/public/index.php/get-bank-details-new',
  //       {
  //         method: 'GET',
  //         headers: {
  //           Authorization: `Bearer ${new_token}`,
  //         },
  //       }
  //     );

  //     const res = await response.json();
  //     console.log('fetching bank account details:::::', res);
  //     if (res) {
  //       setBankName(res.bank_name);
  //       setAccountNumber(res.account_no);
  //       setBankIFSC(res.ifsc);
  //     } else {
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Error',
  //         text2: res || 'Error fetching bank details.',
  //       });
  //     }
  //   };
  //   getBankDetails();
  // }, []);

  const handleOnPress = async () => {
    isLoading(true);

    try {
      const id = await AsyncStorage.getItem('uid');
      const name = await AsyncStorage.getItem(mobile_siteConfig.NAME);
      const cleanedId = id ? id.replace(/^"|"$/g, '') : null;

      if (!bankName || !accNumber || !bankIFSC || bankNameError || accNumberError || bankIFSCError) {
        Toast.show({
          type: 'error',
          text1: 'Form Incomplete',
          text2: 'Please fill all the fields correctly',
        });
        return;
      }

      const formData = new FormData();
      formData.append('id', cleanedId);
      formData.append('bank_name', bankName);
      formData.append('account_no', accNumber);
      formData.append('ifsc', bankIFSC);
      formData.append('user', name);

      const response = await fetch(
        'https://sooprs.com/api2/public/index.php/add_bank_details',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            'User-Agent': 'com.sooprsapp/1.0',
          },
          body: formData,
        }
      );

      const res = await response.json();

      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res.msg || 'Bank details added successfully!',
        });
        navigation.navigate('Account');
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
    } finally {
      isLoading(false);
    }
  };

  const validateBankName = (val) => {
    const namePattern = /^[a-zA-Z\s]+$/;
    setBankName(val);
    setBankNameError(namePattern.test(val) ? '' : 'Enter a valid bank name without numbers or special characters');
  };

  const validateAccountNumber = (val) => {
    const accNumberPattern = /^\d{9,18}$/;
    setAccountNumber(val);
    setAccountNumberError(accNumberPattern.test(val) ? '' : 'Invalid bank account number');
  };

  const validateBankIFSC = (val) => {
    const ifscPattern = /^[A-Z]{4}[0][A-Z0-9]{6}$/;
    setBankIFSC(val);
    setBankIFSCError(ifscPattern.test(val) ? '' : 'Please enter a valid IFSC code');
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
        <Text style={styles.headerTitle}>Manage Your Bank Details</Text>
      </View>
      <View style={styles.title}>
        <View style={styles.inputContainer}>
          <View style={styles.rowSection}>
            <CInput
              title="Bank Name"
              name="Enter your bank name"
              newlabel={false}
              style={undefined}
              setValue={validateBankName}
              value={bankName}
              isPassword={false}
              keyboardType={'default'}
            />
            {bankNameError ? (
              <Text style={styles.errorText}>{bankNameError}</Text>
            ) : null}
          </View>
          <View style={styles.rowSection}>
          <CInput
            title="Bank Account No."
            name="Enter your bank account no."
            newlabel={false}
            style={undefined}
            setValue={validateAccountNumber}
            value={accNumber}
            isPassword={false}
            keyboardType={'number-pad'}
          />
          {accNumberError ? (
            <Text style={styles.errorText}>{accNumberError}</Text>
          ) : null}
          </View>
          <View style={styles.rowSection}>
          <CInput
            title="Bank IFSC"
            name="Enter your bank IFSC"
            newlabel={false}
            style={undefined}
            setValue={validateBankIFSC}
            value={bankIFSC}
            isPassword={false}
            keyboardType={'default'}
          />
          {bankIFSCError ? (
            <Text style={styles.errorText}>{bankIFSCError}</Text>
          ) : null}
          </View>
          <ButtonNew
            imgSource={null}
            btntext={
              loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                'Add Details'
              )
            }
            bgColor="#0077FF"
            textColor="#FFFFFF"
            onPress={handleOnPress}
            isBorder={true}
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
  inputContainer: {
    marginTop: hp(4),
    gap: hp(2),
  },
  rowSection: {
    flexDirection: 'column',
  },
  errorText: {
    color: 'red',
    fontSize: FSize.fs12,
  },
});
