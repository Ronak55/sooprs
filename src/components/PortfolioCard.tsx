import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { hp, wp } from '../assets/commonCSS/GlobalCSS';
import Colors from '../assets/commonCSS/Colors';
import FSize from '../assets/commonCSS/FSize';

const PortfolioCard = ({ item } : {item:any}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={()=>{}}>
      <Image source={item.img} style={styles.image} resizeMode='cover'/>
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: wp(2),
    padding: wp(1),
    // alignItems: 'center',
    // justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  image: {
    width: wp(42),
    height: hp(20),
    borderRadius: 10,
    marginBottom: wp(3),
  },
  name: {
    fontSize: FSize.fs12,
    fontWeight: 'bold',
    textAlign: 'center',
    color:Colors.black
  },
});

export default PortfolioCard;
