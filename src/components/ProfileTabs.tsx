import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {TabView, SceneMap} from 'react-native-tab-view';
import Colors from '../assets/commonCSS/Colors';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import Portfolio from '../ProfessionalScreens/TabView/Portfolio';
import Services from '../ProfessionalScreens/TabView/Services';
import Skills from '../ProfessionalScreens/TabView/Skills';
import Reviews from '../ProfessionalScreens/TabView/Reviews';
import CompanyInfo from '../UserScreens/TabView/CompanyInfo';
import Projects from '../UserScreens/TabView/Projects';
import FSize from '../assets/commonCSS/FSize';

const Tab = createMaterialTopTabNavigator();

interface TabParams {
  id: any;
  services?: string[];
  skills?: string[];
}
const ProfileTabs = ({
  tabs,
  isClient,
  portfolio,
  services,
  skills,
}: {
  tabs: any;
  portfolio: any;
  isClient: any;
  services: string[];
  skills: string[];
}) => {
  const renderTabScreens = () => {
    // Filter out "Reviews" from tabs array
    const filteredTabs = tabs.filter((tab: string) => tab !== 'Reviews');

    return filteredTabs.map((tab: any, index: any) => {
      let Component;
      const initialParams: TabParams = {
        id: undefined,
      };
      switch (tab) {
        case 'Portfolio':
          Component = Portfolio;
          initialParams.id = portfolio;
          break;
        case 'Services':
          Component = Services;
          initialParams.services = services;
          break;
        case 'Skills':
          Component = Skills;
          initialParams.skills = skills;
          break;
        case 'Company Info':
          Component = CompanyInfo;
          break;
        case 'Projects':
          Component = Projects;
          break;
        default:
          Component = () => (
            <View>
              <Text>Unknown Tab</Text>
            </View>
          );
      }

      return (
        <Tab.Screen
          key={index}
          name={tab}
          component={Component}
          initialParams={initialParams}
        />
      );
    });
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabel: ({ focused }) => (
          <Text
            style={{
              color: focused ? Colors.white : Colors.black,
              fontSize: FSize.fs12,
            }}>
            {route.name}
          </Text>
        ),

        tabBarStyle: {
          marginTop: wp(6),
          marginVertical: hp(1),
          // paddingRight: wp(2),
          marginHorizontal: wp(3),
          borderRadius: wp(6),
          paddingVertical: hp(0.5),
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 5, // For Android
        },
        tabBarItemStyle: {
          width: isClient ? wp(34) : wp(32),
        },
        tabBarIndicatorStyle: {
          backgroundColor: Colors.sooprsblue,
          height: hp(5), // Reducing height to keep it contained
          width: wp(25), // Adjusting width to keep the indicator within bounds
          borderRadius: wp(10),
          alignSelf:'center',
          marginLeft: wp(3),
          marginBottom:hp(0.5)
        },
      })}>
      {renderTabScreens()}
    </Tab.Navigator>
  );
};


const styles = StyleSheet.create({
  tabLabel: {
    fontWeight: '500',
    fontSize: FSize.fs16,
  },
});

export default ProfileTabs;
