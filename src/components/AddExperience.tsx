import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native';
  import React, {useState} from 'react';
  import CInput from './CInput';
  import Images from '../assets/image';
  import Colors from '../assets/commonCSS/Colors';
  import FSize from '../assets/commonCSS/FSize';
  import {wp, hp} from '../assets/commonCSS/GlobalCSS';
  import DatePicker from 'react-native-date-picker';
  import ButtonNew from './ButtonNew';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import Toast from 'react-native-toast-message';
  
  const AddExperience = ({navigation}: {navigation: any}) => {
    const [organisation, setOrganisation] = useState('');
    const [designation, setDesignation] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [openStart, setOpenStart] = useState(false);
    const [openEnd, setOpenEnd] = useState(false);
  
    const handleSubmit = async () => {
      try {
        let lead_id = await AsyncStorage.getItem('uid');
        // If lead_id has extra quotes, remove them
        if (lead_id) {
          lead_id = lead_id.replace(/^"|"$/g, ''); // Removes leading and trailing quotes if present
        }
        console.log('Lead ID:', lead_id);
  
        // Create FormData
        const formData = new FormData();
        formData.append('id', lead_id);
        formData.append('organization', organisation);
        formData.append('from', startDate.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
        formData.append('to', endDate.toISOString().split('T')[0]);
        formData.append('designation', designation);
  
        console.log('Form Data:', formData);
  
        // Send POST request to API
        const response = await fetch(
          'https://sooprs.com/api2/public/index.php/add_exp',
          {
            method: 'POST',
            body: formData,
            headers:{
              'User-Agent': 'com.sooprsapp/1.0',
            }
          },
        );
  
        const res = await response.json();
        console.log('API Response::::::::', res);
  
        if (res.status === 200) {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.msg,
          });
          navigation.goBack(); // Navigate back to manage experience screen
        } else if (res.status === 400) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.msg,
          });
        }
      } catch (error) {
        console.error('Error submitting form:', error);
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={Images.backArrow}
              resizeMode="contain"
              style={styles.backArrow}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Experience</Text>
        </View>
        <View style={styles.inputContainer}>
          <CInput
            title="Organisation"
            name="Enter your organisation"
            newlabel={false}
            style={undefined}
            setValue={(val:any) => setOrganisation(val)}
            value={organisation}
            isPassword={false}
            keyboardType={'default'}
          />
          <CInput
            title="Designation"
            name="Enter your designation"
            newlabel={false}
            style={undefined}
            setValue={(val: any) => setDesignation(val)}
            value={designation}
            isPassword={false}
            keyboardType={'default'}
          />
        </View>
        <View style={styles.dateRow}>
          <TouchableOpacity
            style={styles.datePickerContainer}
            onPress={() => setOpenStart(true)}>
            <Text style={styles.labelText}>Start Date</Text>
            <View style={styles.dateInput}>
              <Text style={styles.dateText}>
                {startDate.toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.datePickerContainer}
            onPress={() => setOpenEnd(true)}>
            <Text style={styles.labelText}>End Date</Text>
            <View style={styles.dateInput}>
              <Text style={styles.dateText}>{endDate.toLocaleDateString()}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.save}>
          <ButtonNew
            imgSource={null}
            btntext="Save"
            bgColor="#0077FF"
            textColor="#FFFFFF"
            onPress={handleSubmit}
            isBorder={true}
          />
        </View>
  
        {/* Start Date Picker */}
        <DatePicker
          modal
          mode="date"
          open={openStart}
          date={startDate}
          onConfirm={date => {
            setOpenStart(false);
            setStartDate(date);
          }}
          onCancel={() => {
            setOpenStart(false);
          }}
        />
  
        {/* End Date Picker */}
        <DatePicker
          modal
          mode="date"
          open={openEnd}
          date={endDate}
          onConfirm={date => {
            setOpenEnd(false);
            setEndDate(date);
          }}
          onCancel={() => {
            setOpenEnd(false);
          }}
        />
  
        <Toast />
      </View>
    );
  };
  
  export default AddExperience;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.white,
    },
    headerSection: {
      marginHorizontal: wp(5),
      marginVertical: hp(2),
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
      fontWeight: '600',
      fontSize: FSize.fs18,
    },
    inputContainer: {
      marginHorizontal: wp(5),
      marginTop: hp(2),
    },
    dateRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: wp(5),
      marginTop: hp(1),
    },
    datePickerContainer: {
      flex: 1,
      marginRight: wp(2),
    },
    labelText: {
      fontSize: FSize.fs14,
      color: Colors.black,
      marginBottom: hp(1),
      fontWeight: '500',
    },
    dateInput: {
      borderWidth: 1,
      borderColor: Colors.gray,
      borderRadius: wp(3),
      paddingVertical: hp(1),
      paddingHorizontal: wp(3),
      backgroundColor: '#F9F9F9',
      justifyContent: 'center',
    },
    dateText: {
      color: Colors.black,
      fontSize: FSize.fs14,
    },
    save: {
      marginHorizontal: wp(5),
      marginVertical: hp(5),
    },
  });
  