import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Images from '../assets/image'
import { hp, wp } from '../assets/commonCSS/GlobalCSS'
import Colors from '../assets/commonCSS/Colors'
import FSize from '../assets/commonCSS/FSize'

const Header = ({navigation, img, name, btnName} : {navigation: any, img:any, name:String, btnName:String}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={()=>{navigation.navigate('ClientProfile')}}>
      <Image source={img} resizeMode='contain' style={styles.imgStyling}/>
      </TouchableOpacity>
      <Text style={styles.greetText}>Hello, {name}</Text>
      <Image source = {Images.helloIcon} resizeMode='contain' style={styles.hello}/>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.postButton} onPress={()=>{navigation.navigate('ProjectPosting')}}>
           <Text style={styles.postbuttonText}>{btnName}</Text>
        </TouchableOpacity>
        <TouchableOpacity>
        <Image source={Images.bellIcon} resizeMode='contain' style={styles.bellIcon}/>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({

header:{
    backgroundColor:'#DFF3FC87',
    height:hp(10),
    flexDirection:'row',
    paddingHorizontal:wp(4),
    alignItems:'center',
    gap:8,

},

imgStyling:{
    width:wp(10),
    height:hp(10),
},

hello:{
  width:wp(5),
  height:hp(5)
},

greetText:{
  fontWeight:"500",
  fontSize:FSize.fs14,
  color:Colors.black,
},

buttons:{

  paddingHorizontal:wp(10),
  flexDirection:'row',
  gap:15
},

postButton:{
  backgroundColor:"#F78000",
  width:wp(25),
  height:hp(4),
  borderRadius:wp(2),
  justifyContent:'center',
  alignItems:'center'
},

postbuttonText:{
  
  color:Colors.white,
  fontSize:FSize.fs11
},

bellIcon:{
  width:wp(4),
  height:hp(4)
}
})