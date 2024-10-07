import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { hp, wp } from '../../assets/commonCSS/GlobalCSS'
import Colors from '../../assets/commonCSS/Colors'
import FSize from '../../assets/commonCSS/FSize'

const CompanyInfo = () => {
  return (
    <View style={{flex:1, backgroundColor:Colors.white}}>
      <View style={{marginVertical:hp(3), marginHorizontal:wp(5), flexDirection:"column", gap:hp(1)}}>
        <Text style={{color:Colors.black, fontWeight:'600', fontSize:FSize.fs18}}>About us</Text>
        <Text style={{color:Colors.gray, fontWeight:'400', fontSize:FSize.fs14}}>Welcome to [App Name], your ultimate solution for [briefly describe the app's primary function, e.g., "personal finance management," "fitness tracking," "task organization"]. Our mission is to [state the mission, e.g., "simplify your life by helping you manage your finances effortlessly"]. With our innovative features and user-friendly interface, we aim to provide an exceptional experience that meets all your needs.</Text>
      </View>
    </View>
  )
}

export default CompanyInfo

const styles = StyleSheet.create({})