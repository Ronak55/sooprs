import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, { useEffect, useState } from 'react';
import Images from '../assets/image';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import Colors from '../assets/commonCSS/Colors';
import FSize from '../assets/commonCSS/FSize';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mobile_siteConfig } from '../services/mobile-siteConfig';

const Header = ({
  navigation,
  img,
  name,
  btnName,
  isClient,
}: {
  navigation: any;
  img: any;
  name: String;
  btnName: String;
  isClient: any;
}) => {

  const [notifications, setNotifications] = useState([]);
  const isFocused = useIsFocused();
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      let token = await AsyncStorage.getItem(mobile_siteConfig.TOKEN);
      let new_token = JSON.parse(token);

      try {
        const response = await fetch('https://sooprs.com/api2/public/index.php/get-notifications', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${new_token}`,
          },
        });
        const res = await response.json();
        console.log('notifications data:::::::::::', res.data);

        if (res.status === 200) {
          setNotifications(res.data);
          setNotifCount(res.data.length)
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchNotifications();
  }, [isFocused]);
  
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
          <Image style={styles.Icon} resizeMode="cover" source={img ? {uri: img} : Images.defaultPicIcon} />
      </TouchableOpacity>
      <Text style={styles.greetText}>Hello, {name.split(' ')[0]}</Text>
      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications', {notifications})}>
          <Image source={Images.bellIcon} resizeMode="contain" style={styles.bellIcon} />
          {notifCount > 0 && (
            <View style={styles.notifBadge}>
              <Text style={styles.notifCountText}>{notifCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        {btnName && (
          <TouchableOpacity
            style={styles.postButton}
            onPress={() => navigation.navigate('ProjectPosting')}>
            <Text style={styles.postbuttonText}>{btnName}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#DFF3FC87',
    height: hp(10),
    flexDirection: 'row',
    paddingHorizontal: wp(5),
    alignItems: 'center',
  },
  profileIcon: {
    width: wp(10),
    height: hp(5),
    borderWidth: 2,
    borderColor: Colors.sooprsblue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(5),
    // marginBottom: wp(2),
  },
  Icon: {
    width: wp(10),
    height: hp(5),
    borderRadius: wp(5),
  },
  hello: {
    width: wp(6),
    height: hp(5),
    marginLeft: wp(2),
  },
  greetText: {
    fontWeight: '500',
    fontSize: FSize.fs14,
    color: Colors.black,
    marginLeft: wp(2),
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto', // Pushes the items to the right
    gap: wp(4),
  },
  postButton: {
    backgroundColor: '#F78000',
    width: wp(25),
    height: hp(4),
    borderRadius: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  postbuttonText: {
    color: Colors.white,
    fontSize: FSize.fs11,
  },
  bellIcon: {
    width: wp(4),
    height: hp(4),
  },

  notifBadge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
