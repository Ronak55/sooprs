import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import {hp, wp} from '../../assets/commonCSS/GlobalCSS';
import Images from '../../assets/image';
import Colors from '../../assets/commonCSS/Colors';
import FSize from '../../assets/commonCSS/FSize';
import Projects from '../TabView/Projects';

const ViewProjects = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.section}>
      <View style={styles.headerSection}>
        <TouchableOpacity
          onPress={() => {navigation.navigate('ClientHome')}}>
          <Image
            source={Images.backArrow}
            resizeMode="contain"
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text
          style={{
            color: Colors.black,
            fontWeight: '500',
            fontSize: FSize.fs16,
          }}>
          My Projects
        </Text>
      </View>
        <Projects navigation={navigation} />
    </View>
  );
};

export default ViewProjects;

const styles = StyleSheet.create({
  section: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerSection: {
    marginHorizontal: wp(5),
    marginVertical: hp(1),
    gap: wp(5),
    flexDirection: 'row',
    alignItems: 'center',
  },

  backArrow: {
    width: wp(8),
    height: hp(8),
  },
});
