import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Colors from '../assets/commonCSS/Colors';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import ProfessionalHome from '../ProfessionalScreens/Home/ProfessionalHome';
import Projects from '../ProfessionalScreens/Projects/Projects';
import Chat from '../ProfessionalScreens/Chat/Chat';
import Account from '../ProfessionalScreens/Account/Account';
import Images from '../assets/image';
import Profile from '../UserScreens/Profile/ProfessionalProfile';
import FSize from '../assets/commonCSS/FSize';

const Bottom = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ProfessionalHome" component={ProfessionalHome} />
      <Stack.Screen name="Projects" component={Projects} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Account" component={Account} />
    </Stack.Navigator>
  );
};

const getTabBarIcon = (route:any, focused:boolean) =>{

  let iconName;

  switch(route.name){

    case 'Home':
      iconName = Images.homeIcon;
      break;

    case 'Projects':
      iconName = Images.projectsIcon;
      break;

    case 'Professionals':
      iconName = Images.chatIcon;
      break;

    case 'Account':
      iconName = Images.accountIcon;
      break;

    default:
      iconName = Images.homeIcon;
      break;
  }

  return (
    <Image source = {iconName} 
      style={{width: focused ? wp(7) : wp(6), 
      height: focused ? hp(7): hp(6),
      tintColor: focused ? Colors.selectedBottomTab : Colors.sooprsblue,
    }} resizeMode='contain'/>
  )

}

const ClientBottomTab = () => {
  return (
    <Bottom.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarHideOnKeyboard: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          height: hp(10),
          borderTopRightRadius:wp(10),
          borderTopLeftRadius:wp(10),
          paddingBottom:hp(2),
          paddingHorizontal:wp(6)
        },
        tabBarIcon: ({focused}) => getTabBarIcon(route, focused),

        tabBarLabel: ({focused, color}) => (
          <Text style={{color: focused ? Colors.selectedBottomTab : Colors.sooprsblue, fontSize: FSize.fs10}}>
            {route.name}
          </Text>
        ),
      })}>
      <Bottom.Screen name={"Home"} component={HomeStack} />
      <Bottom.Screen name="Projects" component={Projects} />
      <Bottom.Screen name="Chat" component={Chat} />
      <Bottom.Screen name="Account" component={Account} />
    </Bottom.Navigator>
  );
};

export default ClientBottomTab;

const styles = StyleSheet.create({});
