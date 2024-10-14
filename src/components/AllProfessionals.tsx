import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import ProfessionalCard from './ProfessionalCard';
import { hp, wp } from '../assets/commonCSS/GlobalCSS';
import Colors from '../assets/commonCSS/Colors'; // Assuming you have a Colors file
import Images from '../assets/image';

const AllProfessionals = ({ navigation, selectedService }: { navigation: any, selectedService:any }) => {

  const [professionals, setProfessionals] = useState<any[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<any[]>([]); // State for filtered professionals
  const [offset, setOffset] = useState(0); // Track offset for pagination
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [showMore, setShowMore] = useState(true); 

  // Fetch professionals from the API
  const getProfessionals = () => {
    setIsLoading(true); // Show the loader
    const formdata = new FormData();
    formdata.append('offset', offset);
    formdata.append('limit', 10);

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formdata,
    };

    fetch('https://sooprs.com/api2/public/index.php/get_professionals_ajax', requestOptions)
      .then(response => response.json())
      .then(res => {
        if (res.status === 200 && res.msg.length > 0) {
          console.log('all professionals :::::::::', res.msg);
          const newProfessionals = res.msg.filter(pro => !professionals.some(existing => existing.id === pro.id)); // Filter out duplicates

          if (newProfessionals.length > 0) {

            setProfessionals(prev => [...prev, ...newProfessionals]);
          } else {
            // No new professionals to load
            setShowMore(false);
          }
        } else {
          // If no more data is returned, disable "Show More" and show "No more professionals!"
          setShowMore(false);
        }
      })
      .catch(error => {
        console.error('Error fetching professionals:', error);
      })
      .finally(() => setIsLoading(false)); // Hide the loader
  };

  useEffect(() => {
    console.log('service selected name:::::::::', selectedService)
    if (selectedService) {
      const filtered = professionals.filter(professional => 
        professional.services && professional.services.includes(selectedService)
      );
      setFilteredProfessionals(filtered);
    } else {
      setFilteredProfessionals(professionals); // Show all if no service name is provided
    }
  }, [professionals, selectedService]);

  // Initial API call
  useEffect(() => {
    getProfessionals();
  }, [offset]);

  // Load more professionals by increasing the offset
  const loadMoreProfessionals = () => {
    setOffset(prevOffset => prevOffset + 1); // Increment the offset
  };

  // Render individual professional cards
  const renderItem = ({ item, index }: { item: any, index: any }) => {
    const {id, name, image, listing_about } = item.data;
    const avgrating = item.avgrating;
    const services = item.services;
    const skills = item.skills;

    return (
      <ProfessionalCard
        navigation={navigation}
        id={id}
        img={image}
        name={name}
        services={services}
        skills={skills}
        avgrating={avgrating}
        listing_about={listing_about}
        index={index}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProfessionals}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2} // Display 2 cards per row
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          isLoading ? (
            <ActivityIndicator size="large" color="#0077FF" style={styles.loader} />
          ) : showMore ? (
            <TouchableOpacity style={styles.showMoreButton} onPress={loadMoreProfessionals}>
              <Text style={styles.showMoreText}>Show More</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.noMoreText}>No more professionals!</Text> // Show this when no more professionals are available
          )
        }
      />
    </View>
  );
};

export default AllProfessionals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4), 
    paddingVertical: hp(2),
  },
  loader: {
    marginVertical: hp(2), // Add margin around the loader
  },
  showMoreButton: {
    padding: wp(4), // Add padding for the button
    backgroundColor: '#0077FF',
    borderRadius: wp(2), // Rounded corners
    alignItems: 'center', // Center the text
    marginVertical: hp(2), // Spacing around the button
  },
  showMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noMoreText: {
    color: Colors.gray, // Using gray color for "No more professionals" message
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: hp(2),
  },
});
