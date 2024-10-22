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
  FlatList,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import FSize from '../assets/commonCSS/FSize';
import Colors from '../assets/commonCSS/Colors';
import Images from '../assets/image';
import { hp, wp } from '../assets/commonCSS/GlobalCSS';
import CInput from './CInput';
import ButtonNew from './ButtonNew';
import { KeyboardAvoidingView } from 'react-native';
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import moment from 'moment';

const { height, width } = Dimensions.get('window');


const IndividualChat = ({ navigation, route }) => {
  const scrollEnd = useRef();
  const { name, userId, leadId, bidId, recieverId, id } = route.params;
  const [allConversations, setAllConversations] = useState([]);

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [file, setFile] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});

  const getAllUserChat = async (bidId, leadId, userId) => {
    try {
      const formData = new FormData();
      formData.append('last_segment', bidId); // Append lead_id
      formData.append('lead_id', leadId);
      formData.append('user_id', userId);
      // console.log('getAllUserChat::::::', formData)
      const response = await fetch('https://sooprs.com/api2/public/index.php/get-chat-history',
        {
          method: 'POST',
          body: formData,
        },
      );
      const res = await response.json();
      // console.log('getAllUserChat', res);
      setAllConversations(res);
      return
    } catch (error) {
      console.error(error);
      return;
    }

  }

  useEffect(() => {
    console.log('name:::::::::::::::', route?.params?.name);
    console.log('userid:::::::::::::::', route?.params?.userId);
    console.log('leadid:::::::::::::::', route?.params?.leadId);
    console.log('bidId:::::::::::::::', route?.params?.bidId);
    console.log('recieverId:::::::::::::::', route?.params?.recieverId);
    getAllUserChat(route?.params?.bidId, route?.params?.leadId, route?.params?.userId);
  }, [route?.params]);


  var ws = React.useRef(new WebSocket(`wss://sooprs.com:3000/?user_id=${userId}`)).current;

  React.useEffect(() => {
    ws.onopen = () => {
      console.log('Connected to the server')
    };
    ws.onclose = (e) => {
      console.log('Disconnected. Check internet or server.')
    };
    ws.onerror = (e) => {
      console.log(e.message);
    };
    ws.onmessage = (e) => {
      var mesg = JSON.parse(e.data)
      console.log("message received", mesg);
      if (mesg?.message !== undefined && mesg.receiverId !== undefined && mesg?.userId !== undefined) {
        setAllConversations((prevConversations) => [...prevConversations, mesg]);
      }
    };
  }, [])

  const sendAck = (datax) => {
    if (ws.readyState === WebSocket.OPEN) {
      console.log("sending message ot the web socket..", datax)
      ws.send(JSON.stringify(datax));
    } else {
      console.error('WebSocket is not open. Current readyState:', ws.readyState);
    }
  };
  useEffect(() => {
    const acknowledgmentData = {
      message: inputMessage,
      file,
      type: "acknowledgment",
      lead_id: Number(leadId), // The ID of the message received
      bid_id: Number(bidId), // The ID of the bid
      receiverId: Number(recieverId), // Fixed spelling: 'receiverId'
      status: "received", // Status or any custom acknowledgment message
      timestamp: new Date().toISOString() // Proper string format for timestamp
    };
    console.log("acknowledgmentData>>>>", acknowledgmentData)
    // Ensure that WebSocket is ready before sending data
    if (ws.readyState === WebSocket.OPEN) {
      console.log("sending message to web socket>>>")
      sendAck(acknowledgmentData);
    } else {
      console.error('WebSocket is not ready yet, state is:', ws.readyState);
    }

  }, [allConversations]);


  const sendMessage = () => {
    if (inputMessage.trim()) {
      const messageData = {
        message: inputMessage,
        file,
        userId: Number(userId), // Convert userId to a number
        receiverId: Number(recieverId), // Convert recieverId to a number
        lead_id: Number(leadId), // Convert leadId to a number
        bid_id: Number(bidId), // Convert bidId to a number
        created_at: new Date(),
        // pro_details: {
        //   "id": userId
        // }
      };
      // Send message through WebSocket
      console.log('🚀 Sending message:::', messageData);
      ws.send(JSON.stringify(messageData)); // Send through the WebSocket reference
      setAllConversations((prevConversations) => [...prevConversations, messageData]);
      // appendMessage(inputMessage, 'sender', file);
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
              style={{ width: wp(12), height: hp(6) }}
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
                style={{ width: wp(10), height: hp(5) }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Messages Section */}
      <FlatList
        ref={scrollEnd}
        onContentSizeChange={() =>
          scrollEnd.current.scrollToEnd({ animated: true })
        }
        data={allConversations}
        // keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => {
          if (item?.pro_details?.id === userId || Number(item?.userId) === Number(userId)) {
            return (
              <View key={index}>
                <View style={styles.senderMessage}>
                  <View style={styles.senderBubble}>
                    <Text style={styles.messageText}>{item?.message}</Text>
                    {item?.created_at &&
                      <Text style={styles.messageTime}>{moment(item?.created_at).fromNow()}</Text>
                    }
                  </View>

                  <View style={{
                    height: hp(5),
                    width: hp(5),
                    borderRadius: hp(2.5),
                    overflow: 'hidden',
                  }}>
                    <Image
                      style={{
                        height: '100%',
                        width: '100%'
                      }}
                      source={item?.pro_details?.image !== undefined ? { uri: item?.pro_details?.image } : Images.professionalslogo}
                    />
                  </View>
                </View>
              </View>
            )
          } else {
            return (
              <View key={index}>
                <View style={styles.receiverMessage}>
                  <Image
                    source={item?.pro_details?.image !== undefined ? { uri: item?.pro_details?.image } : Images.professionalslogo}
                    style={styles.receiverAvatar}
                  />
                  <View style={styles.receiverBubble}>
                    <Text style={styles.messageText}>{item?.message}</Text>
                    {item?.created_at &&
                      <Text style={styles.messageTime}>{moment(item?.created_at).fromNow()}</Text>
                    }
                  </View>
                </View>
              </View>
            )
          }
        }}
      />

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
