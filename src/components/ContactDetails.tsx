import { StyleSheet, Text, View, Image} from 'react-native'
import React from 'react'
import Images from '../assets/image'
import Colors from '../assets/commonCSS/Colors'
import { hp, wp } from '../assets/commonCSS/GlobalCSS'
import FSize from '../assets/commonCSS/FSize'

const ContactDetails = ({email, phone, location} : {email:any, phone:any, location:any}) => {
  return (
    <View style={styles.contactDetails}>
      <View style={styles.contactInfo}>
        <Image source={Images.emailIcon} style={styles.contactIcon} resizeMode="contain"/>
        <Text style={styles.contactText}>{email}</Text>
      </View>
      <View style={styles.contactInfo}>
        <Image source={Images.phoneIcon} style={styles.contactIcon} resizeMode="contain"/>
        <Text style={styles.contactText}>{phone}</Text>
      </View>
      <View style={styles.contactInfo}>
        <Image source={Images.locationIcon} style={styles.contactIcon} resizeMode="contain"/>
        <Text style={styles.contactText}>{location}</Text>
      </View>
    </View>
  )
}

export default ContactDetails

const styles = StyleSheet.create({

  contactDetails:{
    flexDirection:'row',
    marginTop:hp(2),
    marginHorizontal:wp(5),
    justifyContent:'space-between',
    
  },

  contactInfo:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    gap:2,
    paddingRight:wp(5)
  },

  contactIcon:{
    width:wp(3.5),
    height:hp(3.5),
  },

  contactText:{

    fontWeight:'500',
    fontSize:FSize.fs12,
    color: Colors.black,
    paddingLeft:wp(1)
  }


})