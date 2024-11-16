import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, Dimensions, Easing, Image } from 'react-native';
import Images from './assets/image';
import { hp, wp } from './assets/commonCSS/GlobalCSS';
import Colors from './assets/commonCSS/Colors';
import { CommonActions } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const Splash = ({ navigation }: { navigation: any }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity for the logo
  const waveAnim1 = useRef(new Animated.Value(0.3)).current; // First wave animation
  const waveAnim2 = useRef(new Animated.Value(0.3)).current; // Second wave animation
  const waveAnim3 = useRef(new Animated.Value(0.3)).current; // Third wave animation
  const slideAnim = useRef(new Animated.Value(0)).current; // Slide animation for screen transition

  useEffect(() => {
    const startAnimation = () => {
      Animated.stagger(500, [
        createWaveAnimation(waveAnim1),
        createWaveAnimation(waveAnim2),
        Animated.parallel([
          createWaveAnimation(waveAnim3),
          Animated.timing(fadeAnim, {
            toValue: 0, // Fade out the logo
            duration: 500, // Smooth fade-out
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Authentication' }],
          })
        );
      }, 1500); // Adjust this timing if needed for smooth transition
  
      // Fade in the logo initially
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    };
  
    const timer = setTimeout(startAnimation, 100); // Delay before starting the animations
    return () => clearTimeout(timer); // Clear timeout if component unmounts
  }, [fadeAnim, waveAnim1, waveAnim2, waveAnim3]);
  

  const createWaveAnimation = (anim: Animated.Value) =>
    Animated.timing(anim, {
      toValue: 1, // Full expansion of the wave
      duration: 2500, // Smooth animation duration
      easing: Easing.out(Easing.ease), // Smooth wave-like easing
      useNativeDriver: false, // Animating width and height, so native driver can't be used
    });

    const createWaveStyle = (anim: Animated.Value) => {
      const size = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [wp(150), width * 2], // Single size value for both width and height
      });
    
      return {
        transform: [{ scale: anim }],
        width: size,
        height: size, // Ensure height matches width
        borderRadius: size.interpolate({
          inputRange: [0, width * 2],
          outputRange: [wp(75), width], // Half of the size to make it a perfect circle
        }),
        opacity: anim.interpolate({
          inputRange: [0, 0.9, 1],
          outputRange: [0.7, 0.5, 0], // Fade out the wave
        }),
        position: 'absolute',
        backgroundColor: 'white', // White color for the wave
        justifyContent: 'center',
        alignItems: 'center',
      };
    };
    

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      {/* Animated white circles for wave effect */}
      <Animated.View style={[styles.wave, createWaveStyle(waveAnim1)]} />
      <Animated.View style={[styles.wave, createWaveStyle(waveAnim2)]} />
      <Animated.View style={[styles.wave, createWaveStyle(waveAnim3)]} />

      {/* Logo */}
      <Animated.Image
        source={Images.Sooprslogo}
        style={[
          styles.logo,
          {
            opacity: fadeAnim, // Apply fade-in and fade-out effect to the logo
          },
        ]}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.sooprsblue, // Background color of splash screen
  },

  wave: {
    position: 'absolute',
    backgroundColor: 'white', // White color for the circle
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: wp(30), // Logo width
    height: hp(15), // Logo height
  },
});
