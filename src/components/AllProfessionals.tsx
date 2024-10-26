import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import ProfessionalCard from './ProfessionalCard';
import { hp, wp } from '../assets/commonCSS/GlobalCSS';
import Colors from '../assets/commonCSS/Colors'; // Assuming you have a Colors file

const AllProfessionals = ({ navigation, selectedService }: { navigation: any, selectedService:any }) => {
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<any[]>([]); 
  const [offset, setOffset] = useState(0); 
  const [isLoading, setIsLoading] = useState(false); 
  const [showMore, setShowMore] = useState(true); 

  const getProfessionals = async () => {
    setIsLoading(true);
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
  
    try {
      const response = await fetch('https://sooprs.com/api2/public/index.php/get_professionals_ajax', requestOptions);
      const res = await response.json();
  
      if (res.status === 200 && res.msg.length > 0) {
        console.log('all professionals :::::::::', res.msg);
        const newProfessionals = res.msg.filter(pro => 
          !professionals.some(existing => existing.id === pro.id)
        ); 

        if (newProfessionals.length > 0) {
          setProfessionals(prev => [...prev, ...newProfessionals]);
        } else {
          setShowMore(false);
        }
      } else {
        setShowMore(false);
      }
    } catch (error) {
      console.error('Error fetching professionals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedService) {
      const filtered = professionals.filter(professional => 
        professional.services && professional.services.includes(selectedService)
      );
      setFilteredProfessionals(filtered);
    } else {
      setFilteredProfessionals(professionals);
    }
  }, [professionals, selectedService]);

  useEffect(() => {
    const fetchProf = async() => {
      await getProfessionals();
    };
    fetchProf();
  }, [offset]);

  const loadMoreProfessionals = () => {
    setOffset(prevOffset => prevOffset + 1);
  };

  const renderItem = ({ item }: { item: any }) => {
    const { id, name, image, listing_about, slug } = item.data;
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
        slug={slug}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProfessionals}
        renderItem={renderItem}
        keyExtractor={(item) => item.data.id.toString()} // Use a unique key for each item
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <>
            {isLoading ? (
              <ActivityIndicator size="large" color="#0077FF" style={styles.loader} />
            ) : showMore ? (
              <TouchableOpacity style={styles.showMoreButton} onPress={loadMoreProfessionals}>
                <Text style={styles.showMoreText}>Show More</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.noMoreText}>No more professionals!</Text>
            )}
          </>
        }
      />
    </View>
  );
};

export default AllProfessionals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: hp(4), // Ensure space for the footer
  },
  loader: {
    marginVertical: hp(2),
  },
  showMoreButton: {
    padding: wp(4),
    backgroundColor: '#0077FF',
    borderRadius: wp(2),
    alignItems: 'center',
    marginVertical: hp(2),
  },
  showMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noMoreText: {
    color: Colors.gray,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: hp(2),
  },
});
