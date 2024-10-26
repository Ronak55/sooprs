import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import ProfessionalCard from './ProfessionalCard';
import { hp } from '../assets/commonCSS/GlobalCSS';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import FSize from '../assets/commonCSS/FSize';

const ProfessionalList = ({professionals, navigation }: { professionals:any, navigation: any }) => {
  // const [professionals, setProfessionals] = useState<any[]>([]);

  // const getProfessionals = () => {
  //   const formdata = new FormData();
  //   formdata.append('offset', 0);
  //   formdata.append('limit', 10);

  //   const requestOptions = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //     body: formdata,
  //   };

  //   fetch('https://sooprs.com/api2/public/index.php/get_professionals_ajax', requestOptions)
  //     .then(response => response.json())
  //     .then(res => {
  //       if (res.status === 200) {
  //         console.log('professional data:::::', res.msg);
  //         setProfessionals(res.msg);
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error fetching professionals:', error);
  //     });
  // };

  // useEffect(() => {
  //   getProfessionals();
  // }, []);

  const renderItem = ({ item, index }: { item: any, index:any }) => {
    // Extracting necessary fields from the data
    const {id, name, image, listing_about, slug} = item.data;
    const avgrating = item.avgrating;
    const services = item.services;
    const skills = item.skills;
    const img = image;

    return (
      <ProfessionalCard
        navigation={navigation}
        id={id}
        img={img}
        name={name}
        services={services}
        skills={skills}
        slug={slug}
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
        ListEmptyComponent={<Text style={{color:Colors.gray, textAlign:'center', fontSize:FSize.fs16}}>No professionals found !</Text>}
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
