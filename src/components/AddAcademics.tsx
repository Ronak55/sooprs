import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import Colors from '../assets/commonCSS/Colors';
import FSize from '../assets/commonCSS/FSize';
import Images from '../assets/image';
import CInput from './CInput';
import ButtonNew from './ButtonNew';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const {height, width} = Dimensions.get('window');

const AddAcademics = ({navigation}: {navigation: any}) => {
  const [courseName, setCourseName] = useState('');
  const [year, setYear] = useState('');
  const [percentage, setPercentage] = useState('');
  const [school, setSchool] = useState('');
  const [university, setUniversity] = useState('');

  const handleSave = async()=>{

    try {
        let lead_id = await AsyncStorage.getItem('uid');
        // If lead_id has extra quotes, remove them
        if (lead_id) {
          lead_id = lead_id.replace(/^"|"$/g, ''); // Removes leading and trailing quotes if present
        }

        if(!courseName || !year || !percentage || !school || !university){
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please complete all the fields',
              });
              return;
        }
  
        // Create FormData to send the required fields
        const formData = new FormData();
        formData.append('id', lead_id); // Append lead_id
        formData.append('course', courseName);
        formData.append('year', year);
        formData.append('percentage', percentage);
        formData.append('institute', school);
        formData.append('university', university);
  
        console.log('formdata of portfolio::::::', formData)
  
        // Make the POST request
        const response = await fetch(
         'https://sooprs.com/api2/public/index.php/add_academics',
          {
            method: 'POST',
            body: formData,
          },
        );
  
        const res = await response.json();
  
        if (res.status == 200) {
         
            Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res.msg,
          });
          navigation.goBack();

        } else if (res.status == 400) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: res.msg,
          });
          return;
        }
      } catch (error) {
        console.error(error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'An unexpected error occurred. Please try again later.',
        });
        return;
      }

  }

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.headerSection}>
        <TouchableOpacity onPress={() => navigation.navigate('Account')}>
          <Image
            source={Images.backArrow}
            resizeMode="contain"
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Academics</Text>
      </View>
      <View style={styles.title}>
        <View style={styles.inputContainer}>
          <CInput
            title="Course Name"
            name="Enter your course name"
            newlabel={false}
            style={undefined}
            setValue={(val: any) => setCourseName(val)}
            value={courseName}
            isPassword={false}
            keyboardType={'default'}
          />
          <View style={styles.sameRow}>
            <CInput
              title="Year"
              name="Enter Year"
              newlabel={false}
              style={undefined}
              setValue={(val: any) => setYear(val)}
              value={year}
              isPassword={false}
              keyboardType={'default'}
            />
            <CInput
              title="Percentage/CGPA"
              name="Enter Percentage/CGPA"
              newlabel={false}
              style={undefined}
              setValue={(val: any) => setPercentage(val)}
              value={percentage}
              isPassword={false}
              keyboardType={'default'}
            />
          </View>
          <CInput
            title="School/College"
            name="Enter your School/College"
            newlabel={false}
            style={undefined}
            setValue={(val: any) => setSchool(val)}
            value={school}
            isPassword={false}
            keyboardType={'default'}
          />
          <CInput
            title="University/Board Name"
            name="Enter your University/Board Name"
            newlabel={false}
            style={undefined}
            setValue={(val: any) => setUniversity(val)}
            value={university}
            isPassword={false}
            keyboardType={'default'}
          />
          <View style={styles.saveBtn}>
            <ButtonNew
              imgSource={undefined}
              btntext={'Save'}
              bgColor={Colors.sooprsblue}
              textColor={Colors.white}
              onPress={handleSave}
            />
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default AddAcademics;

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

  section: {
    marginHorizontal: wp(5),
    marginVertical: hp(1),
  },

  title: {
    marginHorizontal: wp(5),
  },

  inputContainer: {
    marginTop: hp(1),
    gap: hp(1.5),
  },

  sameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width / 2.3,
    gap: wp(5),
  },

  saveBtn:{

    marginTop:hp(1)
  }
});

