import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import CInput from './CInput';
import Images from '../assets/image';
import Colors from '../assets/commonCSS/Colors';
import FSize from '../assets/commonCSS/FSize';
import {wp, hp} from '../assets/commonCSS/GlobalCSS';
import DatePicker from 'react-native-date-picker';
import ButtonNew from './ButtonNew';

const AddExperience = ({navigation}: {navigation: any}) => {
  const [organisation, setOrganisation] = useState('');
  const [designation, setDesignation] = useState('')
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const handleSubmit = ()=>{


  }

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
        <Text style={styles.headerTitle}>Add Experience</Text>
      </View>
      <View style={styles.inputContainer}>
        <CInput
          title="Organisation"
          name="Enter your organisation"
          newlabel={false}
          style={undefined}
          setValue={(val: any) => setOrganisation(val)}
          value={organisation}
          isPassword={false}
          keyboardType={'default'}
          placeholder="E.g., Google"
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
          placeholder="E.g., Software Developer"
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

  save:{

    marginHorizontal:wp(5),
    marginVertical:hp(5)
  }
});
