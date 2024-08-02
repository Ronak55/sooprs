import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import Images from '../assets/image';
import { wp, hp } from '../assets/commonCSS/GlobalCSS';
import FSize from '../assets/commonCSS/FSize';

const ProfileCard = ({ id, name, des, img, isSelected, onRadioChange }:{id:any, name:any, des:any, img:any, isSelected:any, onRadioChange:any}) => {
  return (
    <TouchableOpacity
      style={[styles.profileCard, isSelected && styles.selectedCard]}
      onPress={() => onRadioChange(id)}
      activeOpacity={0.8}>
      <View style={styles.profileDetails}>
        <Image style={styles.imageLogo} source={img} />
        <View style={styles.profileInfo}>
          <Text style={styles.profilename}>Join as a {name}</Text>
          <Text style={styles.profiledesc}>{des}</Text>
        </View>
        <View style={styles.radioButtonContainer}>
          <View style={[styles.radioButton, isSelected && styles.radioButtonSelected]} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  profileCard: {
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    width: wp(82),
    height: hp(8),
    borderRadius: 5,
    padding: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  imageLogo: {
    width: wp(14),
    height: hp(7),
    resizeMode: 'contain',
  },
  profileDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileInfo: {
    marginLeft: wp(3),
  },
  profilename: {
    color: 'black',
    fontWeight: '700',
    fontSize: FSize.fs14,
  },
  profiledesc: {
    color: '#6B6B6B',
    fontSize: FSize.fs11,
  },
  radioButtonContainer: {
    marginLeft: 'auto',
  },
  radioButton: {
    height: wp(4),
    width: wp(4),
    marginRight:wp(3),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: '#6B6B6B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#0077FF',
  },
});
