import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Image, Animated } from 'react-native';
import Images from './assets/image';
import { hp, wp } from './assets/commonCSS/GlobalCSS';
import FSize from './assets/commonCSS/FSize';
import Colors from './assets/commonCSS/Colors';

const Splash = ({ navigation }: { navigation: any }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity set to 1

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,          // Target opacity (fade out)
        duration: 1000,      // Duration for the fade-out effect
        useNativeDriver: true,
      }).start(() => {
        navigation.navigate('Authentication'); // Navigate after the animation completes
      });
    }, 2000); // Delay of 2 seconds before starting the fade-out

    return () => clearTimeout(timer); // Clear timeout if component unmounts
  }, [navigation, fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={Images.Sooprsnewlogo}
        style={[styles.logo, { opacity: fadeAnim }]} // Apply opacity to animate
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
    backgroundColor: 'white',
  },
  logo: {
    width: wp(80), 
    height: hp(50), 
  },
  splashText: {
    marginTop: hp(3), 
    fontSize: FSize.fs18,
    color: Colors.black,
    fontWeight: 'bold',
  },
});
