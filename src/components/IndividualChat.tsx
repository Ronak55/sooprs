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
  ImageBackground,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import FSize from '../assets/commonCSS/FSize';
import Colors from '../assets/commonCSS/Colors';
import Images from '../assets/image';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import CInput from './CInput';
import ButtonNew from './ButtonNew';
import {KeyboardAvoidingView} from 'react-native';
import moment from 'moment';
import 'moment-timezone';

const {height, width} = Dimensions.get('window');

const IndividualChat = ({navigation, route}) => {
  const scrollEnd = useRef();
  const {
    name,
    cust_image,
    userId,
    leadId,
    bidId,
    recieverId,
    id,
    project_status,
  } = route.params;
  const [allConversations, setAllConversations] = useState([]);
  const [receiverName, setReceiverName] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [file, setFile] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [senderImage, setsenderImage] = useState('');
  const [receiverImage, setReceiverImage] = useState('');
  const [visibleTimeIndex, setVisibleTimeIndex] = useState(null);
  const toggleTimeVisibility = index => {
    // Toggle visibility for the clicked message
    setVisibleTimeIndex(visibleTimeIndex === index ? null : index);
  };

  const getAllUserChat = async (bidId, leadId, userId) => {
    try {
      const formData = new FormData();
      formData.append('last_segment', bidId); // Append lead_id
      formData.append('lead_id', leadId);
      formData.append('user_id', userId);
      // console.log('recieverId::::::', recieverId)
      const response = await fetch(
        'https://sooprs.com/api2/public/index.php/get-chat-history',
        {
          method: 'POST',
          body: formData,
        },
      );
      const res = await response.json();
      console.log('getAllUserChat::::::::::::::', res);

      if (res.length > 0) {
        // Loop through the conversation to identify sender and receiver
        res.forEach(message => {
          if (message?.pro_details?.id === userId) {
            // Current user is the sender
            console.log('sender image::::::::', message?.pro_details?.image);
            setsenderImage(message?.pro_details?.image);
          } else {
            // Other user is the receiver
            console.log('receiver image::::::::', message?.pro_details?.image);
            setReceiverImage(message?.pro_details?.image);
            setReceiverName(message?.pro_details?.name);
          }
        });
      }
      setAllConversations(res);
      return;
    } catch (error) {
      console.error('new error chat::::::', error);
      return;
    }
  };

  useEffect(() => {
    console.log('name:::::::::::::::', route?.params?.name);
    console.log('userid:::::::::::::::', route?.params?.userId);
    console.log('leadid:::::::::::::::', route?.params?.leadId);
    console.log('bidId:::::::::::::::', route?.params?.bidId);
    console.log('recieverId:::::::::::::::', route?.params?.recieverId);
    console.log(
      'project status:::::::::::::::::::',
      route?.params?.project_status,
    );
    console.log('customer image:::::::::::::::::', route?.params?.cust_image);
    getAllUserChat(
      route?.params?.bidId,
      route?.params?.leadId,
      route?.params?.userId,
    );
  }, [route?.params]);

  var ws = React.useRef(
    new WebSocket(`wss://sooprs.com:3000/?user_id=${userId}`),
  ).current;

  React.useEffect(() => {
    ws.onopen = () => {
      console.log('Connected to the server');
    };
    ws.onclose = e => {
      console.log('Disconnected. Check internet or server.');
    };
    ws.onerror = e => {
      console.log(e.message);
    };
    ws.onmessage = e => {
      var mesg = JSON.parse(e.data);
      console.log('message received', mesg);
      if (
        mesg?.message !== undefined &&
        mesg.receiverId !== undefined &&
        mesg?.userId !== undefined
      ) {
        setAllConversations(prevConversations => [...prevConversations, mesg]);
      }
    };
  }, []);

  const sendAck = datax => {
    if (ws.readyState === WebSocket.OPEN) {
      console.log('sending message ot the web socket..', datax);
      ws.send(JSON.stringify(datax));
    } else {
      console.error(
        'WebSocket is not open. Current readyState:',
        ws.readyState,
      );
    }
  };
  useEffect(() => {
    const acknowledgmentData = {
      message: inputMessage,
      file,
      type: 'acknowledgment',
      lead_id: Number(leadId), // The ID of the message received
      bid_id: Number(bidId), // The ID of the bid
      receiverId: Number(recieverId), // Fixed spelling: 'receiverId'
      status: 'received', // Status or any custom acknowledgment message
      timestamp: new Date().toISOString(), // Proper string format for timestamp
    };
    console.log('acknowledgmentData>>>>', acknowledgmentData);
    // Ensure that WebSocket is ready before sending data
    if (ws.readyState === WebSocket.OPEN) {
      console.log('sending message to web socket>>>');
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
        pro_details: {
          "id": userId
        }
      };
      // Send message through WebSocket
      console.log('🚀 Sending message:::', messageData);
      ws.send(JSON.stringify(messageData)); // Send through the WebSocket reference
      setAllConversations(prevConversations => [
        ...prevConversations,
        messageData,
      ]);
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
        <TouchableOpacity onPress={() => navigation.navigate('Projects')}>
          <Image
            source={Images.backArrow}
            resizeMode="contain"
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <View style={styles.headerPart}>
          <View style={styles.header}>
            <Image
              source={receiverImage ? {uri: receiverImage} : Images.Clientlogo}
              style={{width: wp(10), height: hp(5), borderRadius: wp(5)}}
            />
            <View style={styles.headerName}>
              <Text style={styles.headerText}>
                {name ? name : receiverName}
              </Text>
              {/* <Text style={styles.headerStatus}>Online</Text> */}
            </View>
          </View>
          <View style={styles.projectStatus}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ProjectStatus', {
                  id: id,
                  recieverId: recieverId,
                  project_status: project_status,
                })
              }>
              <Image
                source={Images.projectStatus}
                style={{width: wp(10), height: hp(5)}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Messages Section */}

      <FlatList
        ref={scrollEnd}
        onContentSizeChange={() =>
          scrollEnd.current.scrollToEnd({animated: true})
        }
        data={allConversations}
        renderItem={({item, index}) => {
          const isLastMessageFromUser =
            index === allConversations.length - 1 ||
            allConversations[index + 1]?.pro_details?.id !==
              item.pro_details?.id;

          if (
            item?.pro_details?.id === userId ||
            Number(item?.userId) === Number(userId)
          ) {
            return (
              <View key={index} style={styles.newMessage}>
                <TouchableOpacity onPress={() => toggleTimeVisibility(index)}>
                  <View style={styles.senderMessage}>
                    <View style={styles.senderBubble}>
                      <Text style={styles.messageText}>{item?.message}</Text>
                    </View>
                    <View
                      style={{
                        height: hp(4),
                        width: hp(4),
                        borderRadius: hp(2.5),
                        overflow: 'hidden',
                      }}>
                      {isLastMessageFromUser && (
                        <Image
                          style={{
                            height: '100%',
                            width: '100%',
                          }}
                          source={
                            senderImage !== ''
                              ? {uri: senderImage}
                              : Images.professionalslogo
                          }
                        />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
                <View style={styles.senderNewTime}>
                  {visibleTimeIndex === index && item?.created_at && (
                    <Text style={styles.messageTime}>
                      {moment
                        .utc(item?.created_at)
                        .tz('Asia/Kolkata')
                        .format('h:mm A')}
                    </Text>
                  )}
                </View>
              </View>
            );
          } else {
            return (
              <View key={index} style={styles.newMessage}>
                <TouchableOpacity onPress={() => toggleTimeVisibility(index)}>
                  <View style={styles.receiverMessage}>
                    <View
                      style={{
                        height: hp(4),
                        width: hp(4),
                        borderRadius: hp(2.5),
                        overflow: 'hidden',
                      }}>
                      {isLastMessageFromUser && (
                        <Image
                          source={
                            receiverImage !== ''
                              ? {uri: receiverImage}
                              : Images.professionalslogo
                          }
                          style={styles.receiverAvatar}
                        />
                      )}
                    </View>
                    <View style={styles.receiverBubble}>
                      <Text style={styles.messageText}>{item?.message}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <View style={styles.receiverNewTime}>
                  {visibleTimeIndex === index && item?.created_at && (
                    <Text style={styles.messageTime}>
                      {moment
                        .utc(item?.created_at)
                        .tz('Asia/Kolkata')
                        .format('h:mm A')}
                    </Text>
                  )}
                </View>
              </View>
            );
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
          style={{}}
          customInputStyle={{borderRadius:wp(5), borderColor:"#D9D9D9"}}
          value={inputMessage}
          setValue={setInputMessage}
          keyboardType={''}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
          <Image source={Images.sendIcon} style={styles.sendImg} />
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
    marginHorizontal: wp(3),
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
    left: wp(67.5),
  },

  messagesContainer: {
    padding: wp(4),
    gap: wp(2),
    flexGrow: 1,
  },
  receiverMessage: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    // marginBottom: hp(0.5),
    marginLeft: wp(3),
    marginTop: hp(1),
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
    maxWidth: '50%', // Restrict the maximum width of the bubble
    alignSelf: 'flex-start', // Align the bubble to the left
  },
  
  senderMessage: {
    flexDirection: 'row',
    marginRight: wp(3),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    // marginBottom: hp(0.5),
  },
  senderBubble: {
    maxWidth: '50%',
    backgroundColor: '#EFF6FF',
    padding: wp(2.5),
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
    color: '#999999',
  },
  messageTime: {
    fontSize: FSize.fs10,
    color: Colors.gray,
    textAlign: 'right',
    marginTop: hp(0.5),
  },

  senderNewTime: {
    alignItems: 'center',
    marginLeft: wp(50),
    marginBottom: hp(1.2),
  },

  receiverNewTime: {
    alignItems: 'flex-start',
    marginLeft: wp(15),
    // marginBottom:hp(1.2)
  },

  newMessage: {
    flexDirection: 'column',
    marginHorizontal: wp(3),
  },

  sendMessage: {
    flexDirection: 'row',
    //   alignItems: 'center',
    // paddingHorizontal: wp(7),
    gap: wp(1),
    marginHorizontal: wp(5),
    backgroundColor: Colors.white,
    // justifyContent:'center',
    // alignItems:'center',
    width: width / 1.3,
  },
  sendBtn: {
    // justifyContent: 'center',
    // marginTop: hp(0.5),
    alignItems: 'center',
    marginLeft: wp(1),
  },
  sendText: {
    color: Colors.white,
    fontWeight: '500',
    fontSize: FSize.fs16,
  },

  sendImg: {
    width: wp(11),
    height: hp(5.5),
  },
});
