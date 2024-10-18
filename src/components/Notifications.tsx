import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Images from '../assets/image'
import Colors from '../assets/commonCSS/Colors'
import { wp, hp } from '../assets/commonCSS/GlobalCSS'
import FSize from '../assets/commonCSS/FSize'

const Notifications = ({navigation} : {navigation:any}) => {
  return (
    <View style={styles.container}>
    <View style={styles.headerSection}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={Images.backArrow}
          resizeMode="contain"
          style={styles.backArrow}
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Notifications</Text>
      
    </View>
</View>
  )
}

export default Notifications

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
        fontWeight:'500',
        fontSize: FSize.fs16,
      },
})