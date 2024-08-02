import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React from 'react';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';

const ButtonNew = ({
  imgSource,
  btntext,
  bgColor,
  textColor,
  onPress
}: {
  imgSource: any;
  btntext: any;
  bgColor: any;
  textColor: any;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: bgColor,
        borderWidth: 1,
        borderColor: '#0077FF',
        alignItems: 'center',
        justifyContent: 'center',
        width: wp(82),
        height: hp(6),
        borderRadius: wp(2),
        marginBottom:hp(2)
      }}
      onPress={onPress} >
      {imgSource ? (
        <View style={styles.imageText}>
          <Image
            source={imgSource}
            resizeMode="contain"
            style={styles.imageStyling}></Image>
          <Text style={{color: textColor, fontWeight: '500'}}>{btntext}</Text>
        </View>
      ) : (
        <Text style={{color: textColor, fontWeight: '500'}}>{btntext}</Text>
      )}
    </TouchableOpacity>
  );
};

export default ButtonNew;

const styles = StyleSheet.create({
  imageStyling: {
    width: '8%',
    height: '100%',
    marginRight:wp(2)
  },

  imageText: {
    flexDirection: 'row',
  },
});
