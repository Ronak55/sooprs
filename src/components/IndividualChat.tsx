import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import FSize from '../assets/commonCSS/FSize';
import Colors from '../assets/commonCSS/Colors';
import Images from '../assets/image';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import CInput from './CInput';
import ButtonNew from './ButtonNew';
import {KeyboardAvoidingView} from 'react-native';

const {height, width} = Dimensions.get('window');

// const messages = [
//   { id: 1, type: 'receiver', text: 'Hi there!', time: '10:00 AM' },
//   { id: 2, type: 'sender', text: 'Hello! How are you?', time: '10:02 AM' },
//   { id: 3, type: 'receiver', text: 'I’m doing well, thanks!', time: '10:05 AM' },
//   { id: 4, type: 'sender', text: 'Wanna join our team?', time: '10:07 AM' },
//   { id: 5, type: 'receiver', text: 'I’m doing well, thanks!', time: '10:05 AM' },
//   { id: 6, type: 'sender', text: 'Wanna join our team?', time: '10:07 AM' },
//   { id: 7, type: 'receiver', text: 'I’m doing well, thanks!', time: '10:05 AM' },
//   { id: 8, type: 'sender', text: 'Wanna join our team?', time: '10:07 AM' },
// ];

const IndividualChat = ({navigation, route}) => {
    const { name, userId, leadId, bidId, recieverId, id} = route.params;
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [file, setFile] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState({});
    const ws = useRef(null); // Use useRef to persist the WebSocket instance
  
    useEffect(() => {
      console.log('name:::::::::::::::', route?.params?.name);
      console.log('userid:::::::::::::::', route?.params?.userId);
      console.log('leadid:::::::::::::::', route?.params?.leadId);
      console.log('bidId:::::::::::::::', route?.params?.bidId);
      console.log('recieverId:::::::::::::::', route?.params?.recieverId);
    }, [route?.params]);
  
    useEffect(() => {
      // Initialize WebSocket connection
      console.log('message data:::::::::::', messages);
      ws.current = new WebSocket(`wss://sooprs.com:3000?user_id=${userId}`);
  
      ws.current.onopen = () => {
        console.log("Connection established!");
      };
  
      ws.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        // console.log('data from reciever::::::::::::::::', data);
  
        // Handle incoming messages
        if (
          (data.userId === userId && data.receiverId === recieverId) || 
          (data.userId === recieverId && data.receiverId === userId)
        ) {
          appendMessage(data.message, data.userId === userId ? 'sender' : 'receiver', data.file);
        }
        // Handle status updates
        // if (data.type === 'status') {
        //  updateUserStatus (data.userId, data.status);
        // }
      };
  
      ws.current.onerror = (error) => {
        console.error('WebSocket Error: ', error);
      };
  
      return () => {
        if (ws.current) {
          ws.current.close(); // Ensure the WebSocket is closed on component unmount
        }
      };
    }, [userId, setMessages]); // Add userId as a dependency to re-initialize if it changes
  
    // Append new message to the messages state
    const appendMessage = (message, type, file: any) => {
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          type,
          text: message,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    };
  
    const sendMessage = () => {
      if (inputMessage.trim()) {
        const messageData = {
          message: inputMessage,
          file,
          userId: Number(userId), // Convert userId to a number
          receiverId: Number(recieverId), // Convert recieverId to a number
          lead_id: Number(leadId), // Convert leadId to a number
          bid_id: Number(bidId), // Convert bidId to a number
        };
  
        // Send message through WebSocket
        console.log('🚀 Sending message:::', messageData);
  
        ws.current.send(JSON.stringify(messageData)); // Send through the WebSocket reference
     
        appendMessage(inputMessage, 'sender', file);
        setInputMessage('');
        setFile(null);
      } else {
        Alert.alert('Message cannot be empty');
      }
    };
