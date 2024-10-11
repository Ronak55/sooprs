import { StyleSheet, Text, View, StatusBar, Modal } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from './src/Onboarding';
import ForgotPassword from './src/auth/ForgotPassword';
import RegisterSuccess from './src/auth/Success';
import Login from './src/auth/Login';
import ProfileSelection from './src/auth/ProfileSelection';
import Signup from './src/auth/Signup';;
import ClientBottomTab from './src/components/ClientBottomTab';
import ProfessionalBottomTab from './src/components/ProfessionalBottomTab';
import Toast from 'react-native-toast-message';
import Splash from './src/Splash';


const Stack = createNativeStackNavigator();

const Authentication = ()=>{

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
       
      <Stack.Screen name="ProfileSelection" component={ProfileSelection} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Forgot" component={ForgotPassword} />
      <Stack.Screen name="Success" component={RegisterSuccess} />
    </Stack.Navigator>
  );

}

const MainApp = ()=>{

return (
 

  <Stack.Navigator screenOptions={{headerShown:false}}>
    <Stack.Screen name='Splash' component={Splash}/>
    <Stack.Screen name='Onboarding' component={Onboarding}/>
    <Stack.Screen name='Authentication' component={Authentication}/>

     {/* Client login */}
     <Stack.Screen name="ClientLoggedIn" component={ClientBottomTab} />

     {/* Professional login */}
     <Stack.Screen name='ProfessionalLoggedIn' component={ProfessionalBottomTab}/>

  </Stack.Navigator>
)

}

const App = () => {
  return (
   <SafeAreaView style={{flex:1}}>
    <GestureHandlerRootView style={{flex:1}}>
      <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
        <MainApp/>
        <Toast />
      </NavigationContainer>
    </GestureHandlerRootView>
   </SafeAreaView>
  )
}

export default App

const styles = StyleSheet.create({})