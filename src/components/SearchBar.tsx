import { StyleSheet, Text, View, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { hp, wp } from '../assets/commonCSS/GlobalCSS'
import Images from '../assets/image'
import FSize from '../assets/commonCSS/FSize'
import Colors from '../assets/commonCSS/Colors'

const SearchBar = ({placeholderName} : {placeholderName:string}) => {

  const [search, setSearch] = useState('');
  

  return (
    <View style={styles.searchBar}>
      <Image source={Images.searchIcon} resizeMode='contain' style={styles.iconStyle}/>
      <TextInput style={styles.searchInput} placeholder= {`Search ${placeholderName}`}
      value={search} placeholderTextColor="#BABABA" onChangeText={(value)=> setSearch(value)} keyboardType='default'/>
    </View>
  )
}

export default SearchBar

const styles = StyleSheet.create({

 searchBar:{
    borderWidth:1,
    borderColor:'#CFCFCF',
    width:'100%',
    height:hp(5),
    borderRadius:wp(2.5),
    paddingHorizontal:wp(2.5),
    marginVertical:hp(3),
    flexDirection:'row',
    alignItems:'center'
 },

 iconStyle:{
    width:wp(5),
    height:hp(5),
    tintColor:'#CFCFCF'
 },

 searchInput:{
     paddingHorizontal:wp(3),
     fontSize:FSize.fs12,
     width:'100%',
     color:Colors.black
 }

})