import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {hp, wp} from '../../assets/commonCSS/GlobalCSS';
import Colors from '../../assets/commonCSS/Colors';
import FSize from '../../assets/commonCSS/FSize';
import Images from '../../assets/image'; // Your image assets
import {useIsFocused} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProjectBids = ({navigation, route}: {navigation: any; route: any}) => {
  // const navigation = useNavigation();
  const {id} = route.params;
  const [bids, setBids] = useState([]);
  const [rewardedBids, setRewardedBids] = useState([]);
  const isFocused = useIsFocused();
  const [userId, setuserId] = useState(null);
  const [recieverId, setrecieverId] = useState(null);
  const [leadId, setleadId] = useState(null);

  const [bidId, setbidId] = useState(null);

  const getBids = async () => {
    let lead_id = await AsyncStorage.getItem('uid');
    // If lead_id has extra quotes, remove them
    if (lead_id) {
      lead_id = lead_id.replace(/^"|"$/g, ''); // Removes leading and trailing quotes if present
    }

    setuserId(lead_id);
    setleadId(id);
    console.log('..............', id);
    const formdata = new FormData();
    formdata.append('lead_id', id);

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formdata,
    };

    fetch(
      'https://sooprs.com/api2/public/index.php/query_detail',
      requestOptions,
    )
      .then(response => response.json())
      .then(res => {
        if (res.status === 200) {
          console.log('bids details:::::::', res.msg);
          setBids(res.msg); // Set the bids from API response
        }
      })
      .catch(error => {
        console.error('Error fetching bids:', error);
      });
  };

  const handleReward = (id: any) => {
    const formdata = new FormData();
    formdata.append('lead_id', id);

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formdata,
    };

    fetch(
      'https://sooprs.com/api2/public/index.php/reward_project',
      requestOptions,
    )
      .then(response => response.json())
      .then(res => {
        if (res.status === 200) {
          setRewardedBids([...rewardedBids, id]);
          console.log('response bid reward::::::::::', res);
          Toast.show({
            type: 'success',
            text1: 'Bid rewarded',
            text2: 'You have successfully rewarded the bid!',
            position: 'top',
            text1Style: {fontSize: 16, fontWeight: '600'},
            text2Style: {fontSize: 14, color: '#666'},
          });
        }
      })
      .catch(error => {
        console.error('Error fetching bids:', error);
      });
  };

  useEffect(() => {
    console.log('id project::::::::', route.params);
    getBids();
  }, [id]);

  // Render each bid as a card
  const renderBidCard = ({item}) => {
    const [showFullDescription, setShowFullDescription] = useState(false); // Local state for toggling description
  
    const toggleDescription = () => {
      setShowFullDescription(!showFullDescription);
    };
  
    const truncatedDescription = item.cutDesc.length > 100
      ? `${item.cutDesc.substring(0, 100)}...` // Limit description to 100 characters
      : item.cutDesc;
  
    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.proName}>{item.professional_name}</Text>
          <Text style={styles.amountText}>${item.amount}</Text>
        </View>
        <Text style={styles.descriptionText}>
          {showFullDescription ? item.cutDesc : truncatedDescription}
        </Text>
        {item.cutDesc.length > 100 && (
          <TouchableOpacity onPress={toggleDescription}>
            <Text style={styles.toggleText}>
              {showFullDescription ? 'Read Less' : 'Read More'}
            </Text>
          </TouchableOpacity>
        )}
        <Text style={styles.dateText}>{item.createdDate}</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('IndividualChat', {
                name: item.professional_name,
                userId: userId,
                leadId: leadId,
                bidId: item.id,
                recieverId: item.prof_id,
                id: id,
              });
            }}>
            <Image source={Images.chatIcon} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: rewardedBids.includes(item.id)
                ? 'green'
                : Colors.sooprsblue, // Conditionally change color
              paddingVertical: hp(1),
              paddingHorizontal: wp(4),
              borderRadius: wp(2),
            }}
            onPress={() => handleReward(item.id)} // Pass the bid id
            disabled={rewardedBids.includes(item.id)} // Disable the button if it's already rewarded
          >
            <Text style={styles.rewardText}>
              {rewardedBids.includes(item.id) ? 'Rewarded' : 'Reward'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  

  return (
    <View style={styles.section}>
      <View style={styles.headerSection}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={Images.backArrow}
            resizeMode="contain"
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Project Bids</Text>
      </View>

      {bids.length === 0 ? ( // Check if there are no bids
        <View style={styles.noBidsContainer}>
          <Text style={styles.noBidsText}>No bids found!</Text>
        </View>
      ) : (
        <FlatList
          data={bids}
          renderItem={renderBidCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

export default ProjectBids;

const styles = StyleSheet.create({
  section: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerSection: {
    marginHorizontal: wp(5),
    marginVertical: hp(1),
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    width: wp(8),
    height: hp(8),
    marginRight: wp(1),
  },
  headerTitle: {
    color: Colors.black,
    fontWeight: '500',
    fontSize: FSize.fs16,
  },
  listContainer: {
    paddingHorizontal: wp(5),
  },
  cardContainer: {
    backgroundColor: Colors.white,
    padding: wp(4),
    borderRadius: wp(2),
    marginBottom: hp(2),
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  proName: {
    fontSize: FSize.fs16,
    fontWeight: 'bold',
    color: Colors.black,
  },
  amountText: {
    fontSize: FSize.fs14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  descriptionText: {
    fontSize: FSize.fs14,
    color: Colors.gray,
    marginBottom: hp(1),
  },
  dateText: {
    fontSize: FSize.fs12,
    color: Colors.gray,
    marginBottom: hp(1),
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    width: wp(6),
    height: wp(6),
  },
  rewardText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  noBidsContainer: {
    flex: 1,
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
  },
  noBidsText: {
    fontSize: FSize.fs16, // Medium size text
    color: Colors.gray, // Color for the text
  },

  toggleText: {
    color: Colors.primary, // Use your preferred color
    fontSize: FSize.fs14, // Adjust font size as needed
    fontWeight: 'bold',
    marginTop: hp(0.5),
  },
  
});
