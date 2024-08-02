import { StyleSheet, Text, View, Image, StatusBar } from 'react-native'
import React from 'react'
import { hp, wp } from '../assets/commonCSS/GlobalCSS'
import Colors from '../assets/commonCSS/Colors'
import Images from '../assets/image'
import ButtonNew from '../components/ButtonNew'
import FSize from '../assets/commonCSS/FSize'

const RegisterSuccess = ({navigation, route} : {navigation:any, route:any}) => {

  const { successMessage, btnText, navigateTo} = route.params

  const handleOnPress = ()=>{

    navigation.navigate(navigateTo)
  }

  return (
    <>
    <StatusBar barStyle="dark-content" backgroundColor="white" />
    <View style={styles.container}>
      <View style={styles.bigCircle}>
        <Image style = {styles.imgSize}source={Images.checkblue} resizeMode='contain'/>
      </View>
      <View style={styles.successInfo}>
        <Text style={styles.successTitle}>Success</Text>
        <Text style={styles.successDesc}>{successMessage}</Text>
        <ButtonNew
            imgSource={null}
            btntext={btnText}
            bgColor="#0077FF"
            textColor="#FFFFFF"
            onPress={handleOnPress}
          />
      </View>
    </View>
    </>
  )
}

export default RegisterSuccess

const styles = StyleSheet.create({

  container:{

    flex:1,
    backgroundColor:'#FFFFFF'
  },

  bigCircle:{
    marginHorizontal:wp(19),
    marginTop:hp(15),
    backgroundColor:Colors.successbackground,
    borderRadius: wp(50),
    width:wp(60),
    height:hp(30),
     alignItems:'center',
    justifyContent:'center'

  },

  imgSize:{
    width:'50%',
    height:'100%',
  },

  successInfo:{
    flexDirection:'column',
    marginVertical:hp(5),
    alignItems:'center'
  },

  successTitle:{

    fontFamily:'Roboto',
    fontSize:FSize.fs26,
    color:Colors.black,
    fontWeight:'600',
    marginBottom:hp(2)

  },

  successDesc:{

    color:Colors.black,
    fontSize:FSize.fs12,
    marginBottom:hp(5)

  }

})