import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TextInput,
  Alert,
  Linking,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import Colors from '../assets/commonCSS/Colors';
import FSize from '../assets/commonCSS/FSize';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import Images from '../assets/image';
import {useIsFocused} from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {getDataFromAsyncStorage} from '../services/CommonFunction';
import {mobile_siteConfig} from '../services/mobile-siteConfig';
import CInput from './CInput';
import DatePicker from 'react-native-date-picker';
import ButtonNew from './ButtonNew';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import RazorpayCheckout from 'react-native-razorpay';

const {width, height} = Dimensions.get('window');

const steps = [
  'Project Placed',
  'Requirements',
  'Milestones',
  'Project Accepted',
];

const MilestoneInput = ({
  milestoneNumber,
  milestoneName,
  setMilestoneName,
  dueDate,
  setDueDate,
  amount,
  setAmount,
  isDatePickerVisible,
  setIsDatePickerVisible,
  onDelete, // Function to handle deletion
}) => {
  return (
    <View style={styles.newinputContainer}>
      <View style={styles.row}>
        <Text style={styles.label}>{milestoneNumber} Milestone</Text>
        <TouchableOpacity onPress={onDelete}>
          <Image
            source={Images.crossIcon} // Update with your icon path
            style={styles.crossIcon}
          />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.inputStyle}
        value={milestoneName}
        onChangeText={setMilestoneName}
        placeholder="Enter Milestone Name"
        placeholderTextColor={Colors.gray}
      />
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.datePickerContainer}
          onPress={() => setIsDatePickerVisible(true)}>
          <Text style={styles.labelText}>Due Date</Text>
          <View style={styles.dateInput}>
            <Text style={styles.dateText}>{dueDate.toLocaleDateString()}</Text>
          </View>
        </TouchableOpacity>

        <DatePicker
          modal
          open={isDatePickerVisible}
          date={dueDate}
          mode="date"
          onConfirm={date => {
            setIsDatePickerVisible(false);
            setDueDate(date);
          }}
          onCancel={() => setIsDatePickerVisible(false)}
        />

        <View style={styles.newinputContainer}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={[styles.inputStyle, {flex: 1}]}
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter Amount"
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );
};

