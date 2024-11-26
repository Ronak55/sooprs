import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList,
    RefreshControl,
  } from 'react-native';
  import React, {useEffect, useState, useCallback} from 'react';
  import {hp, wp} from '../../assets/commonCSS/GlobalCSS';
  import Images from '../../assets/image';
  import Colors from '../../assets/commonCSS/Colors';
  import FSize from '../../assets/commonCSS/FSize';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import {useIsFocused} from '@react-navigation/native';
  import ProjectCard from '../../components/ProjectCard';
  
  const AssignedProjects = ({navigation}: {navigation: any}) => {
    const [assignedProjects, setAssignedProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  
    const isFocused = useIsFocused();
  
    const getAssignedProjects = async () => {
      try {
        let id = await AsyncStorage.getItem('uid');
  
        if (id) {
          id = id.replace(/^"|"$/g, '');
        }
  
        console.log('unique id:::::::::::', id);
  
        const formdata = new FormData();
        formdata.append('variable', id);
  
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
          setAssignedProjects(responseData.msg || []);
        } else if (responseData.status === 400) {
          console.error('An error has occurred!');
          setAssignedProjects([]); 
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false); // Stop loading after data is fetched
        setRefreshing(false); // Stop refreshing after data is reloaded
      }
    };
  
    useEffect(() => {
      getAssignedProjects();
    }, [isFocused]);
  
    // Refresh handler for pull-to-refresh
    const onRefresh = useCallback(() => {
      setRefreshing(true); // Start refreshing
      getAssignedProjects(); // Fetch updated data
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
        isAssigned={true}
        isProfessional={false}
        bidId={item.myLeadId}
        Customer_name={item.prof_name}
        customer_id={item.professional_id}
        project_status={item.project_status}
      />
    );
  
    const renderContent = () => {
      if (loading && !refreshing) {
        return <Text style={styles.message}>Loading assigned projects...</Text>;
      }
  
      if (assignedProjects.length === 0 && !refreshing) {
        return <Text style={styles.message}>No assigned projects found!</Text>;
      }
  
      return (
        <FlatList
          data={assignedProjects}
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
  
  export default AssignedProjects;
  
  const styles = StyleSheet.create({
    projectsList: {
      backgroundColor: Colors.white,
      flex: 1,
      marginHorizontal: wp(2),
      justifyContent: 'center',
      alignItems: 'center',
    },
    message: {
      fontSize: 18,
      color: Colors.black,
      textAlign: 'center',
      marginTop: wp(10),
    },
  });
  