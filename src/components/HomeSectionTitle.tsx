import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../assets/commonCSS/Colors'
import { hp, wp } from '../assets/commonCSS/GlobalCSS'
import FSize from '../assets/commonCSS/FSize'

const HomeSectionTitle = ({navigation, titleOne, titleTwo, btntxt, onPress} : {navigation:any, titleOne:any, titleTwo:any, btntxt:any, onPress:any}) => {
  return (
    <View style={styles.sectionList}>
    <View style={styles.sectionTitle}>
      <Text style={styles.titleFirst}>{titleOne} </Text>
      <Text style={[styles.titleFirst , styles.titleSecond]}>{titleTwo}</Text>
    </View>
    <TouchableOpacity style={styles.seeAll} onPress={()=>{navigation.navigate(onPress)}}>
      <Text style={styles.seeText}>{btntxt}</Text>
    </TouchableOpacity>
  </View>
  )
}

export default HomeSectionTitle

const styles = StyleSheet.create({

    sectionList: {
        flexDirection: 'row',
        marginTop:hp(2),
        justifyContent: 'space-between',
      },
    
    
      sectionTitle:{
        flexDirection: 'row', 
      },
    
      titleFirst:{
        color:Colors.black,
        fontWeight:'600',
        fontSize:FSize.fs20
      },
    
      titleSecond: {
        color: Colors.sooprsblue,
      },
    
      seeAll:{
        justifyContent: 'center'
      },
    
      seeText:{
        color:Colors.sooprsblue,
        fontSize:FSize.fs12,
        fontWeight:"500"
      },



})