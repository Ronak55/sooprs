import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Colors from '../assets/commonCSS/Colors';
import {wp, hp} from '../assets/commonCSS/GlobalCSS';
import FSize from '../assets/commonCSS/FSize';
import Images from '../assets/image';

const ProjectCard = ({
    navigation,
    name,
    desc,
    category,
    budget,
    bids,
    index,
    createdAt,
  }: {
    navigation: any;
    name: any;
    desc: any;
    budget: any;
    category: any;
    bids: any;
    index: any;
    createdAt: any;
  }) => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.column}>
          {/* Header section showing project name and favorite icon */}
          <View style={styles.header}>
            <Text style={styles.nameText}>{name}</Text>
            <TouchableOpacity onPress={() => {}}>
              <Image source={Images.favoriteIcon} style={styles.favoriteIcon} />
            </TouchableOpacity>
          </View>
          
          {/* Date section */}
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{createdAt}</Text>
          </View>
          
          {/* Skills and description section */}
          <View style={styles.skillsContainer}>
            <Text style={styles.skillsText}>Service</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
            <Text style={styles.descText}>{desc}</Text>
          </View>
          
          {/* Footer section showing budget and bids */}
          <View style={styles.footer}>
            <View style={styles.budgetContainer}>
              <Text style={styles.budgetLabel}>Budget: </Text>
              <Text style={styles.budgetValue}>{budget}</Text>
            </View>
            <View style={styles.bidsContainer}>
              <Text style={styles.bidsLabel}>Bids: </Text>
              <Text style={styles.bidsValue}>{bids}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  

export default ProjectCard;

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: wp(3),
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    marginVertical: hp(2),
  },
  column: {
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameText: {
    color: Colors.black,
    fontSize: FSize.fs16,
    fontWeight: '500',
  },
  favoriteIcon: {
    width: wp(5),
    height: hp(2),
    marginTop: hp(0.75),
  },
  dateContainer: {
    marginTop: hp(1),
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: Colors.gray,
    fontSize: FSize.fs12,
    fontWeight: '500',
  },
  skillsContainer: {
    flexDirection: 'column',
    gap: hp(1),
    marginTop: hp(2),
  },
  skillsText: {
    color: Colors.sooprsblue,
    fontWeight: '600',
    fontSize: FSize.fs13,
  },
  categoryBadge: {
    borderColor: Colors.sooprsblue,
    borderRadius: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.sooprsblue,
    paddingHorizontal: wp(2),
    paddingVertical: wp(2),
    width: wp(30),
  },
  categoryText: {
    color: Colors.white,
    fontWeight: '500',
    fontSize: FSize.fs12,
  },
  descText: {
    marginTop: hp(1),
    color: Colors.black,
    fontWeight: '500',
    fontSize: FSize.fs12,
  },
  footer: {
    marginTop: hp(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  budgetLabel: {
    color: Colors.sooprsblue,
    fontSize: FSize.fs13,
  },
  budgetValue: {
    color: Colors.black,
    fontSize: FSize.fs12,
  },
  bidsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bidsLabel: {
    color: Colors.sooprsblue,
    fontSize: FSize.fs13,
  },
  bidsValue: {
    color: Colors.black,
    fontSize: FSize.fs12,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingLeft: wp(3),
  },
  contactIcon: {
    width: wp(2),
    height: hp(2),
  },
  contactText: {
    fontWeight: '500',
    fontSize: FSize.fs12,
    color: Colors.black,
    paddingLeft: wp(1),
  },
});
