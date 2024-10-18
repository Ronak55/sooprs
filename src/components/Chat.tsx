import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Images from '../assets/image'
import Colors from '../assets/commonCSS/Colors'
import { wp, hp } from '../assets/commonCSS/GlobalCSS'
import FSize from '../assets/commonCSS/FSize'

const chatData = [
    {
      id: 1,
      name: 'Alice',
      image: Images.Clientlogo,
      message: 'See you soon.',
      date: 'Oct 12',
    },
    {
      id: 2,
      name: 'Bob',
      image: Images.Professionallogo,
      message: 'Hello there!',
      date: 'Oct 14',
    },
  ];
  
  const Chat = ({ navigation }: { navigation: any }) => {
    return (
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={Images.backArrow}
              resizeMode="contain"
              style={styles.backArrow}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chat</Text>
        </View>
  
        {/* Chat List */}
        <ScrollView style={{ flex: 1, backgroundColor: Colors.white }}>
          {chatData.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              style={styles.chatItem}
              onPress={() =>
                navigation.navigate('IndividualChat', {
                  name: chat.name,
                  image: chat.image,
                })
              }
            >
              {/* Avatar */}
              <View style={styles.avatarContainer}>
                <Image
                  source={chat.image}
                  style={{ width: hp(5), height: hp(5) }}
                />
              </View>
  
              {/* Name and Message */}
              <View style={styles.textContainer}>
                <Text style={styles.nameText}>{chat.name}</Text>
                <Text style={styles.messageText}>{chat.message}</Text>
              </View>
  
              {/* Timestamp */}
              <View style={styles.timestampContainer}>
                <Text style={styles.dateText}>{chat.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };
  
  export default Chat;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.white,
    },
    headerSection: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: wp(4),
      paddingVertical: hp(2),
    },
    backArrow: {
      width: wp(6),
      height: wp(6),
      marginRight: wp(4),
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors.black,
    },
    chatItem: {
      flexDirection: 'row',
      paddingVertical: hp(1.5),
      alignItems: 'center',
      backgroundColor: Colors.white,
      borderRadius: 10,
      marginVertical: hp(1),
      marginHorizontal: wp(4),
      elevation: 4,
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    avatarContainer: {
      width: wp(14),
      justifyContent: 'center',
      alignItems: 'center',
    },
    textContainer: {
      marginLeft: wp(2),
      width: wp(60),
      justifyContent: 'center',
    },
    nameText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: Colors.black,
    },
    messageText: {
      fontSize: 14,
      color: Colors.gray,
    },
    timestampContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: wp(18),
    },
    dateText: {
      fontSize: 12,
      color: Colors.gray,
    },
  });