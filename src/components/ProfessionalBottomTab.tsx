import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Colors from '../assets/commonCSS/Colors';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import ProfessionalHome from '../ProfessionalScreens/Home/ProfessionalHome';
import Projects from '../ProfessionalScreens/Projects/Projects';
import Account from '../ProfessionalScreens/Account/Account';
import Images from '../assets/image';
import ProfessionalProfile from '../UserScreens/Profile/ProfessionalProfile';
import FSize from '../assets/commonCSS/FSize';
import ProjectDetails from './ProjectDetails';
import ManageDetails from './ManageDetails';
import ManagePassword from './ManagePassword';
import AddCredits from './AddCredits';
import AddSkills from './AddSkills';
import BankDetails from './BankDetails';
import ManagePortfolio from './ManagePortfolio';
import AddServices from './AddServices';
import AddExperience from './AddExperience';
import AddPortfolio from './AddPortfolio';
import ManageExperience from './ManageExperience';
import ManageResume from './ManageResume';
import ManageAcademics from './ManageAcademics';
import AddAcademics from './AddAcademics';
import Notifications from './Notifications';
import IndividualChat from './IndividualChat';
import ProjectStatus from './ProjectStatus';
import AssignedProjects from '../ProfessionalScreens/Projects/AssignedProjects';
import Refer from './Refer';
import MovingBanner from './MovingBanner';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const Bottom = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ProfessionalHome" component={ProfessionalHome} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="IndividualChat" component={IndividualChat} />
      <Stack.Screen name="ProjectDetails" component={ProjectDetails} />
      <Stack.Screen name="ProjectStatus" component={ProjectStatus} />
      <Stack.Screen
        name="ProfessionalProfile"
        component={ProfessionalProfile}
      />
      <Stack.Screen name="MovingBanner" component={MovingBanner} />
    </Stack.Navigator>
  );
};

const AccountStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="AccountScreen" component={Account} />
      <Stack.Screen name="ManageDetails" component={ManageDetails} />
      <Stack.Screen name="AddCredits" component={AddCredits} />
      <Stack.Screen name="AddSkills" component={AddSkills} />
      <Stack.Screen name="AddServices" component={AddServices} />
      <Stack.Screen name="AddExperience" component={AddExperience} />
      <Stack.Screen name="AddPortfolio" component={AddPortfolio} />
      <Stack.Screen name="AddAcademics" component={AddAcademics} />
      <Stack.Screen name="ManagePassword" component={ManagePassword} />

      <Stack.Screen name="BankDetails" component={BankDetails} />
      <Stack.Screen name="ManageExperience" component={ManageExperience} />
      <Stack.Screen name="ManagePortfolio" component={ManagePortfolio} />
      <Stack.Screen name="ManageResume" component={ManageResume} />
      <Stack.Screen name="ManageAcademics" component={ManageAcademics} />
      <Stack.Screen name="Refer" component={Refer} />
    </Stack.Navigator>
  );
};

const AssignedProjectsStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="AssignedProjects" component={AssignedProjects} />
      <Stack.Screen name="IndividualChat" component={IndividualChat} />
      <Stack.Screen name="ProjectStatus" component={ProjectStatus} />
    </Stack.Navigator>
  );
};

const ProjectsStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Projects" component={Projects} />
      <Stack.Screen name="ProjectDetails" component={ProjectDetails} />
    </Stack.Navigator>
  );
};

const getTabBarIcon = (route: any, focused: boolean) => {
  let iconName;

  switch (route.name) {
    case 'Home':
      iconName = Images.homeIcon;
      break;

    case 'My Bids':
      iconName = Images.projectsIcon;
      break;

    case 'Assigned Projects':
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

const ProfessionalBottomTab = () => {

  const screensToHideTabBar = [
    "ManageDetails",
    "AddCredits",
    "AddSkills",
    "AddServices",
    "AddExperience",
    "AddPortfolio",
    "AddAcademics",
    "ManagePassword",
    "BankDetails",
    "ManageExperience",
    "ManagePortfolio",
    "ManageResume",
    "ManageAcademics",
    "Refer",
    "Notifications",
    "IndividualChat",
    "ProjectStatus",
    "ProjectDetails",
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
      <Bottom.Screen name="My Bids" component={ProjectsStack} />
      <Bottom.Screen
        name="Assigned Projects"
        component={AssignedProjectsStack}
      />
      <Bottom.Screen name="Account" component={AccountStack} />
    </Bottom.Navigator>
  );
};

export default ProfessionalBottomTab;

const styles = StyleSheet.create({});
