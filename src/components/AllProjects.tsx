import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import Colors from '../assets/commonCSS/Colors';
import {hp, wp} from '../assets/commonCSS/GlobalCSS'; // Import hp and wp for responsiveness
import ProjectCard from './ProjectCard';

const AllProjects = ({
  navigation,
  projectDetail,
  isLoading,
  hasMore,
  loadMoreProjects,
}: {
  navigation: any;
  projectDetail: any[];
  isLoading: boolean;
  hasMore: boolean;
  loadMoreProjects: () => void;
}) => {
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
      Customer_name={undefined}
      customer_id={undefined}
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
