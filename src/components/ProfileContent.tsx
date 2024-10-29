import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { hp, wp } from '../assets/commonCSS/GlobalCSS'
import Colors from '../assets/commonCSS/Colors'
import FSize from '../assets/commonCSS/FSize'

const ProfileContent = ({heading, content} : {heading:string, content:string}) => {
  return (
    <View style={styles.profileSection}>
      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.content}>{content}</Text>
    </View>
  )
}

export default ProfileContent

const styles = StyleSheet.create({

    profileSection:{
        flexDirection:'column',
        marginHorizontal:wp(4),
        gap:10
    },

    heading:{

        fontSize:FSize.fs16,
        fontWeight:"600",
        color:Colors.black
    },

    content:{

        fontSize:FSize.fs13,
        color:'#49454F',
    }

})