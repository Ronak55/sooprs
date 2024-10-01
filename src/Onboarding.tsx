import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import Colors from './assets/commonCSS/Colors';
import FSize from './assets/commonCSS/FSize';
import Images from './assets/image';
import GestureRecognizer from 'react-native-swipe-gestures';
import {hp, wp} from './assets/commonCSS/GlobalCSS';

const Onboarding = ({navigation}: {navigation: any}) => {
  const [activeScreen, setActiveScreen] = useState(0);

  const Buttons = ({buttonName, bgColor, onPress} : {buttonName:String, bgColor:any, onPress:()=>void}) =>{
    return (
    <TouchableOpacity style={{
      backgroundColor:bgColor,
      width:wp(41),
      height:hp(6.5),
      alignItems:'center',
      justifyContent:'center',
      borderRadius: 13
    }} onPress={onPress}>
      <Text style={styles.buttonText}>
       {buttonName}
      </Text>
   </TouchableOpacity>
    )
  }

  const CircularDot = ({bgColor, style}:{bgColor:any, style:any}) => {
    return (
      <View
        style={[
          {
            height: hp(1),
            width: hp(1),
            borderRadius: hp(0.5),
            backgroundColor: bgColor,
          },
          style,
        ]}></View>
    );
  };

  return (
    <View style={styles.container}>
       <GestureRecognizer
          style={styles.containerItems}
          onSwipeLeft={() => {
            if (activeScreen < 2) {
              setActiveScreen(activeScreen + 1);
            }
          }}
          onSwipeRight={() => {
            if (activeScreen > 0) {
              setActiveScreen(activeScreen - 1);
            }
          }}>
      <View style={{alignItems:'center'}}>
          <View
            style={{}}>
            {activeScreen == 0 ? (
              <View style={styles.titleSection}>
               <Text style={styles.title}>Get Professional</Text>
               <Text style={styles.titledesc}>
                 Discover a world of opportunities with our Browse Gigs
               </Text>
               </View>
            ) : activeScreen == 1 ? (
              <View style={styles.titleSection}>
              <Text style={styles.title}>Browse Gigs</Text>
              <Text style={styles.titledesc}>
              Discover a world of opportunities with our Browse Gigs section
              </Text>
              </View>
            ) : activeScreen == 2 ? (
              <View style={styles.titleSection}>
              <Text style={styles.title}>Find Projects</Text>
              <Text style={styles.titledesc}>
              Discover a world of opportunities with our Browse Gigs section.
              </Text>
              </View>
            ) : null}
          </View>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: wp(6),
            marginVertical: hp(5),
          }}>
          <CircularDot
            bgColor={activeScreen === 0 ? '#0077ff' : '#D9D9D9'}
            style={undefined}
          />
          <CircularDot
            bgColor={activeScreen === 1 ? '#0077ff' : '#D9D9D9'}
            style={{marginHorizontal: wp(3)}}
          />
          <CircularDot
            bgColor={activeScreen === 2 ? '#0077ff' : '#D9D9D9'}
            style={undefined}
          />
        </View>
        <View style={styles.ImageSection}>
          <Image
            style={styles.singleImage}
            source={
              activeScreen === 0
                ? Images.OnboardingScreen1
                : activeScreen === 1
                ? Images.OnboardingScreen2
                : Images.OnboardingScreen3
            }></Image>
        </View>
      </View>
      </GestureRecognizer>
      <View style={styles.buttonSection}>
         <Buttons buttonName="Skip" bgColor="black" onPress={()=>{navigation.navigate('Authentication')}}></Buttons>
         <Buttons buttonName="Next" bgColor="#407BFF" onPress={()=>{
          if(activeScreen === 2){
            navigation.navigate("Authentication");
          } else{
            setActiveScreen(activeScreen+1);
          }
         }}></Buttons>
      </View>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  containerItems: {
    flex: 1,
    alignItems: 'center',
    marginTop: hp(6),
    // backgroundColor: 'white',
    flexDirection: 'column',
  },

  title: {
    fontFamily: 'Lato',
    fontWeight: '700',
    fontSize: hp(3.5),
    color: '#08090D',
  },

  titledesc: {
    marginTop: hp(1),
    color: '#787878',
    width: wp(70),
    textAlign: 'center',
  },

  ImageSection: {
    alignItems: 'center',
    marginTop: hp(1),
    backgroundColor: 'white',
  },

  singleImage: {
    objectFit: 'contain',
    height: hp(50),
  },

  titleSection:{

    alignItems:'center'
  },

  buttonSection:{
    marginBottom:hp(8),
    flexDirection:'row',
    marginHorizontal:wp(7),
    justifyContent:'space-between'
  },

  buttonText:{
    color:'#FFFFFF'
  }
});
