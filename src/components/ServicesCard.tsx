import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { wp, hp} from '../assets/commonCSS/GlobalCSS'
import Colors from '../assets/commonCSS/Colors'
import FSize from '../assets/commonCSS/FSize'

const ServicesCard = ({item} : {item:any}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardItem}>{item}</Text>
    </View>
  )
}

export default ServicesCard

const styles = StyleSheet.create({

    card:{
       
        backgroundColor: "#407BFF1A",
        marginHorizontal:wp(5),
        marginTop:hp(5),
        borderColor: Colors.sooprsblue,
        width:wp(40),
        height:hp(6),
        borderRadius:wp(3),
        alignItems:'center',
        justifyContent:'center'
    },

    cardItem:{
        color:Colors.black,
        fontSize:FSize.fs12,
        fontWeight:"600"
    }
})