import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../assets/commonCSS/Colors'; // Adjust the path if needed
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import Images from '../assets/image';
import FSize from '../assets/commonCSS/FSize';
import ButtonNew from './ButtonNew';

const ProfessionalCard = ({
  id,
  navigation,
  img,
  name,
  slug,
  services,
  skills,
  avgrating,
  listing_about,
  index,
}: {
  id: any;
  navigation: any;
  img: any;
  name: any;
  slug: any;
  services: any;
  skills: any;
  avgrating: any;
  listing_about: any;
  index: any;
}) => {
  const backgroundColor = index % 2 === 0 ? '#407BFF1A' : '#FFFBDC';

  const getLimitedBio = (listing_about: string) => {
    const limit = 20; // Set character limit to 50
    if (!listing_about) return ''; // Handle cases where listing_about is null or undefined
    return listing_about.length > limit
      ? `${listing_about.substring(0, limit)}...`
      : listing_about;
  };

  return (
    <View>
      <TouchableOpacity style={styles.card}  onPress={() => {
              navigation.navigate('ProfessionalProfile', {
                id,
                img,
                name,
                slug,
                services,
                skills,
                avgrating,
                listing_about,
              });
            }}>
        <View style={styles.imgBack}>
          <Image
            source={img !== "default-image-url" ? {uri: img} : Images.defaultPicIcon}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.role}>{getLimitedBio(listing_about)}</Text>
          <View style={styles.ratingStyle}>
            <Image
              style={styles.starIcon}
              source={Images.starIcon}
              resizeMode="contain"
            />
            <Text style={styles.rating}>{avgrating} / 5</Text>
          </View>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Colors.sooprsblue,
              borderRadius: wp(2),
              paddingHorizontal: wp(5),
              paddingVertical: hp(1),
            }}
            onPress={() => {
              navigation.navigate('ProfessionalProfile', {
                id,
                img,
                name,
                slug,
                services,
                skills,
                avgrating,
                listing_about,
              });
            }}>
            <Text style={{fontSize: FSize.fs10, color: Colors.white}}>
              View Profile
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: wp(4),
    // padding: 10,
    // marginHorizontal: 10,
    padding: wp(1),
    width: wp(42.5),
    height: hp(26),
    marginTop: hp(1),
    marginBottom: hp(4),
    paddingTop: hp(0.5),
    marginRight: wp(3),
    marginLeft: wp(0.5),
    paddingBottom: hp(5),
    // alignItems: 'center',
    elevation: 3, // Shadow for Android
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  imgBack: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: wp(20), // Adjust as needed
    height: hp(10), // Adjust as needed
    borderRadius: wp(10),
  },
  info: {
    marginVertical: hp(1.5),
    marginHorizontal: wp(3),
    flexDirection: 'column',
    gap: 2,
    alignItems: 'center',
  },
  name: {
    fontSize: FSize.fs14,
    fontWeight: 'bold',
    color: Colors.black,
  },
  role: {
    fontSize: FSize.fs12,
    color: Colors.gray,
  },
  rating: {
    fontSize: FSize.fs12,
    color: Colors.black,
  },

  ratingStyle: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },

  starIcon: {
    width: wp(3),
    height: hp(3),
  },

  arrowBtn: {
    marginLeft: wp(20),
  },

  arrow: {
    width: wp(3.5),
    height: hp(3.5),
  },
});

export default ProfessionalCard;
