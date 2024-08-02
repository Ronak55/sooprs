import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import Images from '../assets/image'
import Colors from '../assets/commonCSS/Colors'
import { hp, wp } from '../assets/commonCSS/GlobalCSS'
import FSize from '../assets/commonCSS/FSize'

const Password = ({desc} : {desc:string}) => {
  return (
  <>
    <View style={styles.section}>
    <Image source={Images.lockIcon} style = {styles.imageStyle} resizeMode='contain'/>
    </View>
    <View style={styles.forgotText}>
        <Text style={styles.titleText}>Forgot your password?</Text>
        <Text style={styles.titleDesc}>{desc}</Text>
    </View>
</>
  )
}

export default Password

const styles = StyleSheet.create({

    section:{
        marginHorizontal:wp(40),
        marginVertical:hp(5)
    },


    imageStyle:{
        width:wp(20),
        height:hp(10),
        marginTop:hp(12)
    },

    forgotText:{

        flexDirection:'column',
        alignItems:'center',
        marginHorizontal:wp(10),
        width:wp(80),
    },

    titleText:{

        fontFamily:'inter',
        fontWeight:'700',
        fontSize:FSize.fs18,
        color: Colors.black
    },

    titleDesc:{

        marginTop:hp(2),
        color:Colors.gray,
        fontFamily:'inter',
        fontSize:FSize.fs13,
        fontWeight:'400',
        textAlign:'center'

    },


})