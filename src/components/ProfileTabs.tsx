import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabView, SceneMap } from 'react-native-tab-view';
import Colors from '../assets/commonCSS/Colors';
import { hp, wp } from '../assets/commonCSS/GlobalCSS';
import Portfolio from '../ProfessionalScreens/TabView/Portfolio';
import Services from '../ProfessionalScreens/TabView/Services';
import Skills from '../ProfessionalScreens/TabView/Skills';
import Reviews from '../ProfessionalScreens/TabView/Reviews';
import CompanyInfo from '../UserScreens/TabView/CompanyInfo';
import Projects from '../UserScreens/TabView/Projects';
import FSize from '../assets/commonCSS/FSize';

const Tab = createMaterialTopTabNavigator();

interface TabParams {
  services?: string[];
  skills?: string[];  
}

const ProfileTabs = ({ tabs, isClient, services, skills }: { tabs: any, isClient:any, services:string[], skills:string[]}) => {
  const renderTabScreens = () => {
    return tabs.map((tab: any, index: any) => {
      let Component;
      const initialParams: TabParams = {};

      switch (tab) {
        case 'Portfolio':
          Component = Portfolio;
          break;
        case 'Services':
          Component = Services;
          initialParams.services = services;
          break;
        case 'Skills':
          Component = Skills;
          initialParams.skills = skills; 
          break;
        case 'Reviews':
          Component = Reviews;
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

      return <Tab.Screen key={index} name={tab} component={Component} initialParams={initialParams}/>
    });
  };

  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
        tabBarLabel: ({ focused }) => (
          <Text
        
            style={{ color: focused ? Colors.white : Colors.black, fontSize:FSize.fs12 }}
          >
            {route.name}
          </Text>
        ),  

        tabBarStyle: {
          marginTop:wp(6),
          height: hp(6),
          width:"100%",
        //   backgroundColor:Colors.white

        },
        tabBarItemStyle: {
          width: isClient ? wp(34) : wp(24),
        },
        tabBarIndicatorStyle: {
          backgroundColor: '#0077FF',
          height: '100%',
          borderRadius: wp(10),
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
