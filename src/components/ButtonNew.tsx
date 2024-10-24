import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React from 'react';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import FSize from '../assets/commonCSS/FSize';

const ButtonNew = ({
  imgSource,
  btntext,
  bgColor,
  textColor,
  onPress,
  isDisabled
}: {
  imgSource: any;
  btntext: any;
  bgColor: any;
  textColor: any;
  onPress: () => void;
  isDisabled:any
}) => {
  return (
    <TouchableOpacity
      disabled={isDisabled}
      style={{
        backgroundColor: bgColor,
        borderWidth: 1,
        borderColor: '#0077FF',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal:wp(20),
        paddingVertical:hp(1.5),
        // height: hp(5.5),
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
          <Text style={{color: textColor, fontWeight: '500', fontSize:FSize.fs13}}>{btntext}</Text>
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
