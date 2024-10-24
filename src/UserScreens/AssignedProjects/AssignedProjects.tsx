import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {hp, wp} from '../../assets/commonCSS/GlobalCSS';
import Images from '../../assets/image';
import Colors from '../../assets/commonCSS/Colors';
import FSize from '../../assets/commonCSS/FSize';
import Projects from '../TabView/Projects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import ProjectCard from '../../components/ProjectCard';

const AssignedProjects = ({navigation}: {navigation: any}) => {
  const [assignedProjects, setAssignedProjects] = useState([]);

  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(true); // Loading state

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
        'https://sooprs.com/api2/public/index.php/get_projects_ajax',
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
        setLoading(false); // Stop loading after data is fetched
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
      bids={item.bid_count}
      createdAt={item.formatCreatedAt}
      index={index}
      isAssigned={true}
      isProfessional={false}
      bidId={item.myLeadId}
      Customer_name={item.prof_name}
      customer_id={item.professional_id}
      project_status={item.project_status}
    />
  );

  const renderContent = () => {
    if (loading) {
      return <Text style={styles.message}>Loading assigned projects...</Text>;
    }

    if (assignedProjects.length === 0) {
      return <Text style={styles.message}>No assigned projects found!</Text>;
    }

    return (
      <FlatList
        data={assignedProjects}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
      />
    );
  };

  return <View style={styles.projectsList}>{renderContent()}</View>;
};

export default AssignedProjects;

const styles = StyleSheet.create({
  projectsList: {
    backgroundColor: Colors.white,
    flex: 1,
    marginHorizontal: wp(2),
    justifyContent: 'center', // Center the message vertically
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    color: Colors.black,
    textAlign: 'center',
    marginTop: wp(10),
  },
});
