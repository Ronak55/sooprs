import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Modal,
} from 'react-native';
import Colors from '../assets/commonCSS/Colors';
import FSize from '../assets/commonCSS/FSize';
import Images from '../assets/image';
import React, {useEffect, useState} from 'react';
import BidModal from './BidModal';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import ButtonNew from './ButtonNew';
import {mobile_siteConfig} from '../services/mobile-siteConfig';
import CryptoJS from 'crypto-js';
import Toast from 'react-native-toast-message';

const encryptionKey = 'Aniket@#@Sooprs#@#123';

const ProjectDetails = ({navigation, route}: {navigation: any; route: any}) => {
  const {
    id,
    name,
    desc,
    category,
    budget,
    createdAt,
    Customer_name,
    customer_id,
    bidId,
    project_status,
  } = route.params;
  const [isModalVisible, setModalVisible] = useState(false);
  const [isContactModalVisible, setContactModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'clientDetails'>(
    'description',
  );
  const [bids, setBids] = useState([]); // Store bids data
  const [loading, setLoading] = useState(true); // Handle loading state
  const [uid, setUid] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [bidDone, setbidDone] = useState(false);
  const [mobile, setMobile] = useState('+91 92******33');
  const [btnvisible, setbtnVisible] = useState(true);
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
          const isDisabled = uniqueBids.some(
            bid => bid.professional_id === uid,
          );
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

    console.log('project status::::::::::::::', project_status);
  }, [isFocused, uid, isModalVisible]);

  useEffect(() => {
    console.log('button disabled ::::::::', isButtonDisabled);
  }, [isButtonDisabled]);

  const removeDuplicateBids = bids => {
    const bidMap = new Map(); // Use Map to ensure uniqueness by professional_id
    bids.forEach(bid => bidMap.set(bid.professional_id, bid));
    return Array.from(bidMap.values()); // Convert back to array
  };

  const ContactModal = ({
    visible,
    onClose,
    mobile,
    setMobile,
    btnVisible,
    setbtnVisible,
  }) => {
    const [loading, setLoading] = useState(false); // Track loading state

    const getContactDetails = async () => {
      if (loading) return; // Prevent multiple clicks while loading
      setLoading(true); // Start loading spinner

      try {
        // Retrieve the token from AsyncStorage
        let token = await AsyncStorage.getItem(mobile_siteConfig.TOKEN);
        let new_token = JSON.parse(token);

        console.log('tokenn:::::::::::', new_token);
        // Prepare form data
        const formData = new FormData();
        formData.append('id', id); // Ensure `id` is defined appropriately

        // Make the API call
        const response = await fetch(
          'https://sooprs.com/api2/public/index.php/show-lead-mobile',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${new_token}`, // Send token in the authorization header
            },
            body: formData,
          },
        );

        // Parse the response
        const result = await response.json();
        console.log('Contact details response::::', result);

        if (result.status === 200) {
          // Decrypt the mobile number received from the API
          setMobile(result.encrypted_mobile_number);
          setbtnVisible(false); // Hide the button after successful fetch
        }
      } catch (error) {
        console.error('Error fetching contact details:', error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Cross Icon */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Image source={Images.crossIcon} style={styles.closeIcon} />
            </TouchableOpacity>

            {/* Modal Title */}
            <Text style={styles.modalTitle}>Contact Details</Text>

            {/* Contact Info */}
            <View style={styles.contactInfo}>
              <Text style={styles.contactText}>Phone: {mobile}</Text>
            </View>

            {/* Credit Cost Info */}
            <View style={styles.creditCostInfo}>
              <Text style={styles.creditCostText}>Credit Cost: 50</Text>
            </View>

            {/* Button */}
            <ButtonNew
              imgSource={undefined}
              btntext={
                loading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  'Get Contact'
                )
              }
              bgColor={!btnVisible ? Colors.gray : Colors.sooprsblue}
              textColor={Colors.white}
              onPress={getContactDetails}
              isDisabled={!btnVisible || loading} // Disable button while loading
            />
          </View>
        </View>
      </Modal>
    );
  };

  const handleContactPress = () => {
    if (!isButtonDisabled) {
      Toast.show({
        type: 'error', // Type of the toast (could also be 'success', 'info', etc.)
        text1: 'Error', // Main message
        text2: 'Please place your bid first', // Secondary message
        position: 'top', // Position of the toast
        visibilityTime: 3000, // Duration for which the toast will be visible
      });
    } else {
      setContactModalVisible(true); // Show the modal if the button is not disabled
    }
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
        <View style={styles.headerParts}>
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
        <View style={styles.rightPart}>
          {!isButtonDisabled ? (
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: Colors.sooprsblue,
                borderRadius: wp(5),
                backgroundColor: isButtonDisabled
                  ? Colors.gray
                  : Colors.sooprsblue,
                paddingVertical: hp(1.5),
                paddingHorizontal: wp(6),
              }}
              disabled={isButtonDisabled}>
              <Text style={styles.bidbtnText}>Bid</Text>
            </TouchableOpacity>
          ) : (
            <Text
              style={{
                color: '#40C700',
                fontSize: FSize.fs18,
                fontWeight: '500',
              }}>
              Bid Placed!
            </Text>
          )}
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.projectSection}>
          <View style={styles.projectTitle}>
            <Text style={styles.title}>{name}</Text>
          </View>
          <View style={styles.projectPosted}>
            {/* <View style={styles.posted}>
              <Text style={styles.postedText}>Posted:</Text>
              <Text style={styles.postedDate}> {createdAt}</Text>
            </View> */}
             <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              {project_status && (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('IndividualChat', {
                      name: Customer_name,
                      userId: uid,
                      leadId: id,
                      bidId: bidId,
                      recieverId: customer_id,
                      id: id,
                    });
                  }}>
                  <Image source={Images.chatIcon} style={styles.chat} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.posted}>
              <Text style={styles.postedText}>Budget:</Text>
              <Text style={styles.postedDate}> ${budget}</Text>
            </View>
          </View>
          <View style={styles.contactSection}>
            <View style={styles.contactInfo}>
              <Image source={Images.phoneIcon} style={styles.contactIcon} />
              <Text style={styles.phoneText}>+91 92******33</Text>
            </View>
            <TouchableOpacity
              onPress={handleContactPress}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: hp(1.5),
                paddingHorizontal: wp(5),
                backgroundColor: isButtonDisabled ? '#72C250' : Colors.gray,
                borderRadius: wp(3),
              }}>
              <Text
                style={{
                  color: isButtonDisabled ? Colors.black : Colors.white,
                  fontSize: FSize.fs12,
                  fontWeight: '700',
                }}>
                Get Contact
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
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
            </TouchableOpacity> */}
          </View>
        </View>
        {/* <View style={styles.skillSection}>
          <Text style={styles.skillText}>Skills</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => {}} style={styles.catbtn}>
              <Text style={styles.btnText}>{category}</Text>
            </TouchableOpacity>
          </View>
        </View> */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'description'
                ? styles.activeTab
                : styles.inactiveTab,
            ]}
            onPress={() => setActiveTab('description')}>
            <Text style={activeTab === 'description' ? styles.activeTabText : styles.inactiveTabText}>
              Description
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'clientDetails'
                ? styles.activeTab
                : styles.inactiveTab,
            ]}
            onPress={() => setActiveTab('clientDetails')}>
            <Text style={activeTab === 'clientDetails' ? styles.activeTabText : styles.inactiveTabText}>
              Client Details
            </Text>
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
      {/* Contact Modal */}
      <ContactModal
        visible={isContactModalVisible}
        onClose={() => setContactModalVisible(false)}
        mobile={mobile}
        setMobile={setMobile}
        btnVisible={btnvisible}
        setbtnVisible={setbtnVisible}
      />
      <BidModal
        id={id}
        budget={budget}
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        setbidDone={setbidDone}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerParts: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },

  backArrow: {
    width: wp(8),
    height: hp(8),
  },
  scrollContainer: {
    paddingBottom: hp(5), // Add extra space at the bottom for better scrolling
  },
  projectSection: {
    marginVertical: hp(1),
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
    color: Colors.black,
    fontWeight: '500',
    fontSize: FSize.fs13,
  },

  bidbtnText: {
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

  
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: wp(10),
    marginHorizontal: wp(3),
    marginVertical: hp(1),
    padding: wp(2),
    gap: wp(2),
    
    // Shadow and elevation
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android
  },

  tabButton: {
    flex: 1,
    padding: hp(1.8),
    borderRadius: wp(6),
    alignItems: 'center',
  },

  activeTab: {
    backgroundColor:Colors.sooprsblue,
  },
  inactiveTab: {
    backgroundColor: '#F2F7FF',
  },
  activeTabText: {
    color: Colors.white,
    fontWeight: '600',
  },
  inactiveTabText: {
    color: '#111111',
    fontWeight: '600',
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

  chat: {
    width: wp(5),
    height: hp(2.5),
  },

  contactSection: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: wp(2),
    marginTop: hp(1),
  },

  contactInfo: {
    flexDirection: 'row',
    gap: wp(2),
    alignItems: 'center',
  },

  contactIcon: {
    width: wp(5),
    height: hp(3),
  },

  phoneText: {
    color: Colors.black,
    fontWeight: '700',
    fontSize: FSize.fs18,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: wp(80),
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 20,
    gap: hp(2),
    // alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    padding: 10,
    zIndex: 1,
  },
  closeIcon: {
    width: wp(4),
    height: hp(3),
    opacity: 0.8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.sooprsblue,
    marginBottom: 20,
  },
  contactDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    color: Colors.black,
  },
  creditCostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creditCostText: {
    fontSize: 16,
    color: Colors.sooprsblue,
  },
});
