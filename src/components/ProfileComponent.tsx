import {StyleSheet, Text, View, Image, TouchableOpacity, Alert} from 'react-native';
import React, {useState} from 'react';
import { wp, hp } from '../assets/commonCSS/GlobalCSS';
import Images from '../assets/image';
import Colors from '../assets/commonCSS/Colors';
import {launchImageLibrary} from 'react-native-image-picker';
import FSize from '../assets/commonCSS/FSize';


const ProfileComponent = ({navigation, img, name, role, rating} : {navigation:any, img:any, name:any, role:any, rating:any}) => {
    // const [profileImage, setProfileImage] = useState(Images.profileImagetwo);

    // const selectImage = () => {
    //   const options = {
    //     mediaType: 'photo',
    //     maxWidth: 2000,
    //     maxHeight: 2000,
    //     quality: 1,
    //   };
  
    //   launchImageLibrary(options, response => {
    //     if (response.didCancel) {
    //       console.log('User cancelled image picker');
    //     } else if (response.errorCode) {
    //       console.log('ImagePicker Error: ', response.errorMessage);
    //     } else if (response.assets && response.assets.length > 0) {
    //       const source = {uri: response.assets[0].uri};
    //       setProfileImage(source);
    //     }
    //   });
    // };
  
    return (
        <View style={styles.profileSection}>
          <View>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              source={Images.backArrow}
              resizeMode="contain"
              style={styles.backArrow}
            />
          </TouchableOpacity>
          </View>
          <View style={styles.profile}>
            {/* <TouchableOpacity onPress={selectImage}> */}
                <Image style={styles.Icon} resizeMode="cover" source={img !== 'default-image-url' ? {uri:img} : Images.defaultPicIcon}/>
            {/* </TouchableOpacity> */}
            <View style={styles.profileContainer}>
            <Text style={styles.profileName}>{name}</Text>
            <Text style={styles.profileRole}>{role}</Text>
            <View style={styles.ratings}>
            <Image
              style={styles.starIcon}
              source={Images.starIcon}
              resizeMode="contain"
            />
            <Text style={styles.rating}>{rating} / 5</Text>
            </View>
            </View>
          </View>
        </View>
    );
  };
  
  export default ProfileComponent;
  
  const styles = StyleSheet.create({

    profileSection: {
      marginVertical: hp(1),
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    backArrow: {
      width: wp(8),
      height: hp(8),
      marginLeft:wp(2)
    },
    profile: {
      flexDirection: 'row',
      // justifyContent: 'center',
      // marginRight: wp(25),
      // marginTop:hp(8)
      marginHorizontal:wp(4.5),
      marginBottom:hp(2),
      // marginVertical: hp(4),
      alignItems:'center',
      gap:wp(5)
    },
    Icon: {
      width: hp(15),
      height: hp(15),
      borderRadius: wp(50),
  
    },

    profileContainer:{
       flexDirection:'column',
       gap:wp(1),
    },

    starIcon: {
      width: wp(3),
      height: hp(3),
    },
    rating: {
      fontSize: FSize.fs12,
      color: Colors.black,
    },
    profileName: {
      fontSize: FSize.fs20,
      fontWeight: '600',
      color:Colors.black
    },
    profileRole: {
      fontSize: FSize.fs12,
      fontWeight: '500',
      color:Colors.gray,
      maxWidth:'80%'
    },
  
    ratings:{
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'flex-start'
    }
  });
  