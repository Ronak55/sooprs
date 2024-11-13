import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import Colors from '../assets/commonCSS/Colors';
import {wp, hp} from '../assets/commonCSS/GlobalCSS';
import FSize from '../assets/commonCSS/FSize';
import Images from '../assets/image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const {width} = Dimensions.get('window');

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
  isAssigned,
  isProfessional,
  bidId,
  Customer_name,
  Customer_image,
  customer_id,
  project_status,
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
  isAssigned: any;
  isProfessional: any;
  bidId: any;
  Customer_name: any;
  Customer_image:any,
  customer_id: any;
  project_status: any;
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

  // Navigate based on isAssigned value
  const handlePress = async () => {
    let uid = await AsyncStorage.getItem('uid');
    // If lead_id has extra quotes, remove them
    if (uid) {
      uid = uid.replace(/^"|"$/g, ''); // Removes leading and trailing quotes if present
    }
    console.log('isAssigned value:::::::', isAssigned);

    if (isAssigned) {
      navigation.navigate('IndividualChat', {
        name: Customer_name,
        cust_image: Customer_image,
        userId: uid,
        leadId: id,
        bidId: bidId,
        recieverId: customer_id,
        id: id,
        project_status: project_status,
      });
    } else {
      if (isProfessional) {
        navigation.navigate('ProjectDetails', {
          id,
          name,
          desc,
          category,
          budget,
          createdAt,
          cust_image: Customer_image,
          Customer_name,
          customer_id,
          bidId,
        });
      } else {
        navigation.navigate('ProjectBids', {id});
      }
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.cardContainer}>
        <View style={styles.column}>
          {/* Header section showing project name and favorite icon */}
          <View style={styles.header}>
            <Text style={styles.nameText}>{name}</Text>
            {/* <TouchableOpacity onPress={() => {}}>
              <Image source={Images.favoriteIcon} style={styles.favoriteIcon} />
            </TouchableOpacity> */}
          </View>

          {/* Skills and description section */}
          <View style={styles.skillsContainer}>
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
            {/* Date section */}
            {createdAt && (
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>
                 {createdAt}
                </Text>
              </View>
            )}
            <View style={styles.budgetContainer}>
              <Text style={styles.budgetLabel}>Budget: </Text>
              <Text style={styles.budgetValue}>{budget}</Text>
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
    paddingHorizontal: wp(4),
    marginVertical: hp(0.5),
    marginHorizontal:hp(0.3),
  },
  column: {
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom:hp(1),
    paddingVertical:hp(1),
    paddingHorizontal: wp(2), // Adjust padding as needed
  },
  nameText: {
    color: Colors.black,
    fontSize: FSize.fs18,
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
    // marginTop: hp(1),
  },
  skillsText: {
    color: Colors.sooprsblue,
    fontWeight: '600',
    fontSize: FSize.fs13,
  },
  categoryBadge: {
    borderColor: '#F8F8F8',
    borderRadius: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F7FF',
    paddingHorizontal: wp(1),
    paddingVertical: wp(2),
    width: wp(40),
  },
  categoryText: {
    color: '#444444',
    fontWeight: '500',
    fontSize: FSize.fs10,
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
    marginTop: hp(0.5),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
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
    alignItems: 'center',
    gap: wp(1),
  },
  bidsLabel: {
    color: Colors.gray,
    fontSize: FSize.fs13,
  },
  bidsValue: {
    color: Colors.black,
    fontSize: FSize.fs12,
  },
});
