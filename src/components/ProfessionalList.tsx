import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import ProfessionalCard from './ProfessionalCard';
import { hp } from '../assets/commonCSS/GlobalCSS';

const ProfessionalList = ({ navigation }: { navigation: any }) => {
  const [professionals, setProfessionals] = useState<any[]>([]);

  const getProfessionals = () => {
    const formdata = new FormData();
    formdata.append('offset', 0);
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
        if (res.status === 200) {
          console.log('professional data:::::', res.msg);
          setProfessionals(res.msg);
        }
      })
      .catch(error => {
        console.error('Error fetching professionals:', error);
      });
  };

  useEffect(() => {
    getProfessionals();
  }, []);

  const renderItem = ({ item, index }: { item: any, index:any }) => {
    // Extracting necessary fields from the data
    const { name, image, listing_about } = item.data;
    const avgrating = item.avgrating;
    const services = item.services;
    const skills = item.skills;
    const img = image ? image : 'default-image-url'; // Provide a fallback if no image is available

    return (
      <ProfessionalCard
        navigation={navigation}
        img={img}
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
    <View style={styles.ProfessionalList}>
      <FlatList
        data={professionals}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default ProfessionalList;

const styles = StyleSheet.create({
  ProfessionalList: {
    marginTop: hp(2),
    width: '100%',
    height: hp(24),
  },
});
