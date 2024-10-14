import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Colors from '../assets/commonCSS/Colors';
import FSize from '../assets/commonCSS/FSize';
import Images from '../assets/image';
import React, {useEffect, useState} from 'react';
import BidModal from './BidModal';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const ProjectDetails = ({navigation, route}: {navigation: any; route: any}) => {
  const {id, name, desc, category, budget, createdAt} = route.params;
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'clientDetails'>(
    'description',
  );
  const [bids, setBids] = useState([]); // Store bids data
  const [loading, setLoading] = useState(true); // Handle loading state
  const [uid, setUid] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const isFocused = useIsFocused();

  const fetchBids = async () => {
    const formData = new FormData();
    formData.append('id', id);
    try {
      const response = await fetch(
        'https://sooprs.com/api2/public/index.php/lead-details',
        {
          method: 'POST',
          body: formData,
        },
      );
      const result = await response.json();
      if (result.msg?.bids) {
        const uniqueBids = removeDuplicateBids(result.msg.bids);
        setBids(uniqueBids); // Store bids in state
          // Ensure uid is fetched before checking for button state
      if (uid) {
        const isDisabled = uniqueBids.some((bid) => bid.professional_id === uid);
        setIsButtonDisabled(isDisabled); 
      } 
      }
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  useEffect(() => {

    const fetchUid = async () => {
      let storedUid = await AsyncStorage.getItem('uid');
      if (storedUid) {
        storedUid = storedUid.replace(/^"|"$/g, '');
        setUid(storedUid); // Store uid in state
      }
    };

    fetchUid().then(fetchBids);
  }, [isFocused, uid]);

  useEffect(()=>{

    console.log('button disabled ::::::::', isButtonDisabled);

  }, [isButtonDisabled])

  const removeDuplicateBids = bids => {
    const bidMap = new Map(); // Use Map to ensure uniqueness by professional_id
    bids.forEach(bid => bidMap.set(bid.professional_id, bid));
    return Array.from(bidMap.values()); // Convert back to array
  };

  const renderBidCard = ({item}: {item: any}) => (
    <View style={styles.bidCard}>
      <Image source={{uri: item.proImage}} style={styles.profileImage} />
      <View style={styles.bidContent}>
        <Text style={styles.bidderName}>{item.pro}</Text>
        <Text style={styles.bidDescription}>{item.description}</Text>
        <Text style={styles.createdAt}>{item.created_at}</Text>
      </View>
      <Text style={styles.bidAmount}>${item.amount}</Text>
    </View>
  );

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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
          </View>
          <View>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: Colors.sooprsblue,
                borderRadius: wp(5),
                backgroundColor:  isButtonDisabled ? Colors.gray : Colors.sooprsblue,
                paddingVertical: hp(1.5),
                
              }} disabled={isButtonDisabled}>
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
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'description' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('description')}>
            <Text style={styles.tabText}>Description</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'clientDetails' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('clientDetails')}>
            <Text style={styles.tabText}>Client Details</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {activeTab === 'description' ? (
            <View style={styles.projectSection}>
              <Text style={styles.detailsText}>{desc}</Text>
            </View>
          ) : (
            <View style={styles.projectSection}>
              <View style={styles.indiSection}>
                <View style={styles.leftPart}>
                  <Image source={Images.nationalityIcon} style={styles.Icon} />
                  <Text style={styles.sectionText}>Nationality</Text>
                </View>
                <View style={styles.rightPart}>
                  <Text style={styles.sectionText}>Indian</Text>
                </View>
              </View>
              <View style={styles.indiSection}>
                <View style={styles.leftPart}>
                  <Image source={Images.identityIcon} style={styles.Icon} />
                  <Text style={styles.sectionText}>Identity Verified</Text>
                </View>
                <View style={styles.rightPart}>
                  <Image source={Images.tickIcon} style={styles.newIcon} />
                </View>
              </View>
              <View style={styles.indiSection}>
                <View style={styles.leftPart}>
                  <Image source={Images.emailIcon} style={styles.Icon} />
                  <Text style={styles.sectionText}>Email Verified</Text>
                </View>
                <View style={styles.rightPart}>
                  <Image source={Images.tickIcon} style={styles.newIcon} />
                </View>
              </View>
              <View style={styles.indiSection}>
                <View style={styles.leftPart}>
                  <Image source={Images.phoneIcon} style={styles.Icon} />
                  <Text style={styles.sectionText}>Mobile Verified</Text>
                </View>
                <View style={styles.rightPart}>
                  <Image source={Images.tickIcon} style={styles.newIcon} />
                </View>
              </View>
              <View style={styles.proposals}>
                <Text style={styles.proposalText}>Proposals</Text>
                {loading ? (
                  <ActivityIndicator size="large" color={Colors.sooprsblue} />
                ) : (
                  <FlatList
                    data={bids}
                    renderItem={renderBidCard}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.flatListContainer}
                  />
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </ScrollView>
      <BidModal
        id={id}
        budget={budget}
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
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
  scrollContainer: {
    paddingBottom: hp(5), // Add extra space at the bottom for better scrolling
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

  buttonContainer: {
    marginTop: hp(1),
    marginRight: wp(2),
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
  descDetails: {
    marginVertical: hp(3),
  },
  detailsText: {
    color: Colors.black,
    fontWeight: '400',
    fontSize: FSize.fs14,
  },

  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: hp(2),
  },
  tabButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    backgroundColor: Colors.black,
    borderRadius: wp(5),
    marginHorizontal: wp(2),
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.sooprsblue,
  },
  tabText: {
    color: Colors.white,
    fontWeight: '500',
    fontSize: FSize.fs14,
  },

  indiSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp(1),
  },

  leftPart: {
    flexDirection: 'row',
    gap: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },

  Icon: {
    width: wp(5),
    height: hp(2),
  },
  rightPart: {},

  sectionText: {
    color: Colors.black,
    fontSize: FSize.fs16,
    fontWeight: '500',
  },

  newIcon: {
    width: wp(5),
    height: hp(2.5),
  },

  proposals: {
    marginTop: hp(2),
  },

  proposalText: {
    fontWeight: '600',
    fontSize: FSize.fs20,
    color: Colors.black,
  },

  flatListContainer: {paddingBottom: hp(5)},
  bidCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    marginVertical: hp(2),
    marginHorizontal: wp(1),
    padding: wp(4),
    elevation: 2,
  },
  profileImage: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    marginRight: wp(4),
  },
  bidContent: {flex: 1},
  bidderName: {fontWeight: '600', fontSize: FSize.fs16, color: Colors.black},
  bidDescription: {
    color: Colors.black,
    fontSize: FSize.fs14,
    marginVertical: hp(0.5),
  },
  orderId: {color: Colors.sooprsblue, fontSize: FSize.fs12},
  createdAt: {color: Colors.gray, fontSize: FSize.fs12},
  bidAmount: {
    color: Colors.sooprsblue,
    fontWeight: '600',
    fontSize: FSize.fs16,
  },
});
