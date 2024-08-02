import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import React from 'react';
import Images from '../assets/image';
import { hp, wp } from '../assets/commonCSS/GlobalCSS';
import Colors from '../assets/commonCSS/Colors';
import ProfessionalCard from './ProfessionalCard';
import { data } from './CombindedData';

const ProfessionalList = ({ navigation }: { navigation: any }) => {
  // Flatten the array of professionals
  const professionalData = data.flatMap(category => category.professionals);

  // console.log("pro data::::::::", professionalData)

  const renderItem = ({ item, index }: { item: any, index: any }) => (
    <ProfessionalCard
      navigation={navigation}
      img={item.img}
      name={item.name}
      role={item.role}
      rating={item.rating}
      index={index}
    />
  );

  return (
    <View style={styles.ProfessionalList}>
      <FlatList
        data={professionalData}
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
