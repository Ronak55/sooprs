import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../assets/commonCSS/Colors';
import ProjectCard from '../../components/ProjectCard';
import { wp } from '../../assets/commonCSS/GlobalCSS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postData } from '../../services/mobile-api';
import { mobile_siteConfig } from '../../services/mobile-siteConfig';
import { useIsFocused } from '@react-navigation/native';

const Projects = ({navigation}: {navigation: any}) => {

    const [projectDetails, setProjectDetails] = useState([]);
    const isFocused = useIsFocused();

    const getProjects = async () => {
        try {
          // Fetch UID from AsyncStorage
          const uid = await AsyncStorage.getItem('uid');
      
          if (!uid) {
            console.error('UID not found');
            return;
          }
      
          // Create the form data
          const formdata = new FormData();
          formdata.append('variable', uid);  // Adjust the 'variable' key if necessary
          formdata.append('offset', 0);
          formdata.append('limit', 10);
      
          // Log form data to ensure it's correct
          console.log('FormData contents:', formdata);
      
          // Make the POST request using fetch
          const response = await fetch('https://sooprs.com/api2/public/index.php/get_enquiries_ajax', {
            method: 'POST',
            body: formdata,  // Send formdata as the request body
            headers: {
              // 'Content-Type' is automatically set by the browser for FormData
              // 'multipart/form-data' for FormData is handled automatically
            },
          });
      
          // Parse the response as JSON
          const responseData = await response.json();
      
          // Log the full response data
          console.log('Response Data:', responseData);
      
          // Check if the response status is 200 (as a number, not string)
          if (responseData.status === 200) {
            console.log('Response message:', responseData.msg);
            setProjectDetails(responseData.msg);
          } else if (responseData.status === 400) {
            console.error('An error has occurred!');
          }
        } catch (error) {
          // Log any errors that occur during the fetch or data processing
          console.error('Error fetching projects:', error);
        }
      };
    useEffect(()=>{
        getProjects()
    }, [isFocused])

//   const projectDetails = [
//     {
//       name: 'Need a food delivery app UI Design',
//       desc: 'I am looking to develop a dynamic and user-friendly mobile application and am seeking skilled professionals to bring this vision to life. The app aims to provide a seamless and engaging experience for users, combining functionality with an intuitive design.',
//       category: 'App Development',
//       budget: '$0 - $500',
//       bids: '4',
//       createdAt:'18/02/2024'
//     },

//     {
//       name: 'Need a food delivery app UI Design',
//       desc: 'I am looking to develop a dynamic and user-friendly mobile application and am seeking skilled professionals to bring this vision to life. The app aims to provide a seamless and engaging experience for users, combining functionality with an intuitive design.',
//       category: 'App Development',
//       budget: '$0 - $500',
//       bids: '4',
//       createdAt:'18/02/2024'
//     },
//   ];
  const renderItem = ({item, index}: {item: any; index: any}) => (
    <ProjectCard
    navigation={navigation}
    name={item.project_title} // Project title from the data
    desc={item.description} // Description from the data
    category={item['service-name']} // Service name from the data
    budget={`${item.min_budget} - ${item.max_budget_amount}`} // Budget range
    bids={item.bid_count} // Bid count
    createdAt={item.formatCreatedAt} // Formatted date
    index={index}
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

export default Projects;

const styles = StyleSheet.create({
  projectsList: {
    backgroundColor: Colors.white,
    flex: 1,
    marginHorizontal:wp(2)
  },
});
