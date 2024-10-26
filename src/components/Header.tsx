import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import Images from '../assets/image';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import Colors from '../assets/commonCSS/Colors';
import FSize from '../assets/commonCSS/FSize';

const Header = ({
  navigation,
  img,
  name,
  btnName,
  isClient,
}: {
  navigation: any;
  img: any;
  name: String;
  btnName: String;
  isClient: any;
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Account');
        }}>
        <View style={[styles.profileIcon]}>
          <Image style={styles.Icon} resizeMode="cover" source={img ? {uri:img} : Images.profileImage} />
        </View>
      </TouchableOpacity>
      <Text style={styles.greetText}>Hello, {name}</Text>
      <Image
        source={Images.helloIcon}
        resizeMode="contain"
        style={styles.hello}
      />
      <View
        style={{
          paddingHorizontal: btnName ? wp(8) : wp(35),
          flexDirection: 'row',
          gap: 15,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Notifications');
          }}>
          <Image
            source={Images.bellIcon}
            resizeMode="contain"
            style={styles.bellIcon}
          />
        </TouchableOpacity>
        {btnName && (
          <TouchableOpacity
            style={styles.postButton}
            onPress={() => {
              navigation.navigate('ProjectPosting');
            }}>
            <Text style={styles.postbuttonText}>{btnName}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#DFF3FC87',
    height: hp(10),
    flexDirection: 'row',
    paddingHorizontal: wp(5),
    alignItems: 'center',
    gap: wp(3),
  },

  
  profileIcon: {
    width: wp(10),
    height: hp(5),
    borderWidth: 2,
    borderColor: Colors.sooprsblue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(5),
    marginBottom: wp(2),
  },
  Icon: {
    width: wp(10),
    height: hp(5),
    borderRadius: wp(5),
  },

  // imgStyling: {
  //   width: 50,
  //   height: 50,
  //   borderRadius: 25,
  //   overflow: 'hidden',
  // },

  hello: {
    width: wp(6),
    height: hp(5),
  },

  greetText: {
    fontWeight: '500',
    fontSize: FSize.fs14,
    color: Colors.black,
  },

  postButton: {
    backgroundColor: '#F78000',
    width: wp(25),
    height: hp(4),
    borderRadius: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },

  postbuttonText: {
    color: Colors.white,
    fontSize: FSize.fs11,
  },

  bellIcon: {
    width: wp(4),
    height: hp(4),
  },
});
