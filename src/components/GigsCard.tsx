import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../assets/commonCSS/Colors'; // Adjust the path if needed
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import Images from '../assets/image';
import FSize from '../assets/commonCSS/FSize';

const GigsCard = ({
  gigsImg,
  gigsCategory,
  gigsTitle,
  gigsDesc,
  authorImg,
  authorName,
  rating,
  ratingCount,
}: {
  gigsImg: any;
  gigsCategory: any;
  gigsTitle: any;
  gigsDesc: any;
  authorImg: any;
  authorName: any;
  rating: any;
  ratingCount: any;
}) => {
  return (
    <TouchableOpacity style={styles.card}>
        <Image source={gigsImg} style={styles.image} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.gigsCategory}>{gigsCategory}</Text>
        <Text style={styles.gigsTitle}>{gigsTitle}</Text>
        <Text style={styles.gigsDesc}>{gigsDesc}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.authorInfo}>
            <Image
              source={authorImg}
              resizeMode="contain"
              style={styles.authorImg}
            />
            <Text style={styles.authorName}>By {authorName}</Text>
          </View>
          <View style={styles.ratingStyle}>
            <Image
              style={styles.starIcon}
              source={Images.starIcon}
              resizeMode="contain"
            />
            <Text style={styles.rating}>{rating}</Text>
            <Text style={styles.ratingCount}>({ratingCount})</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GigsCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 5,
    padding: wp(2),
    // marginHorizontal: wp(1),
    width: wp(65),
    height: hp(49.5),
    marginRight: wp(4),
    // alignItems: 'center',
    elevation: 2, 
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

//   imgBack: {
//     width: '100%',
//     height: '100%',
//   },

  image: {
    width: "100%", 
    height: "60%",
    // borderRadius: 50,
  },

  info: {
    marginHorizontal:wp(1),
    flexDirection:'column',
    marginTop:hp(2),
    gap:hp(0.2)
    // alignItems: 'center',
  },

  gigsCategory:{
    fontSize:FSize.fs12,
    fontWeight:"500",
    color:Colors.sooprsblue
  },

  gigsTitle:{
        fontSize: FSize.fs16,
        fontWeight: 'bold',
        color: Colors.black,
  },

  gigsDesc:{
    fontSize: FSize.fs12,
    color: Colors.gray,
  },

  cardFooter:{

    flexDirection:'row',
    justifyContent:'space-around',
    paddingBottom:hp(4)
  },
  authorInfo:{

    flexDirection:'row',
    width:wp(40),
    gap:6,
    alignItems:'center'
  },

  authorImg:{

    borderRadius:wp(10),
    width:wp(8),
    height:hp(8),
  },

  authorName:{

    fontSize: FSize.fs12,
    color: Colors.gray,
    fontWeight:'600'
  },

  ratingStyle:{

    flexDirection:'row',
   alignItems:'center'

  },

  starIcon:{
    width:wp(3),
    height:hp(3)
  },

  rating: {
    fontSize: FSize.fs12,
    fontWeight:'600',
    color: Colors.black
  },

  ratingCount:{

    fontSize: FSize.fs12,
    color:Colors.gray

  }

});
