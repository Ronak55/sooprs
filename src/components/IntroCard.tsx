import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React from 'react';
import Images from '../assets/image';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import Colors from '../assets/commonCSS/Colors';
import LinearGradient from 'react-native-linear-gradient';
import FSize from '../assets/commonCSS/FSize';

const IntroCard = ({cardText, showBtn, img, bgColor, cardbgColor} :{cardText:string, showBtn:boolean, img:any, bgColor:string[], cardbgColor:string}) => {
  return (
    <LinearGradient
      colors={bgColor}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.introCard}>
        <View style={styles.cardItems}>
        <View style={[styles.textandbtn, {backgroundColor:cardbgColor}]}>
            <Text style={styles.cardText}>
                {cardText}
            </Text>
           {/* {showBtn && <TouchableOpacity style={styles.btn}>
                <Text style={styles.btnText}>Explore</Text>
            </TouchableOpacity>}  */}
        </View>

        <View style={styles.imgSection}>
            <Image style={styles.imgNew} source={img} resizeMode="contain"/>
        </View>
        </View>
    </LinearGradient>
  );
};

export default IntroCard;

const styles = StyleSheet.create({
  introCard: {
    width: wp(90),
    height: hp(20),
    // backgroundColor: '#D4E3FC24',
    borderRadius: wp(1),
  },

  cardItems:{
      
    flexDirection: 'row',
      // paddingHorizontal:wp(5),
      // marginVertical:hp(2),
      // justifyContent:'center',
      // alignItems:'center'
      
  },
  textandbtn:{
    // flex:1,
    flexDirection:'column',
    justifyContent:'center',
    // width:wp(65),
    // height:hp(10),
    gap:22,
    paddingHorizontal:wp(5),
    paddingVertical:wp(5),
    // borderWidth:1,
    borderTopRightRadius: wp(30),
    borderBottomRightRadius: wp(30),
  },

  cardText:{
    color:Colors.white,
    fontSize:FSize.fs19,
    fontWeight:'600'
  },

  btn:{

    backgroundColor:Colors.sooprsblue,
    width:wp(30),
    height:hp(4.5),
    borderRadius:5,
    justifyContent:'center',
    alignItems:'center'
  },

  btnText:{
  color: "#FFFFFF",
  fontSize:FSize.fs14,

  },

  imgSection:{

  position:'absolute',
  left:wp(52),
  top:hp(4)
  },

  imgNew:{

    width:wp(40),
    height:hp(12),
  
  }
});
