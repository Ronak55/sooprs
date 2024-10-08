import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../assets/commonCSS/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hp, wp } from '../assets/commonCSS/GlobalCSS';
import ProjectCard from './ProjectCard';
import {useIsFocused} from '@react-navigation/native';

const AllProjects = ({navigation}: {navigation: any}) => {
  const [projectDetails, setProjectDetails] = useState([]);
  const isFocused = useIsFocused();

  const getProjects = async () => {
    try {
      // Create the form data
      const formdata = new FormData();
      formdata.append('offset', 0);
      formdata.append('limit', 10);

      // Log form data to ensure it's correct
      console.log('FormData contents:', formdata);

      // Make the POST request using fetch
      const response = await fetch(
        'https://sooprs.com/api2/public/index.php/get_all_leads',
        {
          method: 'POST',
          body: formdata, // Send formdata as the request body
          headers: {
            // 'Content-Type' is automatically set by the browser for FormData
            // 'multipart/form-data' for FormData is handled automatically
          },
        },
      );

      // Parse the response as JSON
      const responseData = await response.json();

      // Log the full response data
      console.log('Projects response Data::::', responseData);

      // Check if the response status is 200 (as a number, not string)
      if (responseData.status === 200) {
        console.log('Response message:', responseData.msg);
        setProjectDetails(responseData.msg);
      } else if (responseData.status === 400) {
        console.error('An error has occurred!');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };
  useEffect(() => {
    getProjects();
  }, [isFocused]);

  const renderItem = ({item, index}: {item: any; index: any}) => (
      <ProjectCard
        navigation={navigation}
        name={item.project_title} // Project title from the data
        id={item.id}
        desc={item.description} // Description from the data
        category={item.service_name} // Service name from the data
        budget={`${item.min_budget} - ${item.max_budget_amount}`} // Budget range
        bids={item.num_leads} // Bid count
        createdAt={item.created_at} // Formatted date
        index={index}
        isProfessional={true}
      />
  );

  return (
    <View style={styles.projectsList}>
      <FlatList
        data={projectDetails}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default AllProjects;

const styles = StyleSheet.create({
  projectsList: {
    backgroundColor: Colors.white,
    flex: 1,
  },
});
