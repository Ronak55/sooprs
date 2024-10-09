import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Images from '../../assets/image';
import Colors from '../../assets/commonCSS/Colors';
import FSize from '../../assets/commonCSS/FSize';
import {hp, wp} from '../../assets/commonCSS/GlobalCSS';
import {useIsFocused} from '@react-navigation/native';
import ProjectCard from '../../components/ProjectCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Projects = ({navigation}: {navigation: any}) => {
  const [bidProjects, setBidProjects] = useState([]); // Correct data type
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0); // Track the current offset for pagination
  const [hasMore, setHasMore] = useState(true); // Check if more data is available

  const isFocused = useIsFocused();

  const getMyProjects = async (newOffset: number) => {
    if (isLoading || !hasMore) return; // Prevent multiple calls if already loading or no more data
    setIsLoading(true); // Start loading

    try {
      let id = await AsyncStorage.getItem('uid');

      // If lead_id has extra quotes, remove them
      if (id) {
        id = id.replace(/^"|"$/g, ''); // Removes leading and trailing quotes if present
      }

      console.log('unique id:::::::::::', id);

      const formdata = new FormData();
      formdata.append('offset', newOffset); // Use current offset
      formdata.append('limit', 10); // Limit results to 10 items
      formdata.append('my_get_id', id); // Your user ID

      console.log('bid projects contents:::::', formdata);

      const response = await fetch(
        'https://sooprs.com/api2/public/index.php/get_my_leads',
        {
          method: 'POST',
          body: formdata,
          headers: {},
        }
      );
      const responseData = await response.json();
      console.log('Bidded projects response data::::', responseData);

      if (responseData.status === 200) {
        if (responseData.msg.length === 0) {
          setHasMore(false); // No more data to load
        } else {
          // Remove duplicates and only append new projects
          const newProjects = responseData.msg.filter(
            (project) =>
              !bidProjects.some((existingProject) => existingProject.id === project.id)
          );
          setBidProjects((prevProjects) => [...prevProjects, ...newProjects]);
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
    getMyProjects(0); // Load initial projects when screen is focused
  }, [isFocused]);

  const loadMoreProjects = () => {
    const newOffset = offset + 1; // Increment offset for next batch
    setOffset(newOffset);
    getMyProjects(newOffset); // Fetch the next batch
  };

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

    return <Text style={styles.noMoreText}>No more projects !</Text>;
  };

  const renderItem = ({item, index}: {item: any; index: any}) => (
    <ProjectCard
      navigation={navigation}
      name={item.project_title}
      id={item.id}
      desc={item.description}
      category={item.service_name}
      budget={`${item.min_budget} - ${item.max_budget_amount}`}
      bids={''}
      createdAt={''}
      index={index}
      isProfessional={true}
      bidId={item.bid_id}
    />
  );

  return (
    <View style={styles.section}>
      <View style={styles.headerSection}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ProfessionalHome');
          }}>
          <Image
            source={Images.backArrow}
            resizeMode="contain"
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text
          style={{
            color: Colors.black,
            fontWeight: '500',
            fontSize: FSize.fs16,
          }}>
          My Projects
        </Text>
      </View>
      <View style={styles.myProjects}>
        <FlatList
          data={bidProjects}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={renderFooter} // Footer for pagination
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default Projects;

const styles = StyleSheet.create({
  section: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerSection: {
    marginHorizontal: wp(5),
    marginVertical: hp(1),
    gap: wp(5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    width: wp(8),
    height: hp(8),
  },
  myProjects: {
    marginHorizontal: wp(5),
  },
  showMoreButton: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(10),
    backgroundColor: Colors.sooprsblue,
    alignItems: 'center',
    marginBottom: hp(15),
    borderRadius: wp(2),
  },
  showMoreText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: wp(3.5),
  },
  noMoreText: {
    textAlign: 'center',
    marginBottom: hp(15),
    color: Colors.gray,
    fontSize: wp(3.5),
  },
});
