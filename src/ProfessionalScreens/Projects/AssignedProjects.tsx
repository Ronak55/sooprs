import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Images from '../../assets/image';
import FSize from '../../assets/commonCSS/FSize';
import Colors from '../../assets/commonCSS/Colors';
import {hp, wp} from '../../assets/commonCSS/GlobalCSS';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProjectCard from '../../components/ProjectCard';

const AssignedProjects = ({navigation}: {navigation: any}) => {
  const [assignedProjects, setAssignedProjects] = useState([]);

  const isFocused = useIsFocused();

  const getAssignedProjects = async () => {
    try {
      let id = await AsyncStorage.getItem('uid');

      // If lead_id has extra quotes, remove them
      if (id) {
        id = id.replace(/^"|"$/g, ''); // Removes leading and trailing quotes if present
      }

      console.log('unique id:::::::::::', id);

      const formdata = new FormData();
      formdata.append('variable', id); // Your user ID

      console.log('assigned projects contents:::::', formdata);

      const response = await fetch(
        'https://sooprs.com/api2/public/index.php/get_professional_projects',
        {
          method: 'POST',
          body: formdata,
          headers: {},
        },
      );
      const responseData = await response.json();
      console.log('assigned projects response data::::', responseData);

      if (responseData.status === 200) {
        setAssignedProjects(responseData.msg);
      } else if (responseData.status === 400) {
        console.error('An error has occurred!');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
    }
  };

  useEffect(() => {
    getAssignedProjects();
  }, [isFocused]);

  const renderItem = ({item, index}: {item: any; index: any}) => (
    <ProjectCard
      navigation={navigation}
      name={item.project_title}
      id={item.id}
      desc={item.description}
      category={item['service-name']}
      budget={`${item.min_budget} - ${item.max_budget_amount}`}
      bids={''}
      createdAt={''}
      index={index}
      isProfessional={true}
      bidId={item.myLeadId}
      Customer_name={item.Customer_name}
      customer_id={item.customer_id}
      isAssigned={true}
      project_status={item.project_status}
    />
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
        <Text style={styles.headerTitle}>Assigned Projects</Text>
      </View>
      <View style={styles.myProjects}>
        <FlatList
          data={assignedProjects}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default AssignedProjects;

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

  myProjects: {
    marginHorizontal: wp(5),
  },
});
