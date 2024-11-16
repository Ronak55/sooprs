import { Image, StyleSheet, Text, TouchableOpacity, View, Share } from 'react-native';
import React from 'react';
import Toast from 'react-native-toast-message';
import Clipboard from '@react-native-clipboard/clipboard';
import Images from '../assets/image';
import Colors from '../assets/commonCSS/Colors';
import { hp, wp } from '../assets/commonCSS/GlobalCSS';
import FSize from '../assets/commonCSS/FSize';

const Refer = ({ navigation, route }: { navigation: any; route: any }) => {
  const { slug } = route?.params;

  const handleCopy = () => {
    Clipboard.setString(slug); // Copy the slug to clipboard
    Toast.show({
      type: 'success',
      text1: 'Copied to Clipboard',
      text2: 'Referral code copied successfully!',
      position: 'top',
      visibilityTime: 2000,
    });
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Hey there! 👋\n\nI've been using this amazing app. Use my referral code *${slug}* to sign up and get bonus credits. 🎉\n\nDownload the app here: https://play.google.com/store/apps/details?id=com.sooprsapp`,
        title: 'Refer & Earn',
      });

      if (result.action === Share.sharedAction) {
        Toast.show({
            type: 'success',
            text1: 'Thanks for Sharing! 🎉',
            text2: 'Your referral code has been shared successfully.',
            position: 'top',
            visibilityTime: 2000,
          });
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.headerSection}>
        <TouchableOpacity onPress={() => navigation.navigate('AccountProfile')}>
          <Image
            source={Images.backArrow}
            resizeMode="contain"
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Refer a friend</Text>
      </View>
      <View style={styles.referSection}>
        <View style={styles.referCard}>
          <View style={styles.topPart}>
            <View style={styles.referLeft}>
              <Text style={styles.referTitle}>Refer & Earn</Text>
              <Text style={styles.referDesc}>
                Share your referral code, and when they sign up, they get extra
                credits, and you receive 100 credits.
              </Text>
            </View>
            <View style={styles.referRight}>
              <Image source={Images.referandearn} style={styles.referImg} />
            </View>
          </View>
          <View style={styles.bottomPart}>
            <View style={styles.referCode}>
              <Text style={styles.referCodeText}>{slug}</Text>
              <View style={styles.share}>
                <TouchableOpacity onPress={handleCopy}>
                  <Image style={styles.clipboard} source={Images.copyIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                  <Text style={styles.shareText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Refer;

const styles = StyleSheet.create({
  section: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerSection: {
    marginHorizontal: wp(5),
    marginVertical: hp(1),
    gap: wp(5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: Colors.black,
    fontWeight: '500',
    fontSize: FSize.fs16,
  },
  backArrow: {
    width: wp(8),
    height: hp(8),
  },
  referSection: {
    marginHorizontal: wp(5),
    marginVertical: hp(1),
  },
  referCard: {
    flexDirection: 'column',
    backgroundColor: Colors.sooprsblue,
    borderRadius: wp(3),
    paddingHorizontal: wp(5),
    paddingVertical: hp(3),
    gap: wp(6),
  },
  topPart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomPart: {
    
  },
  referLeft: {
    flexDirection: 'column',
    gap: hp(2),
  },
  share: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
  },
  referTitle: {
    color: Colors.white,
    fontSize: FSize.fs18,
    fontWeight: '600',
  },
  referDesc: {
    color: Colors.white,
    fontSize: FSize.fs13,
    width: wp(49),
  },
  referCode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: wp(2),
    justifyContent: 'space-between',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.2),
  },
  referCodeText: {
    color: Colors.black,
    fontSize: FSize.fs14,
    fontWeight: '600',
  },
  shareBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.sooprsblue,
    borderRadius: wp(1.2),
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(3),
  },
  shareText: {
    color: Colors.white,
    fontSize: FSize.fs10,
    fontWeight: '600',
  },
  clipboard: {
    width: wp(4),
    height: hp(2),
  },
  referRight: {
    justifyContent: 'center',
  },
  referImg: {
    width: wp(35),
    height: hp(11),
  },
});
