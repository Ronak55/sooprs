import {
  StyleSheet,
} from 'react-native';
import {hp, wp} from './src/assets/commonCSS/GlobalCSS';
import FSize from './src/assets/commonCSS/FSize';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ForgotPassword from './src/auth/ForgotPassword';
import RegisterSuccess from './src/auth/Success';
import Login from './src/auth/Login';
import ProfileSelection from './src/auth/ProfileSelection';
import Signup from './src/auth/Signup';
import ClientBottomTab from './src/components/ClientBottomTab';
import ProfessionalBottomTab from './src/components/ProfessionalBottomTab';
import Toast from 'react-native-toast-message';
import Splash from './src/Splash';
import { requestUserPermission, NotificationListener, initializeApp } from './NotificationService';

const Stack = createNativeStackNavigator();

const Authentication = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ProfileSelection" component={ProfileSelection} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Forgot" component={ForgotPassword} />
      <Stack.Screen name="Success" component={RegisterSuccess} />
    </Stack.Navigator>
  );
};

const MainApp = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Splash" component={Splash} />
      {/* <Stack.Screen name="Onboarding" component={Onboarding} /> */}
      <Stack.Screen name="Authentication" component={Authentication} />
      {/* Client login */}
      <Stack.Screen name="ClientLoggedIn" component={ClientBottomTab} />
      {/* Professional login */}
      <Stack.Screen
        name="ProfessionalLoggedIn"
        component={ProfessionalBottomTab}
      />
    </Stack.Navigator>
  );
};

const App = () => {

  useEffect(() => {
    initializeApp();
    requestUserPermission();
    NotificationListener();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer>
            <MainApp />
          <Toast />
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Adds a light overlay effect
  },
  loader: {
    width: wp(60),
    height: hp(20),
    backgroundColor: '#1E1E1E', // Dark background for contrast
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // Adds a subtle shadow
  },
  loadingText: {
    marginTop: hp(2),
    color: '#ffffff',
    fontSize: FSize.fs16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
