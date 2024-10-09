import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Colors from '../assets/commonCSS/Colors';
import {wp, hp} from '../assets/commonCSS/GlobalCSS';
import FSize from '../assets/commonCSS/FSize';
import Images from '../assets/image';

const ProjectCard = ({
  navigation,
  name,
  id,
  desc,
  category,
  budget,
  bids,
  index,
  createdAt,
  isProfessional,
  bidId,
}: {
  navigation: any;
  name: any;
  id: any;
  desc: any;
  budget: any;
  category: any;
  bids: any;
  index: any;
  createdAt: any;
  isProfessional: any;
  bidId: any;
}) => {
  const [isExpanded, setIsExpanded] = useState(false); // State to track if card is expanded

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  // Function to show limited text when the card is collapsed
  const getLimitedDescription = (description: string) => {
    const limit = 150; // Set character limit
    return description.length > limit
      ? `${description.substring(0, limit)}...`
      : description;
  };

  return (
    <TouchableOpacity
      onPress={() => {
        isProfessional
          ? navigation.navigate('ProjectDetails', {
              id,
              name,
              desc,
              category,
              budget,
              createdAt,
            })
          : navigation.navigate('ProjectBids', {id: id});
      }}>
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
          
          {createdAt && (
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{createdAt}</Text>
            </View>
          )}

          {/* Skills and description section */}
          <View style={styles.skillsContainer}>
            <Text style={styles.skillsText}>Service</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>

            {/* Show limited or full description based on the isExpanded state */}
            <Text style={styles.descText}>
              {isExpanded ? desc : getLimitedDescription(desc)}
            </Text>

            {/* Read More / Read Less Button */}
            <TouchableOpacity onPress={toggleReadMore}>
              <Text style={styles.readMoreText}>
                {isExpanded ? 'Read Less' : 'Read More'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer section showing budget and bids */}
          <View style={styles.footer}>
            <View style={styles.budgetContainer}>
              <Text style={styles.budgetLabel}>Budget: </Text>
              <Text style={styles.budgetValue}>{budget}</Text>
            </View>
            <View style={styles.bidsContainer}>
              <Text style={styles.bidsLabel}>
                {' '}
                {bidId ? 'Bid ID:' : 'Bids:'}
              </Text>
              <Text style={styles.bidsValue}>{bidId || bids}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
    alignItems: 'flex-start', // Align items to the top to allow wrapping
    paddingVertical: hp(1), // Optional: Adds vertical padding to the header
  },
  nameText: {
    color: Colors.black,
    fontSize: FSize.fs16,
    fontWeight: '500',
    maxWidth: '90%',
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
    width: wp(45),
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
  readMoreText: {
    marginTop: hp(1),
    color: Colors.sooprsblue,
    fontWeight: '600',
    fontSize: FSize.fs13,
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
});
