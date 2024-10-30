import { StyleSheet, Text, View, StatusBar, Image, ScrollView, RefreshControl, ActivityIndicator, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { wp, hp } from '../../assets/commonCSS/GlobalCSS'
import Colors from '../../assets/commonCSS/Colors'
import FSize from '../../assets/commonCSS/FSize'
import Header from '../../components/Header'
import Images from '../../assets/image'
import SearchBar from '../../components/SearchBar'
import Filter from '../../components/Filter'
import IntroCard from '../../components/IntroCard'
import AllProjects from '../../components/AllProjects'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import { mobile_siteConfig } from '../../services/mobile-siteConfig'

const {width} = Dimensions.get('window');

const Home = ({ navigation }: { navigation: any }) => {
  const [name, setName] = useState('');
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [newloading, setNewLoading] = useState(false)

  // States to manage project data and API response
  const [projectDetail, setProjectDetail] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [profilePic, setProfilePic] = useState(null); 
  const [filteredProjects, setFilteredProjects] = useState([]);

  const getNameAndImage = async () => {
    try {
      const name = await AsyncStorage.getItem(mobile_siteConfig.NAME);
      const profilepic = await AsyncStorage.getItem(mobile_siteConfig.PROFILE_PIC);

      const parsedprofilepic = JSON.parse(profilepic);

      console.log("profile image::::::::::", parsedprofilepic);

      const parsedName = JSON.parse(name);
      if (name !== null) {
        setName(parsedName ?? '');
      }
      if (parsedprofilepic) {
        setProfilePic(parsedprofilepic);
      } 
    } catch (e) {
      console.log('Error retrieving profile details:', e);
    }
  };

  const getProjects = async (newOffset: number) => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    setLoadingMessage('Loading projects...');

    try {
      const formdata = new FormData();
      formdata.append('offset', newOffset);
      formdata.append('limit', 10);

      const response = await fetch(
        'https://sooprs.com/api2/public/index.php/get_all_leads',
        {
          method: 'POST',
          body: formdata,
          headers: {},
        },
      );
      const responseData = await response.json();

      if (responseData.status === 200) {
        if (responseData.msg.length === 0) {
          setHasMore(false);
        } else {

          console.log('all projects response::::::::::', responseData.msg);

          const newProjects = responseData.msg.filter(
            (project) =>
              !projectDetail.some(
                (existingProject) => existingProject.id === project.id,
              ),
          );
          setProjectDetail((prevProjects) => [
            ...prevProjects,
            ...newProjects,
          ]);
        }
      } else if (responseData.status === 400) {
        console.error('An error has occurred!');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
      setLoadingMessage(''); // Clear loading message after fetching
    }
  };

  const addNewProjects = async (newOffset: number) => {

    try {
      const formdata = new FormData();
      formdata.append('offset', newOffset);
      formdata.append('limit', 10);

      const response = await fetch(
        'https://sooprs.com/api2/public/index.php/get_all_leads',
        {
          method: 'POST',
          body: formdata,
          headers: {},
        },
      );
      const responseData = await response.json();

      if (responseData.status === 200) {
        if (responseData.msg.length === 0) {
          setHasMore(false);
        } else {
          const newProjects = responseData.msg.filter(
            (project) =>
              !projectDetail.some(
                (existingProject) => existingProject.id === project.id,
              ),
          );
          setProjectDetail((prevProjects) => [
            ...prevProjects,
            ...newProjects,
          ]);
        }
      } else if (responseData.status === 400) {
        console.error('An error has occurred!');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
      setLoadingMessage(''); // Clear loading message after fetching
    }
  };

  useEffect(() => {
    if (isFocused) {
      getProjects(0);
      getNameAndImage();
    }
  }, [isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    setLoadingMessage('Refreshing projects...');
    await getProjects(0); // Refresh projects
    setRefreshing(false); // Set refreshing to false after fetching
  };

  const loadMoreProjects = async() => {
    const newOffset = offset + 10; // Increment offset
    setOffset(newOffset);
    setNewLoading(true);
    await addNewProjects(newOffset);
    setNewLoading(false);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.sooprsblue}
            colors={[Colors.sooprsblue, Colors.black]}
          />
        }>
        <Header
          navigation={navigation}
          img={profilePic}
          name={name || 'user'}
          btnName=""
          isClient={false}
        />
        <View style={styles.section}>
          <View style={styles.textAlign}>
            <Text style={styles.homeInfo}>Browse </Text>
            <Text style={[styles.homeInfo, styles.profText]}>Client Needs</Text>
            <Text style={styles.homeInfo}> and</Text>
            <Text style={styles.homeInfo}> Offer</Text>
            <Text style={[styles.homeInfo, styles.profText]}>
              Your Expertise
            </Text>
          </View>
          <View style={styles.searchFilter}>
            <SearchBar placeholderName="Projects" />
            {/* <Filter setFilteredProjects={setFilteredProjects}/> */}
          </View>
          {/* <IntroCard
            cardText="Discover projects with ease!"
            showBtn={true}
            img={Images.introLogo}
            bgColor={['#0077FF', '#D6E9FF']}
            cardbgColor="#D4E3FC24"
          /> */}
          {loadingMessage ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.sooprsblue} />
            </View>
          ) : (
            filteredProjects.length > 0 ? (
              <AllProjects
              navigation={navigation}
              projectDetail={filteredProjects}
            />
            ) : (
              <AllProjects
              navigation={navigation}
              projectDetail={projectDetail}
              isLoading={isLoading}
              hasMore={hasMore}
              loadMoreProjects={loadMoreProjects}
              newLoading={newloading}
            />
            )
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  section: {
    marginHorizontal: wp(5),
    marginVertical: hp(5),
  },
  homeInfo: {
    color: Colors.black,
    fontWeight: '600',
    fontSize: FSize.fs19,
  },

  textAlign: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  profText:{

    color:Colors.sooprsblue
  },

  searchFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    gap: wp(2),
    marginHorizontal:wp(1),
    // width:width/1.3
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(2),
  },
})