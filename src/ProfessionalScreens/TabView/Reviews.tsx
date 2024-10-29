import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import * as Progress from 'react-native-progress'
import Images from '../../assets/image';
import { hp, wp } from '../../assets/commonCSS/GlobalCSS';
import Colors from '../../assets/commonCSS/Colors';

const Reviews = () => {
  const [reviews, setReviews] = useState([
    {
      id: '1',
      name: 'Emma',
      time: '3 months ago',
      rating: 4.9,
      text: 'I recently had the pleasure of shopping at Sooprs.com, and am thrilled to share my experience.',
      image: Images.reviewerone,
    },
    {
      id: '2',
      name: 'John',
      time: '2 months ago',
      rating: 4.5,
      text: 'Great experience with the services provided by Sooprs.com.',
      image: Images.reviewertwo,
    },
    {
      id: '3',
      name: 'Anna',
      time: '1 month ago',
      rating: 4.7,
      text: 'Amazing quality and customer service!',
      image: Images.reviewerthree,
    },
  ]);

  // Future: Fetch reviews from an API
  // useEffect(() => {
  //   fetchReviewsFromAPI();
  // }, []);

  const renderReview = ({ item } : {item:any}) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={item.image} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </View>
      <View style={styles.ratingContainer}>
        {Array.from({ length: 5 }, (_, index) => (
          <Text key={index} style={[styles.star, index < Math.floor(item.rating) ? styles.filledStar : styles.emptyStar]}>★</Text>
        ))}
        <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
      </View>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default Reviews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: wp(2),
    paddingHorizontal:wp(5),
    paddingTop:hp(1)
  },
  list: {
    paddingBottom: hp(2),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: wp(4),
    marginVertical: hp(1),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },

  ratingsInfo:{

    flexDirection:'row',
    justifyContent:'space-between'
  },
  avatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    marginRight: wp(3),
  },
  name: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color:Colors.black
  },
  time: {
    fontSize: wp(3.5),
    color: 'gray',

  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  star: {
    fontSize: wp(4),
  },
  filledStar: {
    color: '#F4DE25',
  },
  emptyStar: {
    color: '#dcdcdc',
  },
  rating: {
    marginLeft: wp(2),
    fontSize: wp(4),
    color: 'gray',
  },
  text: {
    fontSize: wp(3),
    color:Colors.black
  },
  ratingOverview: {
    flexDirection: 'column',
    // alignItems: 'center',
    marginBottom: hp(2),
  },
  ratingScore: {
    fontSize: wp(18),
    fontWeight: 'bold',
    color: Colors.black
  },
  starContainer: {
    flexDirection: 'row',
    marginLeft: wp(2),
  },
  progressBars: {
    marginBottom: hp(2),
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  progressBarLabel: {
    color: 'gray',
    fontWeight:'600',
    width: wp(5),
    
  },
});