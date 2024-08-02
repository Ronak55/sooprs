import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Images from '../assets/image';
import React, { useState } from 'react';
import { hp, wp } from '../assets/commonCSS/GlobalCSS';
import ProfileCard from '../components/ProfileCard';
import ButtonNew from '../components/ButtonNew';
import Toast from 'react-native-toast-message';
import FSize from '../assets/commonCSS/FSize';

const ProfileSelection = ({ navigation } : {navigation:any}) => {
  const [selectedCard, setSelectedCard] = useState(null);

  const profiles = [
    {
      id: 1,
      name: 'Client',
      des: 'Elevate Your Business',
      img: Images.Clientlogo,
    },
    {
      id: 2,
      name: 'Professional',
      des: 'Showcase Your Expertise',
      img: Images.Professionallogo,
    },
  ];

  const handleRadioChange = (id:any) => {
    setSelectedCard(id);
  };

  const getProfileType = () => {
    return profiles.find(profile => profile.id === selectedCard)?.name;
  };

  const handleButtonPress = (action : any) => {
    if (!selectedCard) {
      Toast.show({
        type: 'info',
        text1: 'Please select your profile',
      });
      return;
    }
    navigation.navigate(action, { profileType: getProfileType() });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={Images.Sooprslogo} style={styles.img} />
        </View>
        <View style={styles.section}>
          <Text style={styles.text}>Join as a Client or Professional</Text>
          <View style={styles.profileSelect}>
            {profiles.map(profile => (
              <ProfileCard
                key={profile.id}
                {...profile}
                isSelected={selectedCard === profile.id}
                onRadioChange={() => handleRadioChange(profile.id)}
              />
            ))}
          </View>
          <View style={styles.buttonSection}>
            <ButtonNew
              imgSource={null}
              btntext="Sign Up"
              bgColor="#FFFFFF"
              textColor="#0077FF"
              onPress={() => handleButtonPress('Signup')}
            />
            <View style={styles.orstyle}>
              <Text style={styles.or}>or</Text>
            </View>
            <ButtonNew
              imgSource={null}
              btntext="Log in"
              bgColor="#0077FF"
              textColor="#FFFFFF"
              onPress={() => handleButtonPress('Login')}
            />
          </View>
        </View>
      </View>
    </>
  );
};

export default ProfileSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  imageContainer: {
    backgroundColor: 'rgba(64, 123, 255, 0.11)',
    width: wp(100),
    height: hp(37),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: wp(25),
    borderBottomRightRadius: wp(25),
  },

  img: {
    objectFit: 'contain',
    width: wp(70),
  },

  section: {
    marginHorizontal: wp(10),
    marginVertical: wp(20),
  },

  text: {
    fontWeight: '700',
    color: '#08090D',
    fontSize: FSize.fs22,
  },

  profileSelect: {
    marginVertical: hp(5),
    flexDirection: 'column',
    gap: hp(2),
  },

  buttonSection: {
    flexDirection: 'column',
  },

  or: {
    color: '#407BFF',
    alignItems: 'center',
    fontSize: FSize.fs12,
    fontWeight: '400',
    marginBottom:hp(1)
  },

  orstyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
