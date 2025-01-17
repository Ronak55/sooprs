import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Colors from '../assets/commonCSS/Colors';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import ClientHome from '../UserScreens/Home/ClientHome';
import Projects from '../UserScreens/Projects/ViewProjects';
import Professionals from '../UserScreens/Professionals/Professionals';
import Gigs from '../UserScreens/Gigs/Gigs';
import Account from '../UserScreens/Account/Account';
import Images from '../assets/image';
import ProfessionalProfile from '../UserScreens/Profile/ProfessionalProfile';
import ClientProfile from '../UserScreens/Profile/ClientProfile';
import FSize from '../assets/commonCSS/FSize';
import ProjectPosting from '../UserScreens/Projects/ProjectPosting';
import ProjectBids from '../UserScreens/Projects/ProjectBids';
import ManageDetails from './ManageDetails';
import ManagePassword from './ManagePassword';
import AllProfessionals from './AllProfessionals';
import CategoriesList from './CategoriesList';
import Notifications from './Notifications';
import IndividualChat from './IndividualChat';
import ProjectStatus from './ProjectStatus';
import AssignedProjects from '../UserScreens/AssignedProjects/AssignedProjects';
import BankDetails from './BankDetails';
import Refer from './Refer';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

const Bottom = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ClientHome" component={ClientHome} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="ClientProfile" component={ClientProfile} />
      <Stack.Screen name="ProjectPosting" component={ProjectPosting} />
      <Stack.Screen
        name="ProfessionalProfile"
        component={ProfessionalProfile}
      />
      <Stack.Screen name="Gigs" component={Gigs} />
    </Stack.Navigator>
  );
};

const ProjectStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ProjectsScreen" component={Projects} />
      <Stack.Screen name="IndividualChat" component={IndividualChat} />
      <Stack.Screen name="ProjectBids" component={ProjectBids} />
      <Stack.Screen name="ProjectStatus" component={ProjectStatus} />
    </Stack.Navigator>
  );
};

const ProfessionalStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ProfessionalsScreen" component={Professionals} />
      <Stack.Screen
        name="ProfessionalProfile"
        component={ProfessionalProfile}
      />
      <Stack.Screen name="CategoriesList" component={CategoriesList} />
    </Stack.Navigator>
  );
};

const AccountStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="AccountScreen" component={Account} />
      <Stack.Screen name="ManageDetails" component={ManageDetails} />
      <Stack.Screen name="BankDetails" component={BankDetails} />
      <Stack.Screen name="ManagePassword" component={ManagePassword} />
      <Stack.Screen name="Refer" component={Refer} />
    </Stack.Navigator>
  );
};

const getTabBarIcon = (route: any, focused: boolean) => {
  let iconName;

  switch (route.name) {
    case 'Home':
      iconName = Images.homeIcon;
      break;

    case 'Projects':
      iconName = Images.projectsIcon;
      break;

    case 'Professionals':
      iconName = Images.professionalsIcon;
      break;

    case 'Gigs':
      iconName = Images.gigsIcon;
      break;

    case 'Account':
      iconName = Images.accountIcon;
      break;

    default:
      iconName = Images.homeIcon;
      break;
  }

  return (
    <Image
      source={iconName}
      style={{
        width: focused ? wp(7) : wp(6),
        height: focused ? hp(7) : hp(6),
        tintColor: focused ? Colors.selectedBottomTab : Colors.sooprsblue,
      }}
      resizeMode="contain"
    />
  );
};

const ClientBottomTab = () => {
  const screensToHideTabBar = [
    'ManageDetails',
    'BankDetails',
    'ManagePassword',
    'Refer',
    'Notifications',
    'IndividualChat',
    'ProfessionalProfile',
    'ProjectBids',
    'ProjectStatus',
    'ClientProfile',
    'ProjectPosting',
  ];
  return (
    <Bottom.Navigator
      screenOptions={({route}) => {
        // Get the focused route name
        const routeName = getFocusedRouteNameFromRoute(route);

        const shouldHideTabBar = screensToHideTabBar.includes(routeName);

        return {
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: shouldHideTabBar
            ? {display: 'none'} // Hide the tab bar
            : {
                backgroundColor: '#FFFFFF',
                height: hp(10),
                borderTopRightRadius: wp(10),
                borderTopLeftRadius: wp(10),
                paddingBottom: hp(2),
              },
          tabBarIcon: ({focused}) => getTabBarIcon(route, focused),
          tabBarLabel: ({focused, color}) => (
            <Text
              style={{
                color: focused ? Colors.selectedBottomTab : Colors.sooprsblue,
                fontSize: FSize.fs10,
              }}>
              {route.name}
            </Text>
          ),
        };
      }}>
      <Bottom.Screen name={'Home'} component={HomeStack} />
      <Bottom.Screen name="Projects" component={ProjectStack} />
      <Bottom.Screen name="Professionals" component={ProfessionalStack} />
      {/* <Bottom.Screen name="Gigs" component={Gigs} /> */}
      <Bottom.Screen name="Account" component={AccountStack} />
    </Bottom.Navigator>
  );
};

export default ClientBottomTab;

const styles = StyleSheet.create({});