//   const updateUserStatus = (userId, status) => {
//     setOnlineUsers((prevUsers) => {
//       const newUsers = { ...prevUsers };
//       if (status === 1) {
//         newUsers[userId] = true;
//       } else {
//         delete newUsers[userId];
//       }
//       return newUsers;
//     });
//   };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={hp(8)} // Adjust for any header height
    >
      {/* Header Section */}
      <View style={styles.headerSection}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={Images.backArrow}
            resizeMode="contain"
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <View style={styles.headerPart}>
          <View style={styles.header}>
            <Image
              source={Images.Clientlogo}
              style={{width: wp(12), height: hp(6)}}
            />
            <View style={styles.headerName}>
              <Text style={styles.headerText}>{name}</Text>
              <Text style={styles.headerStatus}>Online</Text>
            </View>
          </View>
          <View style={styles.projectStatus}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ProjectStatus', {id:id, recieverId:recieverId})}>
              <Image
                source={Images.projectStatus}
                style={{width: wp(10), height: hp(5)}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Messages Section */}
      <ScrollView contentContainerStyle={styles.messagesContainer}>
        {messages.map(message =>
          message.type === 'receiver' ? (
            <View key={message.id} style={styles.receiverMessage}>
              <Image
                source={Images.professionalslogo}
                style={styles.receiverAvatar}
              />
              <View style={styles.receiverBubble}>
                <Text style={styles.messageText}>{message.text}</Text>
                <Text style={styles.messageTime}>{message.time}</Text>
              </View>
            </View>
          ) : (
            <View key={message.id} style={styles.senderMessage}>
              <View style={styles.senderBubble}>
                <Text style={styles.messageText}>{message.text}</Text>
                <Text style={styles.messageTime}>{message.time}</Text>
              </View>
              <Image source={Images.Clientlogo} style={styles.senderAvatar} />
            </View>
          ),
        )}
      </ScrollView>

      {/* Send Message Input */}
      <View style={styles.sendMessage}>
        <CInput
          title={''}
          name={'Type here...'}
          isPassword={false}
          newlabel={false}
          style={undefined}
          value={inputMessage}
          setValue={setInputMessage}
          keyboardType={''}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default IndividualChat;

const styles = StyleSheet.create({
  container: {
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
  backArrow: {
    width: wp(8),
    height: hp(8),
  },
  header: {
    flexDirection: 'row',
    gap: wp(2),
    alignItems: 'center',
  },
  headerName: {
    flexDirection: 'column',
    gap: wp(1),
  },
  headerText: {
    fontWeight: '500',
    fontSize: FSize.fs16,
    color: Colors.black,
  },
  headerStatus: {
    fontWeight: '400',
    fontSize: FSize.fs12,
    color: '#40C700',
  },
  headerPart: {
    flexDirection: 'row',
    alignItems: 'center',
    //   gap:wp(25)
  },

  projectStatus: {
    position: 'absolute',
    left: wp(65),
  },

  messagesContainer: {
    padding: wp(4),
    gap: wp(2),
    flexGrow: 1,
  },
  receiverMessage: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: hp(1.5),
  },
  receiverAvatar: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
  },
  receiverBubble: {
    backgroundColor: Colors.white,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: 15,
    marginLeft: wp(2),
    elevation: 2,
  },
  senderMessage: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: hp(1.5),
  },
  senderBubble: {
    maxWidth: '75%',
    backgroundColor: Colors.white,
    padding: wp(3),
    borderRadius: 15,
    marginRight: wp(2),
    elevation: 2,
  },
  senderAvatar: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
  },
  messageText: {
    fontSize: 14,
    color: Colors.black,
  },
  messageTime: {
    fontSize: 12,
    color: Colors.gray,
    textAlign: 'right',
    marginTop: hp(0.5),
  },
  sendMessage: {
    flexDirection: 'row',
    //   alignItems: 'center',
    paddingHorizontal: wp(5),
    backgroundColor: Colors.white,
    width: width / 1.3,
  },
  sendBtn: {
    borderRadius: wp(2),
    height: hp(5.5),
    paddingHorizontal: wp(6),
    backgroundColor: Colors.sooprsblue,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(2),
  },
  sendText: {
    color: Colors.white,
    fontWeight: '500',
    fontSize: FSize.fs16,
  },
});
