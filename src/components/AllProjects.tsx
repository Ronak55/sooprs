import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../assets/commonCSS/Colors';
import {hp, wp} from '../assets/commonCSS/GlobalCSS'; // Import hp and wp for responsiveness
import ProjectCard from './ProjectCard';
import {useIsFocused} from '@react-navigation/native';

const AllProjects = ({navigation}: {navigation: any}) => {
  const [projectDetail, setProjectDetail] = useState([]); // Store project data
  const [isLoading, setIsLoading] = useState(false); // Handle loading state
  const [offset, setOffset] = useState(0); // Track the current offset for pagination
  const [hasMore, setHasMore] = useState(true); // Check if more data is available
  const isFocused = useIsFocused();

  const getProjects = async (newOffset: number) => {
    if (isLoading || !hasMore) return; // Prevent multiple calls if already loading or no more data
    setIsLoading(true); // Start loading

    try {
      const formdata = new FormData();
      formdata.append('offset', newOffset); // Use current offset
      formdata.append('limit', 10); // Limit results to 10 items

      console.log('FormData contents:', formdata);

      const response = await fetch(
        'https://sooprs.com/api2/public/index.php/get_all_leads',
        {
          method: 'POST',
          body: formdata,
          headers: {},
        },
      );
      const responseData = await response.json();
      console.log('Projects response Data::::', responseData);

      if (responseData.status === 200) {
        if (responseData.msg.length === 0) {
          setHasMore(false); // No more data to load
        } else {
            // Remove duplicates and only append new projects
            const newProjects = responseData.msg.filter(
                (project) =>
                  !projectDetail.some((existingProject) => existingProject.id === project.id)
              );
              setProjectDetail((prevProjects) => [...prevProjects, ...newProjects]);
        }
      } else if (responseData.status === 400) {
        console.error('An error has occurred!');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    getProjects(0); // Initial load with offset 0
  }, [isFocused]);

  // Handle load more button click
  const loadMoreProjects = () => {
    const newOffset = offset + 10; // Increment offset
    setOffset(newOffset);
    getProjects(newOffset);
  };

  const renderItem = ({item, index}: {item: any; index: any}) => (
    <ProjectCard
      navigation={navigation}
      name={item.project_title}
      id={item.id}
      desc={item.description}
      category={item.service_name}
      budget={`${item.min_budget} - ${item.max_budget_amount}`}
      bids={item.num_leads}
      createdAt={item.created_at}
      index={index}
      isProfessional={true}
      bidId={undefined}
    />
  );

  // Footer component for "Show More" button or loading spinner
  const renderFooter = () => {
    if (isLoading) {
      return (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{marginVertical: hp(2)}}
        />
      );
    }

    if (hasMore) {
      return (
        <TouchableOpacity
          style={styles.showMoreButton}
          onPress={loadMoreProjects}>
          <Text style={styles.showMoreText}>Show More</Text>
        </TouchableOpacity>
      );
    }

    return <Text style={styles.noMoreText}>No more projects to load</Text>;
  };

  return (
    <View style={styles.projectsList}>
      <FlatList
        data={projectDetail}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={renderFooter} // Footer for pagination
        showsVerticalScrollIndicator={false}
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
  showMoreButton: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(10),
    backgroundColor: Colors.sooprsblue,
    alignItems: 'center',
    marginVertical: hp(2),
    borderRadius: wp(2),
  },
  showMoreText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: wp(4),
  },
  noMoreText: {
    textAlign: 'center',
    marginVertical: hp(2),
    color: Colors.gray,
    fontSize: wp(4),
  },
});
