import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Images from '../../assets/image';
import FSize from '../../assets/commonCSS/FSize';
import Colors from '../../assets/commonCSS/Colors';
import { hp, wp } from '../../assets/commonCSS/GlobalCSS';
import AccountProfile from '../../components/AccountProfile';

const Account = ({navigation} : {navigation:any}) => {
  return (
    <View style={styles.section}>
      <View style={styles.headerSection}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ProfessionalHome');
          }}>
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
          Edit Profile
        </Text>
      </View>
      <AccountProfile navigation={navigation} isClient={false}/>
    </View>
  );
};

export default Account;

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
