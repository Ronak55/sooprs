import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Images from '../../assets/image';
import Colors from '../../assets/commonCSS/Colors';
import FSize from '../../assets/commonCSS/FSize';
import {hp, wp} from '../../assets/commonCSS/GlobalCSS';
import {useIsFocused} from '@react-navigation/native';
import ProjectCard from '../../components/ProjectCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ButtonNew from '../../components/ButtonNew';

const Projects = ({navigation}) => {
  const [bidProjects, setBidProjects] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [offset, setOffset] = useState(0); 
  const [hasMore, setHasMore] = useState(true);
  const [newLoading, setnewLoading] = useState(false)

  const isFocused = useIsFocused();

  const getMyProjects = async (newOffset = 0, refreshing = false) => {
    if (isLoading && !refreshing) return; 
    refreshing ? setIsRefreshing(true) : setIsLoading(true);

    try {
      let id = await AsyncStorage.getItem('uid');

      if (id) {
        id = id.replace(/^"|"$/g, ''); 
      }

      const formdata = new FormData();
      formdata.append('offset', newOffset); 
      formdata.append('limit', 10); 
      formdata.append('my_get_id', id); 

      const response = await fetch(
        'https://sooprs.com/api2/public/index.php/get_my_leads',
        {
          method: 'POST',
          body: formdata,
          headers: {},
        }
      );
      const responseData = await response.json();

      if (responseData.status === 200) {
        if (responseData.msg.length === 0 && !refreshing) {
          setHasMore(false); 
        } else {
          console.log('bidded projects :::::::::::::', responseData.msg);
          const newProjects = responseData.msg.filter(
            (project) =>
              !bidProjects.some((existingProject) => existingProject.id === project.id)
          );
          setBidProjects([...bidProjects, ...newProjects]);
        }
      } else if (responseData.status === 400) {
        console.error('An error has occurred!');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      refreshing ? setIsRefreshing(false) : setIsLoading(false);
    }
  };

  const addMyProjects = async(newOffset:number)=>{
  
      try {
        let id = await AsyncStorage.getItem('uid');
  
        if (id) {
          id = id.replace(/^"|"$/g, ''); 
        }
  
        const formdata = new FormData();
        formdata.append('offset', newOffset); 
        formdata.append('limit', 10); 
        formdata.append('my_get_id', id); 
  
        const response = await fetch(
          'https://sooprs.com/api2/public/index.php/get_my_leads',
          {
            method: 'POST',
            body: formdata,
            headers: {},
          }
        );
        const responseData = await response.json();
  
        if (responseData.status === 200) {
          if (responseData.msg.length === 0) {
            setHasMore(false); 
          } else {
            const newProjects = responseData.msg.filter(
              (project) =>
                !bidProjects.some((existingProject) => existingProject.id === project.id)
            );
            setBidProjects([...bidProjects, ...newProjects]);
          }
        } else if (responseData.status === 400) {
          console.error('An error has occurred!');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } 
    };

  useEffect(() => {
    getMyProjects(0, false); 
  }, [isFocused]);

  const loadMoreProjects = async() => {
    const newOffset = offset + 10;
    setOffset(newOffset);
    setnewLoading(true);
    await addMyProjects(newOffset); 
    setnewLoading(false)
  };

  const renderFooter = () => {
    if (isLoading && !isRefreshing) {
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
        <View style={styles.showMoreButton}>
        <ButtonNew
                imgSource={undefined}
                btntext={
                  newLoading ? (
                    <ActivityIndicator color={Colors.white} />
                  ) : (
                    'Show More'
                  )
                }
                bgColor={Colors.sooprsblue}
                textColor={Colors.white}
                onPress={loadMoreProjects}
                isDisabled={newLoading} // Disable button while loading
                isBorder={true}
              />
          </View>
      );
    }

    return <Text style={styles.noMoreText}>No more projects !</Text>;
  };

  const renderItem = ({item, index}) => (
    <ProjectCard
      navigation={navigation}
      name={item.project_title}
      id={item.id}
      desc={item.description}
      category={item.service_name}
      budget={`$${item.min_budget} - $${item.max_budget_amount}`}
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
        <TouchableOpacity onPress={() => navigation.navigate('ProfessionalHome')}>
          <Image source={Images.backArrow} resizeMode="contain" style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Projects</Text>
      </View>
      <View style={styles.myProjects}>
        {isRefreshing && (
          <Text style={styles.loadingText}>Loading My Projects...</Text>
        )}
        <FlatList
          data={bidProjects}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => getMyProjects(0, true)}
              colors={[Colors.sooprsblue]}
            />
          }
          ListEmptyComponent={() => (
            <Text style={styles.emptyMessage}>No projects found !</Text>
          )}
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
  headerTitle: {
    color: Colors.black,
    fontWeight: '500',
    fontSize: FSize.fs16,
  },
  myProjects: {
    marginHorizontal: wp(5),
  },
  loadingText: {
    textAlign: 'center',
    color: Colors.gray,
    fontSize: FSize.fs14,
    marginVertical: hp(1),
  },
  showMoreButton: {
    marginTop:hp(2),
    marginBottom: hp(10),
  },

  noMoreText: {
    textAlign: 'center',
    marginBottom: hp(15),
    color: Colors.gray,
    fontSize: wp(3.5),
  },

  emptyMessage: { 
    textAlign: 'center',
    marginTop: hp(35),
    color: 'gray',
    fontSize: FSize.fs14,
  },
});
