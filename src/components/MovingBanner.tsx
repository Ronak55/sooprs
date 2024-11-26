import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Colors from '../assets/commonCSS/Colors';
import { wp, hp } from '../assets/commonCSS/GlobalCSS';
import FSize from '../assets/commonCSS/FSize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mobile_siteConfig } from '../services/mobile-siteConfig';

const { width } = Dimensions.get('window');

const MovingBanner = ({navigation} : {navigation:any}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [slug, setSlug] = useState('');

  useEffect(() => {

    const getUserSlug = async()=>{
        const slug = await AsyncStorage.getItem(mobile_siteConfig.SLUG);
        const parsedSlug = JSON.parse(slug);
        setSlug(parsedSlug);     
    }

    const animateBanner = () => {
      Animated.loop(
        Animated.timing(translateX, {
          toValue: -width, // Move completely off-screen
          duration: 6000, // Total duration for one cycle
          useNativeDriver: true,
        })
      ).start();
    };
    animateBanner();
    getUserSlug();
  }, [translateX]);

  // Navigate to Refer screen on press
  const handleBannerPress = () => {
    navigation.navigate('Refer', {slug}); // Change 'Refer' to the exact screen name in your navigator
  };

  return (
    <TouchableWithoutFeedback onPress={handleBannerPress}>
      <View style={styles.container}>
        <Animated.View
          style={[styles.banner, { transform: [{ translateX }] }]}>
          {/* First copy of the text */}
          <Text style={styles.text}>Refer a friend and get credits worth $100</Text>
          {/* Second copy of the text to ensure seamless loop */}
          <Text style={styles.text}>Refer a friend and get credits worth $100</Text>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden', // Ensures text stays within the banner's bounds
    backgroundColor: Colors.sooprsblue,
    height: hp(5),
    justifyContent: 'center',
  },
  banner: {
    flexDirection: 'row', // Align items in a single row
    alignItems: 'center',
    width: width * 2, // Double the width to fit two copies of the text
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: FSize.fs14,
    textAlign: 'center',
    width, // Occupy full width for each copy of the text
    paddingHorizontal: 10,
  },
});

export default MovingBanner;
