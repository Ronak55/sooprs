import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Images from './assets/image';
import { hp, wp } from './assets/commonCSS/GlobalCSS'; // Assuming hp and wp are helper functions for height and width percentages
import FSize from './assets/commonCSS/FSize'; 
import Colors from './assets/commonCSS/Colors';

const Splash = ({ navigation }: { navigation: any }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Onboarding'); // Navigate to the Onboarding screen after 3 seconds
    }, 2000);

    return () => clearTimeout(timer); // Clear the timeout if the component unmounts
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={Images.Sooprsnewlogo}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Set your desired background color
  },
  logo: {
    width: wp(70), 
    height: hp(20), 
  },
  splashText: {
    marginTop: hp(3), 
    fontSize: FSize.fs18,
    color:Colors.black,
    fontWeight: 'bold',
  },
});
