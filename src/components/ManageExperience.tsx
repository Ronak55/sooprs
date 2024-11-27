import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
} from 'react-native';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import Images from '../assets/image';
import FSize from '../assets/commonCSS/FSize';
import ButtonNew from './ButtonNew';
import Colors from '../assets/commonCSS/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {useIsFocused} from '@react-navigation/native';

const ManageExperience = ({navigation, route}: {navigation: any}) => {

  const {experience} = route.params;
  const [experienceData, setExperienceData] = useState<any[]>([]);
  const [noExperienceMessage, setNoExperienceMessage] = useState<string>('');
  const isFocused = useIsFocused();

  useEffect(() => {
    // const fetchExperienceData = async () => {
    //   let lead_id = await AsyncStorage.getItem('uid');
    //   if (lead_id) {
    //     lead_id = lead_id.replace(/^"|"$/g, ''); // Removes leading and trailing quotes if present
    //   }

    //   const formData = new FormData();
    //   formData.append('user_id', lead_id);

    //   try {
    //     const response = await fetch(
    //       'https://sooprs.com/api2/public/index.php/get_exp',
    //       {
    //         method: 'POST',
    //         body: formData,
    //       },
    //     );

    //     const res = await response.json();
    //     if (res.status == 200) {
    //       const uniqueExperiences = Array.from(
    //         new Set(res.msg.map(item => item.organization)),
    //       ).map(organization =>
    //         res.msg.find(item => item.organization === organization),
    //       );

    //       console.log('unique exp:::::::::::', uniqueExperiences);

    //       if (uniqueExperiences.length > 0) {
    //         setExperienceData(uniqueExperiences); // Set unique experience data
    //         setNoExperienceMessage('');
    //       } else {
    //         setNoExperienceMessage('No experience found');
    //         setExperienceData([]);
    //       }
    //     } else {
    //       setNoExperienceMessage(res.msg || 'An error occurred');
    //       setExperienceData([]);
    //       Toast.show({
    //         text1: 'Error',
    //         text2: res.msg,
    //         type: 'error',
    //         position: 'top',
    //       });
    //     }
    //   } catch (error) {
    //     console.error(error);
    //     setNoExperienceMessage('Error fetching data');
    //     setExperienceData([]);
    //     Toast.show({
    //       text1: 'Error',
    //       text2: 'Error fetching data',
    //       type: 'error',
    //       position: 'top',
    //     });
    //   }
    // };
    // fetchExperienceData();
    console.log('experience details::::::::', experience)
    setExperienceData(experience)
  
  }, [route?.params?.experience]);

  const renderExperienceItem = ({item}: {item: any}) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.designation}>{item.designation}</Text>
        <Text style={styles.date}>
          {item.from_date.replace(/-/g, '/')} -{' '}
          {item.to_date.replace(/-/g, '/')}
        </Text>
      </View>
      <Text style={styles.organization}>{item.organization}</Text>
      <Text style={styles.currentlyWorking}>
        {item.is_currently_working === '1'
          ? 'Currently Working'
          : 'Not Currently Working'}
      </Text>
    </View>
  );

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
        <Text style={styles.headerTitle}>Manage Experience</Text>
      </View>
      <ScrollView contentContainerStyle={styles.section} nestedScrollEnabled>
        {noExperienceMessage ? (
          <View style={styles.noExperienceContainer}>
            <Text style={styles.noExperienceText}>{noExperienceMessage}</Text>
          </View>
        ) : (
          <FlatList
            data={experienceData}
            renderItem={renderExperienceItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            nestedScrollEnabled
          />
        )}

        <ButtonNew
          imgSource={null}
          btntext="Add Experience"
          bgColor="#0077FF"
          textColor="#FFFFFF"
          onPress={() => navigation.navigate('AddExperience')}
          isBorder={true}
        />
      </ScrollView>
    </View>
  );
};

export default ManageExperience;

const styles = StyleSheet.create({
  to: {
    color: Colors.black,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  section: {
    marginHorizontal: wp(5),
  },
  headerSection: {
    marginHorizontal: wp(5),
    // marginVertical: hp(1),
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
  listContainer: {
    paddingBottom: hp(3), // Ensure space for the Add Experience button
  },
  card: {
    backgroundColor: Colors.white, // Changed to white for better visibility
    borderRadius: wp(4),

    paddingVertical: hp(3),
    paddingHorizontal: wp(3),
    marginVertical: hp(1),
    marginHorizontal: wp(1),
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  designation: {
    fontSize: FSize.fs18,
    fontWeight: 'bold',
    width:wp(47),
    color: Colors.black, // Made it bold for emphasis
  },
  organization: {
    fontSize: FSize.fs14,
    color: Colors.gray,
    marginTop: hp(0.5),
  },
  date: {
    fontSize: FSize.fs12,
    color: Colors.gray,
    marginTop: hp(1),
  },
  currentlyWorking: {
    marginTop: hp(0.5),
    fontSize: FSize.fs12,
    color: Colors.sooprsblue,
  },
  noExperienceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noExperienceText: {
    fontSize: FSize.fs16,
    color: Colors.gray,
    textAlign: 'center',
  },
});
