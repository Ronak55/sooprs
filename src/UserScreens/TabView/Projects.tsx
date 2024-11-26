import {FlatList, StyleSheet, Text, View, RefreshControl} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import Colors from '../../assets/commonCSS/Colors';
import ProjectCard from '../../components/ProjectCard';
import {wp} from '../../assets/commonCSS/GlobalCSS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';

const Projects = ({navigation}: {navigation: any}) => {
  const [projectDetails, setProjectDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Loading state for initial load
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const isFocused = useIsFocused();

  const getProjects = async () => {
    try {
      const uid = await AsyncStorage.getItem('uid');
      if (!uid) {
        console.error('UID not found');
        setLoading(false);
        return;
      }

      const formdata = new FormData();
      formdata.append('variable', uid);
      formdata.append('offset', 0);
      formdata.append('limit', 10);

      const response = await fetch(
        'https://sooprs.com/api2/public/index.php/get_enquiries_ajax',
        {method: 'POST', body: formdata}
      );

      const responseData = await response.json();
      console.log('Response Data:', responseData);

      if (responseData.status === 200) {
        setProjectDetails(responseData.msg);
      } else {
        console.warn('No projects found');
        setProjectDetails([]); // Ensure empty array if no projects are found
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false); // Stop loading after data is fetched
      setRefreshing(false); // Stop refreshing after data is reloaded
    }
  };

  useEffect(() => {
    getProjects();
  }, [isFocused]);

  // Refresh handler for pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true); // Start refreshing
    getProjects(); // Fetch updated data
  }, []);

  const renderItem = ({item, index}: {item: any; index: any}) => (
    <ProjectCard
      navigation={navigation}
      name={item.project_title}
      id={item.id}
      desc={item.description}
      category={item['service-name']}
      budget={`$${item.min_budget} - $${item.max_budget_amount}`}
      bids={item.bid_count}
      createdAt={item.formatCreatedAt}
      index={index}
      isProfessional={false}
    />
  );

  // Render UI based on the loading and data state
  const renderContent = () => {
    if (loading && !refreshing) {
      return <Text style={styles.message}>Loading projects...</Text>;
    }

    if (projectDetails.length === 0 && !refreshing) {
      return <Text style={styles.message}>No projects found!</Text>;
    }

    return (
      <FlatList
        data={projectDetails}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} // Pull-to-refresh handler
            colors={[Colors.sooprsblue]} // Customize color if needed
          />
        }
      />
    );
  };

  return <View style={styles.projectsList}>{renderContent()}</View>;
};

export default Projects;

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