const MilestoneModal = ({
  isVisible,
  onClose,
  milestoneNumber,
  id,
  milestoneNames,
  setmilestoneNames,
}) => {
  // State to hold multiple milestones
  const [milestones, setMilestones] = useState([]);

  // Temporary states to hold current inputs for the latest milestone
  const [milestoneName, setMilestoneName] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [amount, setAmount] = useState('');
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  // Function to handle adding a milestone
  const handleAddMilestone = () => {
    const newMilestone = {milestoneName, dueDate, amount};
    setMilestones([...milestones, newMilestone]);

    // Reset input fields
    setMilestoneName('');
    setDueDate(new Date());
    setAmount('');
  };

  const handleDeleteMilestone = index => {
    const updatedMilestones = milestones.filter((_, i) => i !== index);
    setMilestones(updatedMilestones);
  };

  const handleSaveMilestone = async () => {
    const formData = new FormData();

    // Get user_id from AsyncStorage
    let user_id = await AsyncStorage.getItem('uid');
    if (user_id) {
      user_id = user_id.replace(/^"|"$/g, ''); // Remove extra quotes if any
    }

    milestones.forEach(milestone => {
      formData.append('milestone_name', milestone.milestoneName);
      formData.append('amount', milestone.amount);
      formData.append('deadline', milestone.dueDate.toISOString()); // Convert to ISO string
      formData.append('remark', ''); // Empty string as per requirement
      formData.append('user_id', user_id);
      formData.append('leadid', id);
    });

    console.log('formdata inputs::::::', formData);

    try {
      const response = await fetch(
        'https://sooprs.com/api2/public/index.php/add_milestone',
        {
          method: 'POST',
          body: formData,
        },
      );

      const res = await response.json();
      if (res.status === 200) {
        // Show success message
        console.log('response after added milestone:::::', res);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res.msg,
        });

        // setmilestoneNames(milestones.map(m => m.milestoneName));
        // Reset milestones after successful save
        setMilestones([]);
        onClose();
      } else {
        // Show error message if status is not 200
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.msg,
        });
      }
    } catch (error) {
      console.error('Error adding milestones:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to add milestones. Please try again.',
      });
    }

    // Reset input fields
    setMilestoneName('');
    setDueDate(new Date());
    setAmount('');
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} onPress={() => {}}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Add Milestones</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✖️</Text>
            </TouchableOpacity>
          </View>

          {/* ScrollView to display multiple milestones */}
          <ScrollView>
            {milestones.map((milestone, index) => (
              <MilestoneInput
                key={index}
                milestoneNumber={index + 1}
                milestoneName={milestone.milestoneName}
                dueDate={milestone.dueDate}
                amount={milestone.amount}
                setMilestoneName={name => {
                  const updatedMilestones = [...milestones];
                  updatedMilestones[index].milestoneName = name;
                  setMilestones(updatedMilestones);
                }}
                setDueDate={date => {
                  const updatedMilestones = [...milestones];
                  updatedMilestones[index].dueDate = date;
                  setMilestones(updatedMilestones);
                }}
                setAmount={amt => {
                  const updatedMilestones = [...milestones];
                  updatedMilestones[index].amount = amt;
                  setMilestones(updatedMilestones);
                }}
                isDatePickerVisible={isDatePickerVisible}
                setIsDatePickerVisible={setIsDatePickerVisible}
                onDelete={() => handleDeleteMilestone(index)} // Pass delete function
              />
            ))}

            {/* Render a new MilestoneInput for the upcoming milestone */}
            <MilestoneInput
              milestoneNumber={milestones.length + 1}
              milestoneName={milestoneName}
              dueDate={dueDate}
              amount={amount}
              setMilestoneName={name => {
                const updatedMilestones = [...milestones];
                updatedMilestones[index].milestoneName = name;
                setMilestones(updatedMilestones);
              }}
              setDueDate={date => {
                const updatedMilestones = [...milestones];
                updatedMilestones[index].dueDate = date;
                setMilestones(updatedMilestones);
              }}
              setAmount={amt => {
                const updatedMilestones = [...milestones];
                updatedMilestones[index].amount = amt;
                setMilestones(updatedMilestones);
              }}
              isDatePickerVisible={isDatePickerVisible}
              setIsDatePickerVisible={setIsDatePickerVisible}
            />
          </ScrollView>

          {/* Add Milestone Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddMilestone}>
            <Text style={styles.addButtonText}>Add Milestone</Text>
          </TouchableOpacity>
          <View style={styles.saveButton}>
            <ButtonNew
              imgSource={undefined}
              btntext={'Save'}
              bgColor={Colors.sooprsblue}
              textColor={Colors.white}
              onPress={handleSaveMilestone}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const ProjectStatus = ({navigation, route}: {navigation: any; route: any}) => {
  const {id, recieverId} = route.params;
  const [activeStep, setActiveStep] = useState(0); // Track active step
  const [isClient, setisClient] = useState('');

  const [loading, setLoading] = useState(true); // Loader state
  const [description, setDescription] = useState(''); // Store description
  const [downloadFile, setDownloadFile] = useState('');

  const [file, setFile] = useState(null); // Store selected file
  const [milestoneCount, setMilestoneCount] = useState(1);
  const [currentMilestone, setCurrentMilestone] = useState(0);
  const [milestoneDetails, setmilestoneDetails] = useState([]);
  const [milestoneNames, setMilestoneNames] = useState([]);
  const [isMilestoneDetailsModalVisible, setMilestoneDetailsModalVisible] =
    useState(false);
  const [selectedMilestoneName, setSelectedMilestoneName] = useState('');
  const [selectedMilestoneDetails, setSelectedMilestoneDetails] = useState('');
  const [orderId, setOrderId] = useState('');

  const openMilestoneDetailsModal = (index, name) => {
    setSelectedMilestoneName(name);
    setSelectedMilestoneDetails(`Milestone ${index + 1}`);
    setMilestoneDetailsModalVisible(true);
  };

  const closeMilestoneDetailsModal = () => {
    setMilestoneDetailsModalVisible(false);
  };

  const [isMilestoneModalVisible, setMilestoneModalVisible] = useState(false);

  const openMilestoneModal = () => {
    setMilestoneModalVisible(true);
  };

  const closeMilestoneModal = () => {
    setMilestoneModalVisible(false);
  };

  const handleAcceptProject = async () => {
    let user_id = await AsyncStorage.getItem('uid');
    // If lead_id has extra quotes, remove them
    if (user_id) {
      user_id = user_id.replace(/^"|"$/g, ''); // Removes leading and trailing quotes if present
    }

    const formdata = new FormData();
    formdata.append('lead_id', id);
    formdata.append('cust_id', user_id);

    try {
      const response = await fetch(
        'https://sooprs.com/api2/public/index.php/update-lead-delivery',
        {
          method: 'POST',
          body: formdata,
        },
      );

      console.log('formdata for acceptance::', formdata);
      const res = await response.json();

      if (res.status === 200) {
        Alert.alert('Success', 'Project accepted successfully!');
      } else {
        Alert.alert('Failed', 'Project acceptance failed, please try again.');
      }
    } catch (error) {
      console.error('Error accepting project:', error);
    }
  };

  const isFocused = useIsFocused();

  const downloadFileHandler = async () => {
    if (downloadFile) {
      try {
        await Linking.openURL(downloadFile); // Opens the file URL in the browser
        setActiveStep(2);
        fetchMilestones();
      } catch (error) {
        Alert.alert('Error', 'Unable to open file.');
      }
    }
  };

  const fetchRewardStatus = async () => {
    const formdata = new FormData();
    formdata.append('lead_id', id);

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'multipart/form-data'},
      body: formdata,
    };

    try {
      const response = await fetch(
        'https://sooprs.com/api2/public/index.php/reward_project',
        requestOptions,
      );
      const res = await response.json();

      console.log('response reward:::::::::', res);

      if (res.msg === 'Already rewarded') {
        setActiveStep(1); // Set active step to "Requirements"
        if (!isClient) {
          getRequirements();
        }
      } else {
        setActiveStep(0); // Default to "Project Placed"
      }
    } catch (error) {
      console.error('Error fetching project status:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchRewardStatus();
  }, [isFocused, route?.params?.id]);

  useEffect(() => {
    const getStateInfo = async () => {
      const stateInfo = await getDataFromAsyncStorage(
        mobile_siteConfig.IS_BUYER,
      );
      console.log('state infoo new:::::', stateInfo);
      setisClient(stateInfo);
    };
    getStateInfo();
  }, [isFocused]);

  const getRequirements = async () => {
    console.log('get requirement called....');
    const formdata = new FormData();
    formdata.append('project_id', id);

    try {
      const response = await fetch(
        'https://sooprs.com/api2/public/index.php/get-project-requirements',
        {
          method: 'POST',
          body: formdata,
        },
      );
      const res = await response.json();
      console.log('fetched requirement response:::::', res);

      if (Array.isArray(res) && res.length > 0) {
        console.log('get req success !');
        setDownloadFile(res[0].file);
      } else {
        Alert.alert('Upload Failed', 'Please try again.');
      }
    } catch (error) {
      console.error('Error fetching requirements:', error);
    }
  };

  const fetchMilestones = async () => {
    const formdata = new FormData();
    formdata.append('lead_id', id);

    try {
      const response = await fetch(
        'https://sooprs.com/api2/public/index.php/get_final_milestones',
        {
          method: 'POST',
          body: formdata,
        },
      );
      const res = await response.json();

      console.log('Milestones response:', res);

      if (res.msg && Array.isArray(res.msg.milestones)) {
        const milestones = res.msg.milestones.map(
          milestone => milestone.milestone_name,
        );
        setMilestoneNames(milestones);
        setmilestoneDetails(res.msg.milestones);
      
      }
    } catch (error) {
      console.error('Error fetching milestones:', error);
    }
  };
  // Function to request permission
  const requestStoragePermission = async () => {
    try {
      const result = await request(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, // Modify for iOS if needed
      );
      if (result === RESULTS.GRANTED) {
        console.log('Storage permission granted');
        selectFile(); // Call file picker once permission is granted
      } else if (result === RESULTS.BLOCKED) {
        Alert.alert(
          'Permission Blocked',
          'Permission has been permanently denied. Please go to settings to enable it.',
          [
            {
              text: 'Go to Settings',
              onPress: () => Linking.openSettings(),
            },
            { text: 'Cancel', style: 'cancel' },
          ],
        );
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  // Function to handle file selection
  const selectFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      console.log('File selected:', result[0]);
      setFile(result[0]); // Save selected file
      uploadRequirements(result[0]); // Trigger API upload
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.error('Error selecting file:', err);
      }
    }
  };

  // Function to upload requirements
  const uploadRequirements = async selectedFile => {
    const formdata = new FormData();
    formdata.append('project_id', id);
    formdata.append('description', description);
    formdata.append('file', {
      uri: selectedFile.uri,
      type: selectedFile.type,
      name: selectedFile.name,
    });

    console.log('id project:::::::::', id);

    try {
      const response = await fetch(
        'https://sooprs.com/api2/public/index.php/add_requirements',
        {
          method: 'POST',
          headers: {'Content-Type': 'multipart/form-data'},
          body: formdata,
        },
      );
      const res = await response.json();
      console.log('Upload response:::::', res);

      if (res.status === 200) {
        setActiveStep(2); // Move to the next step (Milestones)
      } else {
        Alert.alert('Upload Failed', 'Please try again.');
      }
    } catch (error) {
      console.error('Error uploading requirements:', error);
    }
  };


  const MilestoneDetailsModal = ({ isVisible, onClose, milestoneDetails, setActiveStep }) => {
    // Assume milestoneDetails contains the milestone data as an array
    if (!milestoneDetails || milestoneDetails.length === 0) return null;
  
    // Extract details from the first milestone (for demonstration purposes)
    const { milestone_name, milestone_deadline_formatted, milestone_amount } = milestoneDetails[0];

    const handlePayment = async(amount)=>{

      const amountInUSD = parseFloat(amount);
      const conversionRate = 83.97; 
      const amountInINR = amountInUSD * conversionRate;
      const amountInPaise = amountInINR * 100; 
  
      // Initialize FormData
      const formdata = new FormData();
      formdata.append('amount', amountInPaise.toString());
  
      console.log('formdata:::::::::', formdata);
  
      try {
        const response = await fetch('https://sooprs.com/create_razr_order.php', {
          method: 'POST',
          body: formdata,
        });
  
        const res = await response.json();
  
        if(res.order_id){
  
          console.log('order id::::::::::', res.order_id);
          setOrderId(res.order_id); 
  
          const options = {
              key: 'rzp_test_eaw8FUWQWt0bHV',  // Replace with your Razorpay Key ID
              amount: amountInPaise,
              currency: 'INR',
              name: 'Gazetinc Technology LLP',
              description: 'Sooprs',
              order_id: res.order_id,
              image:'https://sooprs.com/assets/images/sooprs_logo.png',
              handler: (paymentResponse) => {
                // Handle successful payment here
                console.log('Payment Successful:::::', paymentResponse);
                setActiveStep(3);
              },
              prefill: {
                email: 'contact@sooprs.com',
                contact: '8474081159',
              },
              theme: {
                color: '#0077FF',
              },
            };
  
            RazorpayCheckout.open(options).then((data) => {
              console.log('Payment data::::', data);
              setActiveStep(3);
              
            }).catch((error) => {
              console.error('Razorpay error:', error);
            });
  
        }
      } catch (error) {
        console.error('Error creating order:', error);
      }

    }
    return (
      <Modal visible={isVisible} transparent animationType="slide">
        <View style={styles.modalMilestoneContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{milestone_name}</Text>
            <Text style={styles.modalText}>Deadline: {milestone_deadline_formatted}</Text>
            <Text style={styles.modalText}>Amount: ${milestone_amount}</Text>
  
            <TouchableOpacity style={styles.payButton} onPress={handlePayment(milestone_amount)}>
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
  
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.sooprsblue} />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView style={styles.section}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ProfessionalHome')}>
          <Image
            source={Images.backArrow}
            resizeMode="contain"
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Project Status</Text>
      </View>

      {/* Status Stepper */}
      <View style={styles.stepperContainer}>
        {steps.map((step, index) => (
          <View key={index} style={styles.step}>
            {/* Circle with optional tick icon */}
            <View style={styles.circleContainer}>
              <View
                style={[
                  styles.circle,
                  index <= activeStep && styles.activeCircle, // Active circle
                ]}>
                {index < activeStep && (
                  <Image
                    source={Images.tickIcon} // Tick icon for completed steps
                    style={styles.tickIcon}
                  />
                )}
              </View>

              {/* Vertical Line below the circle */}
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.line,
                    index < activeStep && styles.activeLine, // Active line
                  ]}
                />
              )}
            </View>

            {/* Step Text */}
            <Text
              style={[
                styles.stepText,
                index <= activeStep && styles.activeText, // Active text style
              ]}>
              {step}
            </Text>
            {isClient === '0' &&
            activeStep === 1 &&
            step === 'Requirements' &&
            downloadFile ? (
              <TouchableOpacity
                style={styles.viewButton}
                onPress={downloadFileHandler}>
                <Text style={styles.viewButtonText}>Download</Text>
              </TouchableOpacity>
            ) : null}
            {isClient === '0' && activeStep === 2 && step === 'Milestones' && (
              <>
                <View style={styles.mileRow}>
                  {milestoneNames.length > 0 ? (
                    milestoneNames.map((name, index) => (
                      <View key={index} style={styles.milestoneContainer}>
                        <View
                          style={[styles.dot, index === 0 && styles.activeDot]}
                        />
                        <Text
                          style={[
                            styles.milestoneText,
                            index === 0
                              ? styles.activeMilestoneText
                              : styles.defaultMilestoneText,
                          ]}>
                          • {name}
                        </Text>
                        {isClient === '0' ? (
                          // Complete or Finish button for client = '0'
                          <TouchableOpacity
                            style={styles.viewButton}
                            onPress={() => {
                              if (index < milestoneNames.length - 1) {
                                const newMilestones = [...milestoneNames];
                                newMilestones.splice(index, 1); // Remove completed milestone
                                setMilestoneNames(newMilestones);
                              } else {
                                setActiveStep(3); // Final step
                              }
                            }}>
                            <Text style={styles.viewButtonText}>
                              {index === milestoneNames.length - 1
                                ? 'Finish'
                                : 'Complete'}
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          // View button for client = '1'
                          <TouchableOpacity
                            style={styles.viewButton}
                            onPress={() =>
                              openMilestoneDetailsModal(index, name)
                            }>
                            <Text style={styles.viewButtonText}>View</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    ))
                  ) : (
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={openMilestoneModal}>
                      <Text style={styles.uploadButtonText}>Add</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
          </View>
        ))}
        <MilestoneDetailsModal
          isVisible={isMilestoneDetailsModalVisible}
          onClose={closeMilestoneDetailsModal}
          milestoneDetails={milestoneDetails}
          setActiveStep={setActiveStep}
        />

        <MilestoneModal
          isVisible={isMilestoneModalVisible}
          onClose={closeMilestoneModal}
          milestoneNumber="1st" // Pass dynamic milestone number if needed
          id={id}
          milestoneNames={milestoneNames}
          setmilestoneNames={setMilestoneNames}
        />
      </View>

      {/* Description and File Upload - Only for Requirements Step */}
      {activeStep === 1 && (
        <View style={styles.inputContainer}>
          {isClient === '1' && (
            <>
              <TextInput
                placeholder="Enter Description"
                placeholderTextColor={Colors.gray}
                value={description}
                onChangeText={setDescription}
                style={styles.textInput}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={selectFile}>
                <Text style={styles.uploadButtonText}>Upload File</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
      {activeStep === 3 && isClient === '1' && (
        <View style={{marginTop: hp(5), marginHorizontal: wp(5)}}>
          <ButtonNew
            imgSource={undefined}
            btntext={'Accept'}
            bgColor={Colors.sooprsblue}
            textColor={Colors.white}
            onPress={handleAcceptProject}
          />
        </View>
      )}
    </KeyboardAwareScrollView>
  );
};

export default ProjectStatus;

const styles = StyleSheet.create({
  section: {flex: 1, backgroundColor: Colors.white},
  loaderContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  headerSection: {
    marginHorizontal: wp(5),
    marginVertical: hp(1),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(5),
  },
  backArrow: {width: wp(8), height: hp(8)},
  headerText: {color: Colors.black, fontWeight: '500', fontSize: FSize.fs16},
  stepperContainer: {
    marginTop: hp(5),
    marginLeft: wp(10),
  },
  step: {
    flexDirection: 'row', // Align the circle and text horizontally
    alignItems: 'center', // Ensure they are aligned vertically
  },
  circleContainer: {
    alignItems: 'center', // Center-align circle and line
  },

  statusRow: {
    flexDirection: 'column',
  },

  circle: {
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    backgroundColor: Colors.gray, // Default circle color
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCircle: {
    backgroundColor: Colors.sooprsblue, // Active circle color
  },
  tickIcon: {
    width: wp(4),
    height: wp(4),
    tintColor: Colors.white, // Tick icon color
  },
  line: {
    width: 2,
    height: hp(10), // Adjust height to space between steps
    backgroundColor: Colors.gray,
  },
  activeLine: {
    backgroundColor: Colors.sooprsblue, // Active line color
  },
  stepText: {
    fontSize: FSize.fs14,
    color: Colors.gray,
    position: 'absolute',
    left: wp(10),
    top: hp(0),
  },
  activeText: {
    color: Colors.sooprsblue,
  },
  inputContainer: {paddingHorizontal: wp(10), marginTop: hp(5)},

  newinputContainer: {
    marginTop: hp(2),
  },

  textInput: {
    borderWidth: 1,
    borderColor: Colors.gray,
    padding: 10,
    borderRadius: wp(2),
    marginBottom: hp(2),
    color: Colors.black,
  },
  addReq: {
    color: Colors.black,
    fontSize: FSize.fs16,
    marginBottom: hp(1),
  },
  uploadButton: {
    backgroundColor: Colors.sooprsblue,
    padding: wp(3),
    borderRadius: wp(2),
  },
  uploadButtonText: {color: Colors.white, textAlign: 'center'},

  rowContainer: {
    marginTop: hp(2),
    flexDirection: 'row', // Align items in the same row
    justifyContent: 'space-between', // Space between the text and button
    alignItems: 'center', // Align vertically in the center
  },
  viewButton: {
    backgroundColor: Colors.sooprsblue, // Customize button style
    padding: 10,
    borderRadius: 5,
    marginTop: hp(1),
  },
  viewButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: wp(85),
    backgroundColor: '#fff',
    borderRadius: wp(4),
    padding: wp(5),
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  closeButton: {
    padding: wp(1),
  },
  closeButtonText: {
    fontSize: FSize.fs14,
    color: 'red',
  },
  row: {
    flexDirection: 'row',
    marginBottom: hp(2),
    width: width / 1.5,
    justifyContent: 'space-between',
  },

  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: hp(0.5),
  },
  inputStyle: {
    height: hp(6),
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: wp(2),
    color: Colors.black,
    paddingHorizontal: wp(4),
    justifyContent: 'center',
  },
  milestoneContainer: {
    marginTop: hp(3),
    marginLeft: wp(2),
    // padding: wp(3),
    marginBottom: hp(1),
    // backgroundColor: '#f9f9f9',
    borderRadius: wp(2),
    // flexDirection:'column'
  },

  mileRow: {
    flexDirection: 'column',
  },

  dot: {
    flexDirection: 'row',
  },

  milestoneText: {
    fontSize: 14,
    color: '#555',
  },
  milestoneName: {
    color: 'blue',
    fontWeight: 'bold',
  },
  addButton: {},
  addButtonText: {
    fontSize: 16,
    color: Colors.sooprsblue,
    fontWeight: 'bold',
  },

  datePickerContainer: {
    flex: 1,
    marginRight: wp(3),
    marginTop: hp(2),
  },
  labelText: {
    fontSize: FSize.fs14,
    color: Colors.black,
    marginBottom: hp(1),
    fontWeight: '500',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: wp(1.5),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
  },
  dateText: {
    color: Colors.gray,
    fontSize: FSize.fs14,
  },

  saveButton: {
    marginTop: hp(3),
  },

  // milestoneContainer: {
  //   marginVertical: 5,
  // },
  // milestoneText: {
  //   fontSize: 14, // Adjust as needed
  // },
  activeMilestoneText: {
    color: Colors.sooprsblue,
    fontWeight: 'bold', // Optional for emphasis
  },
  defaultMilestoneText: {
    color: Colors.gray, // Default color for other milestones
  },

  crossIcon: {
    width: wp(3),
    height: hp(3),
  },

  modalMilestoneContainer:{

    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },

  modalContent: {
    width: '85%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 10, // Adds shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  payButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
