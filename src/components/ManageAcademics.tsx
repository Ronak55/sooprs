import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import Colors from '../assets/commonCSS/Colors';
import FSize from '../assets/commonCSS/FSize';
import Images from '../assets/image';
import ButtonNew from './ButtonNew';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const ManageAcademics = ({navigation, route} : {navigation:any, route:any}) => {

  const {academicDetails} = route.params;
  const [academics, setAcademics] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  // const fetchAcademics = async () => {
  //   setLoading(true);
  //   let lead_id = await AsyncStorage.getItem('uid');
  //   if (lead_id) lead_id = lead_id.replace(/^"|"$/g, '');

  //   const formData = new FormData();
  //   formData.append('user_id', lead_id);

  //   try {
  //     const response = await fetch(
  //       'https://sooprs.com/api2/public/index.php/get_academics',
  //       {
  //         method: 'POST',
  //         body: formData,
  //       },
  //     );

  //     const result = await response.json();

  //     if (result.status === 200) {
  //       console.log('academics details::::::::', result.msg);
  //       setAcademics(result.msg);
  //     } else {
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Fetch Error',
  //         text2: 'Failed to fetch academic details.',
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error fetching academics:', error);
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Network Error',
  //       text2: 'Please try again later.',
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    // fetchAcademics();
    console.log('academic details::::::::::', academicDetails);
    setAcademics(academicDetails);

  }, [isFocused, route?.params?.academicDetails]);

  const renderAcademicCard = ({item}) => (
    <View style={styles.card}>
      <Text style={styles.courseText}>{item.course}</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Institute:</Text>
        <Text style={styles.value}>{item.institute}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>University:</Text>
        <Text style={styles.value}>{item.university}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Years:</Text>
        <Text style={styles.value}>{item.years}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Percentage:</Text>
        <Text style={styles.value}>{item.percentage}%</Text>
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>Manage Academics</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{flex: 1}} />
      ) : (
        <FlatList
          data={academics}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderAcademicCard}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No academic records found !</Text>
          }
        />
      )}
      <View style={styles.title}>
        <ButtonNew
          imgSource={null}
          btntext="Add Academics"
          bgColor="#0077FF"
          textColor="#FFFFFF"
          onPress={() => navigation.navigate('AddAcademics')}
          isBorder={true}
        />
      </View>
    </View>
  );
};

export default ManageAcademics;

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
    marginVertical: hp(2),
  },
  listContainer: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(5),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: wp(5),
    marginVertical: hp(1.5),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6,
    borderLeftWidth: 5,
    borderColor: Colors.sooprsblue,
  },
  courseText: {
    fontSize: FSize.fs20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: hp(1),
  },
  detailsContainer: {
    flexDirection: 'row',
    marginBottom: hp(0.8),
  },
  label: {
    fontWeight: '600',
    color: Colors.gray,
    width: wp(30),
  },
  value: {
    color: Colors.black,
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.gray,
    marginTop: hp(35),
    fontSize: FSize.fs14,
  },
});
