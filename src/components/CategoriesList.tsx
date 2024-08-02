import {StyleSheet, Text, View, Image, FlatList} from 'react-native';
import React from 'react';
import Images from '../assets/image';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import Colors from '../assets/commonCSS/Colors';
import ProfessionalCard from './ProfessionalCard';
import {data} from './CombindedData';
import FSize from '../assets/commonCSS/FSize';
import CategoriesCard from './CategoriesCard';

const CategoriesList = ({navigation}: {navigation: any}) => {
  // Map the data to get the category names and professionals

  const renderCategories = ({item, index}: {item: any, index:any}) => {
    return (
        <CategoriesCard
          navigation={navigation}
          img={item.img}
          name={item.category}
          index={index}
        />
    );
  };

  const renderCategoryandProfessionals = ({item}: {item: any}) => {
    return (
      <View style={styles.categoryContainer}>
        <View style={styles.categoryTitles}>
        <Text style={styles.categoryTitle}>{item.category.split(' ')[0]} </Text>
        <Text style={[styles.categoryTitle, styles.blueTitle]}>{item.category.split(' ')[1]}</Text>
        </View>
        <FlatList
          data={item.professionals}
          renderItem={({item, index}: {item: any; index: any}) => (
            <ProfessionalCard
              navigation={navigation}
              img={item.img}
              name={item.name}
              role={item.role}
              rating={item.rating}
              index={index}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
     <View style={styles.CategoriesList}>
         <FlatList
        data={data}
        renderItem={renderCategories}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
     </View>
      <FlatList
        data={data}
        renderItem={renderCategoryandProfessionals}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default CategoriesList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: hp(2),
    width: '100%',
  },
  categoryContainer: {
    
  },

  CategoriesList: {
    marginTop: hp(2),
    width: '100%',
    // height: hp(20),
    // marginBottom:hp(5)
  },

  categoryTitles:{

    flexDirection:'row'
  },

  categoryTitle: {
    fontSize: FSize.fs20,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: hp(3),
  },

  blueTitle:{

    color:Colors.sooprsblue
  }
});
