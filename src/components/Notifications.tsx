import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../assets/commonCSS/Colors';
import { wp, hp } from '../assets/commonCSS/GlobalCSS';
import FSize from '../assets/commonCSS/FSize';
import Images from '../assets/image';
import { useIsFocused } from '@react-navigation/native';
import { mobile_siteConfig } from '../services/mobile-siteConfig';

const Notifications = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const isFocused = useIsFocused();

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
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchNotifications();
  }, [isFocused]);

  const handleNotifs = (id, type) => {
    const numericType = Number(type); 
    console.log('lead id notifs::::::::', id)
    switch (numericType) {
      case 1:
        navigation.navigate('ProjectBids', {id});
        break;
      case 2:
        navigation.navigate('AssignedProjects')
      default:
        return;
    }
  };
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={()=>handleNotifs(item.lead_id, item.notification_type)}>
      <Text style={styles.messageText}>{item.msg}</Text>
      <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={Images.backArrow}
            resizeMode="contain"
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerSection: {
    marginHorizontal: wp(5),
    marginVertical: hp(2),
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    width: wp(6),
    height: hp(6),
  },
  headerTitle: {
    color: Colors.black,
    fontWeight: '600',
    fontSize: FSize.fs18,
    marginLeft: wp(3),
  },
  flatListContainer: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
  },
  card: {
    backgroundColor: Colors.white,
    padding: wp(4),
    marginBottom: hp(1.5),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: Colors.gray,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: wp(1),
    shadowOffset: { width: 0, height: hp(0.5) },
    elevation: 3,
  },
  messageText: {
    color: Colors.black,
    fontSize: FSize.fs15,
    fontWeight: '500',
  },
  dateText: {
    color: Colors.gray,
    fontSize: FSize.fs12,
    textAlign: 'right',
    marginTop:hp(1)
  },
});
