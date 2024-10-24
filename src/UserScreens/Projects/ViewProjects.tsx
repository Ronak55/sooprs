import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { hp, wp } from '../../assets/commonCSS/GlobalCSS';
import Images from '../../assets/image';
import Colors from '../../assets/commonCSS/Colors';
import FSize from '../../assets/commonCSS/FSize';
import Projects from '../TabView/Projects';
import AssignedProjects from '../AssignedProjects/AssignedProjects';

const ViewProjects = ({ navigation }: { navigation: any }) => {
  const [activeTab, setActiveTab] = useState('myEnquiries'); // State to track active tab

  const renderContent = () => {
    if (activeTab === 'myEnquiries') {
      return <Projects navigation={navigation} />;
    } else if (activeTab === 'assignedProjects') {
      return <AssignedProjects navigation={navigation} />;
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.headerSection}>
        <TouchableOpacity onPress={() => navigation.navigate('ClientHome')}>
          <Image
            source={Images.backArrow}
            resizeMode="contain"
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Projects</Text>
      </View>
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'myEnquiries' ? styles.activeTab : styles.inactiveTab,
          ]}
          onPress={() => setActiveTab('myEnquiries')}
        >
          <Text style={activeTab === 'myEnquiries' ? styles.activeTabText : styles.inactiveTabText}>
            My Enquiries
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'assignedProjects' ? styles.activeTab : styles.inactiveTab,
          ]}
          onPress={() => setActiveTab('assignedProjects')}
        >
          <Text style={activeTab === 'assignedProjects' ? styles.activeTabText : styles.inactiveTabText}>
            Assigned Projects
          </Text>
        </TouchableOpacity>
      </View>

      {/* Render the selected tab content */}
      {renderContent()}
    </View>
  );
};

export default ViewProjects;

const styles = StyleSheet.create({
  section: {
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
  headerText: {
    color: Colors.black,
    fontWeight: '500',
    fontSize: FSize.fs16,
  },
  backArrow: {
    width: wp(8),
    height: hp(8),
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp(5),
    marginVertical: hp(2),
    gap:wp(5)
  },
  tab: {
    flex: 1,
    padding: hp(1.3),
    borderRadius: wp(4),
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.sooprsblue,
  },
  inactiveTab: {
    backgroundColor: Colors.black,
  },
  activeTabText: {
    color: Colors.white,
    fontWeight: '600',
  },
  inactiveTabText: {
    color: Colors.white,
  },
});
