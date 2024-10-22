import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { wp, hp } from '../assets/commonCSS/GlobalCSS'
import Colors from '../assets/commonCSS/Colors'
import FSize from '../assets/commonCSS/FSize'

const CategoriesCard = ({navigation, img, name, index,  onSelectService} : {navigation:any, img:any, name:any, index:any, onSelectService: (serviceName: string) => void;}) => {
  return (
    <View>
    <TouchableOpacity style={styles.card} onPress={() => {
     onSelectService(name); // Call the passed function});
    }}>
      <View style={styles.imgBack}>
      <Image source={{uri : img}} style={styles.image} resizeMode='contain'/>
      </View>
      <View>
        <Text style={styles.name}>{name}</Text>
      </View>
    </TouchableOpacity>
    </View>
  )
}

export default CategoriesCard

const styles = StyleSheet.create({

    card: {
        backgroundColor: Colors.white,
        borderRadius: wp(10),
        paddingLeft:wp(2),
        // padding: 10,
        // marginHorizontal: 10,

        flexDirection:'row',
        paddingVertical:hp(1),
        marginBottom:hp(4),
        paddingHorizontal:wp(5),
        // width: wp(38),
        // height:hp(6),
        marginRight:wp(3),
        alignItems: 'center',
        elevation: 2, // Shadow for Android
        shadowOpacity: 0.1,
        shadowRadius: 3,
        gap:10
    
      },

      imgBack:{
        width:wp(10),
        height:hp(5),
        backgroundColor:'#38B6FF40',
        borderRadius:wp(10),
        alignItems: 'center',
        justifyContent:'center'
      },
      
      image:{
        width:wp(5),
        height:hp(5)
      },



      name:{
        fontSize:FSize.fs11,
        color:Colors.black,
        fontWeight:"700"
      }

})