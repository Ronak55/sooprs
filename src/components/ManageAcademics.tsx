import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { hp, wp } from '../assets/commonCSS/GlobalCSS'
import Colors from '../assets/commonCSS/Colors'
import FSize from '../assets/commonCSS/FSize'
import Images from '../assets/image'

const ManageAcademics = ({navigation} : {navigation:any}) => {
  return (
    <View style={styles.container}>
    <View style={styles.headerSection}>
      <TouchableOpacity onPress={() => navigation.navigate('Account')}>
        <Image
          source={Images.backArrow}
          resizeMode="contain"
          style={styles.backArrow}
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Manage Academics</Text>
    </View>
    </View>
  )
}

export default ManageAcademics

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
      },
      headerSection: {
        marginHorizontal: wp(5),
        marginVertical: hp(1),
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
      },
      backArrow: {
        width: wp(8),
        height: hp(8),
      },
      headerTitle: {
        color: Colors.black,
        fontWeight: '500',
        fontSize: FSize.fs16,
      },
})