import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, AuthorizationStatus, EventType} from '@notifee/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mobile_siteConfig } from './src/services/mobile-siteConfig';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFCMToken();
  }
} 

async function getFCMToken() {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    console.log('Your Firebase Token:', fcmToken);
    await AsyncStorage.setItem(mobile_siteConfig.fcmToken, fcmToken);

  } else {
    console.log('Failed to get FCM token');
  }
}

export const NotificationListener = () => {
    // Handle foreground messages
    // messaging().onMessage(async remoteMessage => {
    //   console.log('Foreground message received:', remoteMessage);
    // });
  
    // // Handle background messages
    // messaging().setBackgroundMessageHandler(async remoteMessage => {
    //   console.log('Background message received:', remoteMessage);
    // });
  
    // // Handle messages when app is opened from quit state
    // messaging()
    //   .getInitialNotification()
    //   .then(remoteMessage => {
    //     if (remoteMessage) {
    //       console.log('Quit state message:', remoteMessage);
    //     }
    //   });
  };

export const initializeApp = async () => {
    // Request notification permissions and create a notification channel
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
      console.log('User denied permissions request');
    } else if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
      console.log('User granted permissions request');
    } else if (settings.authorizationStatus === AuthorizationStatus.PROVISIONAL) {
      console.log('User provisionally granted permissions request');
    }

     
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'default channel',
      importance: AndroidImportance.HIGH,
    });

    // await notifee.displayNotification({
    //   title: 'Voila !',
    //   body:'Welcome to Sooprs 🎉',
    //   android: {
    //     channelId,
    //     importance: AndroidImportance.HIGH,
    //     // smallIcon: 'ic_stat_sooprslogo',
    //     pressAction: {
    //       id: 'default',
    //     },
    //   },
    // });

    // Handle foreground notifications
    let lastNotificationId = null;

    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      const notificationId = remoteMessage?.messageId;
    
      // Prevent duplicate handling
      if (lastNotificationId === notificationId) {
        console.log('Duplicate notification ignored:', notificationId);
        return;
      }
    
      lastNotificationId = notificationId;
    
      console.log('Foreground notification:', remoteMessage);
    
      await notifee.displayNotification({
        id: `foreground_${notificationId}`, // Use unique ID per notification
        title: remoteMessage?.notification?.title,
        body: remoteMessage?.notification?.body,
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
        },
      });
    });
    
    // Handle background and quit state notifications
    messaging().setBackgroundMessageHandler(async remoteMessage => {

      const notificationId = remoteMessage?.messageId;
    
      // Prevent duplicate handling
      if (lastNotificationId === notificationId) {
        console.log('Duplicate notification ignored:', notificationId);
        return;
      }
    
      lastNotificationId = notificationId;
      
      console.log('Notification handled in the background!', remoteMessage);

      const title = remoteMessage?.notification?.title;
      const body = remoteMessage?.notification?.body;

      console.log('background title and body are displayed:::', title, body )

        await notifee.displayNotification({
          id: `background_${notificationId}`,
          title: remoteMessage?.notification?.title,
          body: remoteMessage?.notification?.body,
          android: {
            channelId,
            importance: AndroidImportance.HIGH,
            pressAction: {
              id: 'default',
            },
          },
        });
      
    });

    // Clean up listeners on unmount
    return () => {
      unsubscribeOnMessage();
    };
  };
  