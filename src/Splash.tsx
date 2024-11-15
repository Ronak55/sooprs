import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, Dimensions, Easing, Image } from 'react-native';
import Images from './assets/image';
import { hp, wp } from './assets/commonCSS/GlobalCSS';
import Colors from './assets/commonCSS/Colors';

const { width, height } = Dimensions.get('window');

const Splash = ({ navigation }: { navigation: any }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity for the logo
  const waveAnim1 = useRef(new Animated.Value(0.3)).current; // First wave animation
  const waveAnim2 = useRef(new Animated.Value(0.3)).current; // Second wave animation
  const waveAnim3 = useRef(new Animated.Value(0.3)).current; // Third wave animation
  const slideAnim = useRef(new Animated.Value(0)).current; // Slide animation for screen transition

  const [isSplashComplete, setIsSplashComplete] = useState(false); // State to toggle navigation

  useEffect(() => {
    const startAnimation = () => {
      Animated.stagger(400, [
        createWaveAnimation(waveAnim1),
        createWaveAnimation(waveAnim2),
        createWaveAnimation(waveAnim3),
      ]).start(() => {
        navigation.navigate('Authentication');
      });

      // Fade in the logo
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    };

    const timer = setTimeout(startAnimation, 1000); // Delay before starting the animations
    return () => clearTimeout(timer); // Clear timeout if component unmounts
  }, [fadeAnim, waveAnim1, waveAnim2, waveAnim3]);

  const createWaveAnimation = (anim: Animated.Value) =>
    Animated.timing(anim, {
      toValue: 1, // Full expansion of the wave
      duration: 2500, // Smooth animation duration
      easing: Easing.out(Easing.ease), // Smooth wave-like easing
      useNativeDriver: false, // Animating width and height, so native driver can't be used
    });

  const createWaveStyle = (anim: Animated.Value) => ({
    transform: [{ scale: anim }],
    width: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [wp(150), width * 2], // Scale beyond screen size
    }),
    height: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [hp(30), height * 2], // Scale beyond screen size
    }),
    borderRadius: anim.interpolate({
      inputRange: [0, 0.7, 1],
      outputRange: [wp(30), wp(150), 0], // Gradually reduce borderRadius
    }),
    opacity: anim.interpolate({
      inputRange: [0, 0.9, 1],
      outputRange: [0.7, 0.5, 0], // Fade out the wave
    }),
  });

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
            opacity: fadeAnim, // Apply fade-in effect to the logo
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
