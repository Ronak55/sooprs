import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import Colors from '../assets/commonCSS/Colors';
import FSize from '../assets/commonCSS/FSize';
import Images from '../assets/image';
import React, {useEffect, useState} from 'react';
import BidModal from './BidModal';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';

const ProjectDetails = ({navigation, route}: {navigation: any; route: any}) => {
  const {id, name, desc, category, budget, createdAt} = route.params;
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    console.log('services:::::::::::::', category);
  });

  return (
    <View style={styles.section}>
      <View style={styles.headerSection}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ProfessionalHome');
          }}>
          <Image
            source={Images.backArrow}
            resizeMode="contain"
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text
          style={{
            color: Colors.black,
            fontWeight: '500',
            fontSize: FSize.fs16,
          }}>
          Project Details
        </Text>
      </View>
      <View style={styles.projectSection}>
        <View style={styles.projectTitle}>
          <Text style={styles.title}>{name}</Text>
        </View>
        <View style={styles.projectPosted}>
          <View style={styles.posted}>
            <Text style={styles.postedText}>Posted:</Text>
            <Text style={styles.postedDate}> {createdAt}</Text>
          </View>
          <View style={styles.posted}>
            <Text style={styles.postedText}>Budget:</Text>
            <Text style={styles.postedDate}> ${budget}</Text>
          </View>
          {/* <View style={styles.posted}>
            <Image
              source={Images.locationIcon}
              style={styles.contactIcon}
              resizeMode="contain"
            />
            <Text style={styles.postedDate}> New Delhi</Text>
          </View> */}
        </View>
        <View>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.bidbtn}>
            <Text style={styles.btnText}>Bid</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.skillSection}>
        <Text style={styles.skillText}>Skills</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => {}} style={styles.catbtn}>
            <Text style={styles.btnText}>{category}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.skillSection}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => {}} style={styles.descbtn}>
            <Text style={styles.descText}>Description</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.descDetails}>
            <Text style={styles.detailsText}>
                {desc}
            </Text>
        </View>
      </View>
      <BidModal id={id} budget={budget} visible={isModalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
};

export default ProjectDetails;

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
  backArrow: {
    width: wp(8),
    height: hp(8),
  },
  projectSection: {
    marginVertical: hp(2),
    marginHorizontal: wp(5),
  },
  projectTitle: {
    flexDirection: 'column',
  },

  title: {
    fontWeight: '600',
    fontSize: FSize.fs20,
    color: Colors.black,
  },

  projectPosted: {
    marginVertical: hp(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  posted: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postedText: {
    color: Colors.sooprsblue,
    fontSize: FSize.fs12,
    fontWeight: '500',
  },
  postedDate: {
    color: Colors.black,
    fontSize: FSize.fs12,
    fontWeight: '500',
  },
  contactIcon: {
    width: wp(3),
    height: hp(3),
  },

  catbtn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.sooprsblue,
    borderRadius: wp(5),
    backgroundColor: Colors.sooprsblue,
    paddingVertical: hp(1),
    width: wp(50),
  },

  descbtn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(5),
    backgroundColor: Colors.black,
    paddingVertical: hp(1.5),
    width: wp(45),
  },

  bidbtn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.sooprsblue,
    borderRadius: wp(5),
    backgroundColor: Colors.sooprsblue,
    paddingVertical: hp(1.5),
  },

  buttonContainer: {
    marginTop: hp(1),
    marginRight: wp(2), // Add spacing between the buttons
  },

  btnText: {
    color: Colors.white,
    fontWeight: '500',
    fontSize: FSize.fs13,
  },

  skillSection: {
    flexDirection: 'column',
    marginVertical: hp(2),
    marginHorizontal: wp(5),
  },

  skillText: {
    color: Colors.sooprsblue,
    fontSize: FSize.fs20,
    fontWeight: '500',
  },

  descText: {
    color: Colors.white,
    fontSize: FSize.fs14,
    fontWeight: '500',
  },

  descDetails:{
    marginVertical:hp(3)
  },

  detailsText:{
    color:Colors.black,
    fontWeight:'400',
    fontSize:FSize.fs14
  }
});
