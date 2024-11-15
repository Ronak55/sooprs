import React, {useCallback, useEffect, useState} from 'react';
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
  RefreshControl,
} from 'react-native';
import {parse, URLSearchParams} from 'url';
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
  remarks,
  setRemarks,
  setAmount,
  isDatePickerVisible,
  setIsDatePickerVisible,
  onDelete, // Function to handle deletion
}) => {
  return (
    <View style={styles.newinputContainer}>
      <View style={styles.row}>
        <Text style={styles.label}>Milestone {milestoneNumber}</Text>
        <TouchableOpacity onPress={onDelete} style={styles.closeButton}>
               <Image source={Images.cancelIcon} style={styles.cancelIcon}/>
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
      <View style={styles.newinputContainer}>
        <Text style={styles.label}>Remarks</Text>
        <TextInput
          style={[styles.inputStyle, {flex: 1}]}
          value={remarks}
          onChangeText={setRemarks}
          placeholder="Enter Remarks"
          keyboardType="default"
        />
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
  setActiveStep,
}) => {
  // State to hold multiple milestones
  const [milestones, setMilestones] = useState([]);

  // Temporary states to hold current inputs for the latest milestone
  const [milestoneName, setMilestoneName] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [loading, isLoading] = useState(false);

  // Function to handle adding a milestone
  const handleAddMilestone = () => {
    const newMilestone = {milestoneName, dueDate, amount, remarks};
    setMilestones(prevMilestones => [...prevMilestones, newMilestone]);
    // Reset input fields
    setMilestoneName('');
    setDueDate(new Date());
    setAmount('');
    setRemarks('');
  };

  const handleDeleteMilestone = index => {
    const updatedMilestones = milestones.filter((_, i) => i !== index);
    setMilestones(updatedMilestones);
  };

  const handleSaveMilestone = async () => {
    // Get user_id from AsyncStorage
    let user_id = await AsyncStorage.getItem('uid');
    if (user_id) {
      user_id = user_id.replace(/^"|"$/g, ''); // Remove extra quotes if any
    }

    isLoading(true);

    let formDataString = '';

    const addField = (key, value) => {
      if (formDataString.length > 0) formDataString += '&';
      formDataString +=
        encodeURIComponent(key) + '=' + encodeURIComponent(value);
    };

    if (milestones.length === 0) {
      addField('formData[0][milestone_name]', milestoneName || '');
      addField('formData[0][amount]', amount || '');
      addField(
        'formData[0][deadline]',
        dueDate ? dueDate.toLocaleDateString('en-CA') : '',
      );
      addField('formData[0][remark]', remarks || '');
      addField('formData[0][user_id]', user_id);
      addField('formData[0][leadId]', id || '');
      addField('user_id', user_id);
      addField('leadId', id || '');
    } else {
      milestones.forEach((milestone, index) => {
        addField(
          `formData[${index}][milestone_name]`,
          milestone.milestoneName || '',
        );
        addField(`formData[${index}][amount]`, milestone.amount || '');
        addField(
          `formData[${index}][deadline]`,
          milestone.dueDate
            ? milestone.dueDate.toLocaleDateString('en-CA')
            : '',
        );
        addField(`formData[${index}][remark]`, milestone.remarks || '');
        addField(`formData[${index}][user_id]`, user_id);
        addField(`formData[${index}][leadId]`, id || '');
      });
      addField('user_id', user_id);
      addField('leadId', id || '');
    }

    console.log('Form data to be sent::::', formDataString);

    try {
      const response = await fetch(
        'https://sooprs.com/api2/public/index.php/add_milestone',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formDataString,
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
        setActiveStep(3);
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
    } finally {
      isLoading(false);
    }

    // Reset input fields
    setMilestoneName('');
    setDueDate(new Date());
    setAmount('');
    setRemarks('');
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
                remarks={milestone.remarks}
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
                setRemarks={remark => {
                  const updatedMilestones = [...milestones];
                  updatedMilestones[index].remarks = remark;
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
              remarks={remarks}
              amount={amount}
              setMilestoneName={setMilestoneName} // No need for an index here
              setDueDate={setDueDate}
              setRemarks={setRemarks}
              setAmount={setAmount}
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
              btntext={
                loading ? <ActivityIndicator color={Colors.white} /> : 'Save'
              }
              bgColor={Colors.sooprsblue}
              textColor={Colors.white}
              onPress={handleSaveMilestone}
              isDisabled={loading}
              isBorder={true}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const ProjectStatus = ({navigation, route}: {navigation: any; route: any}) => {
  const {id, recieverId, project_status} = route.params;
  const [activeStep, setActiveStep] = useState(0); // Track active step
  const [isClient, setisClient] = useState('');

  const [loading, setLoading] = useState(true); // Loader state
  const [refreshing, setRefreshing] = useState(false);

  const [description, setDescription] = useState(''); // Store description
  const [downloadFile, setDownloadFile] = useState('');

  const [file, setFile] = useState(null); // Store selected file
  const [milestoneCount, setMilestoneCount] = useState(1);
  const [currentMilestone, setCurrentMilestone] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [milestoneDetails, setmilestoneDetails] = useState([]);
  const [milestoneNames, setMilestoneNames] = useState([]);
  const [isMilestoneDetailsModalVisible, setMilestoneDetailsModalVisible] =
    useState(false);
  const [selectedMilestoneName, setSelectedMilestoneName] = useState('');
  const [selectedMilestoneDetails, setSelectedMilestoneDetails] = useState('');
  const [orderId, setOrderId] = useState('');
  const [stateinfo, setstateInfo] = useState(null);

  const openMilestoneDetailsModal = index => {
    const selectedMilestone = milestoneDetails[index];
    setSelectedMilestoneDetails(selectedMilestone); // Set selected milestone details
    setMilestoneDetailsModalVisible(true); // Open modal
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
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res.msg,
        });
        AsyncStorage.setItem(mobile_siteConfig.DELIVERED, res.status)
      } else {
        Toast.show({
          type:'info',
          text1: 'Error',
          text2: res.msg,
        });
      }
    } catch (error) {
      console.error('Error accepting project:', error);
    }
  };

  const isFocused = useIsFocused();

  const downloadFileHandler = async () => {
    if (downloadFile) {
      try {
        await Linking.openURL(downloadFile);
        await fetchMilestones();
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

      if (
        res.msg === 'Already rewarded' ||
        res.msg === 'successfully rewarded'
      ) {
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

  // useEffect(() => {
  //   // fetchRewardStatus();
  //   if(project_status === '1'){

  //     setActiveStep(1);
  //     if(!isClient){
  //       getRequirements();
  //     }
  //     setLoading(false);
  //   } else{
  //     setActiveStep(0);
  //     setLoading(false);
  //   }
  // }, [isFocused, route?.params?.id]);

  const getStateInfo = async () => {
    const stateInfo = await getDataFromAsyncStorage(
      mobile_siteConfig.IS_BUYER,
    );
    console.log('state infoo new:::::', stateInfo);
    setstateInfo(stateInfo);
    if (project_status === '1') {
      setActiveStep(1);
      getRequirements();
      setLoading(false);
    } else {
      setActiveStep(0);
      setLoading(false);
    }
    setisClient(stateInfo);
  };

  const getMilestoneInfo = async () => {
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

      console.log('Milestones fetched response:', res);

      if (res.msg && Array.isArray(res.msg.milestones)) {
        const milestones = res.msg.milestones.map(
          milestone => milestone.milestone_name,
        );
        setMilestoneNames(milestones);
        setmilestoneDetails(res.msg.milestones);
        setActiveStep(2);
      }
    } catch (error) {
      console.error('Error fetching milestones:', error);
    }
  };

  const fetchAcceptStatus = async () => {
    try {
      const isDelivered = await AsyncStorage.getItem(mobile_siteConfig.DELIVERED); // Await the promise
  
      if (isDelivered !== null) {
        const parseDelivery = JSON.parse(isDelivered);
        console.log('delivered or not:::::::', parseDelivery);
  
        if (parseDelivery == 200) {
          setActiveStep(3);
        }
      } else {
        // Handle the case where there's no value stored
        console.log('No delivery status found in AsyncStorage.');
        return;
      }
    } catch (error) {
      console.error('Error fetching delivery status from AsyncStorage:', error);
      return;
    }
  };

  
  useEffect(() => {
    getStateInfo();
    getMilestoneInfo();
    fetchAcceptStatus();
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
        stateinfo == 0 ? setDownloadFile(res[0].file) : setActiveStep(2);
      } else {
        setActiveStep(1);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.error,
        });
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
        setActiveStep(2);
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
            {text: 'Cancel', style: 'cancel'},
          ],
        );
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  // Function to handle file selection
  const selectFile = async () => {
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  // Function to upload requirements
  const uploadRequirements = async selectedFile => {
    setUploading(true);

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
    } finally {
      setUploading(false); // Stop API loader
    }
  };

  const MilestoneDetailsModal = ({
    isVisible,
    onClose,
    selectedMilestoneDetails,
    setActiveStep,
  }) => {
    if (!selectedMilestoneDetails) return null;

    const {milestone_name, milestone_deadline_formatted, milestone_amount} =
      selectedMilestoneDetails;
    
    const [loading, setLoading] = useState(false);

    const handlePayment = async amount => {

      setLoading(true);
      const amountInUSD = parseFloat(amount);
      const conversionRate = 83.97;
      const amountInINR = amountInUSD * conversionRate;
      const amountInPaise = amountInINR * 100;

      // Initialize FormData
      const formdata = new FormData();
      formdata.append('amount', amountInPaise.toString());

      console.log('formdata:::::::::', formdata);

      try {
        const response = await fetch(
          'https://sooprs.com/create_razr_order.php',
          {
            method: 'POST',
            body: formdata,
          },
        );

        const res = await response.json();

        if (res.order_id) {
          console.log('order id::::::::::', res.order_id);
          setOrderId(res.order_id);

          const options = {
            key: 'rzp_live_SwPxj3HuCi6h9s', // Replace with your Razorpay Key ID
            amount: amountInPaise,
            currency: 'INR',
            name: 'Gazetinc Technology LLP',
            description: 'Sooprs',
            order_id: res.order_id,
            image: 'https://sooprs.com/assets/images/sooprs_logo.png',
            handler: paymentResponse => {
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

          RazorpayCheckout.open(options)
            .then(data => {
              console.log('Payment data::::', data);
              setActiveStep(3);
            })
            .catch(error => {
              console.error('Razorpay error:', error);
            });
        }
      } catch (error) {
        console.error('Error creating order:', error);
      } finally{
        setLoading(false);
      }
    };
    return (
      <Modal visible={isVisible} transparent animationType="slide">
        <View style={styles.modalMilestoneContainer}>
          <View style={styles.modalContent}>
            <View style={styles.payRow}>
              <Text style={styles.modalPaymentTitle}>{milestone_name}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
               <Image source={Images.cancelIcon} style={styles.cancelIcon}/>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>
              Deadline: {milestone_deadline_formatted}
            </Text>
            <Text style={styles.modalText}>Amount: ${milestone_amount}</Text>
            <ButtonNew
                imgSource={undefined}
                btntext={
                  loading ? (
                    <ActivityIndicator color={Colors.white} />
                  ) : (
                    'Pay Now'
                  )
                }
                bgColor={Colors.sooprsblue}
                textColor={Colors.white}
                onPress={() => handlePayment(milestone_amount)}
                isDisabled={loading} // Disable button while loading
                isBorder={true}
              />
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

   
// const onRefresh = useCallback(() => {
//   setRefreshing(true);
//   getStateInfo();
//   getMilestoneInfo();
//   setRefreshing(false); // Set refreshing to false after fetching
// }, []);


  return (
    <KeyboardAwareScrollView style={styles.section}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
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
            {activeStep === 2 && step === 'Milestones' && (
              <View style={styles.mileRow}>
                {isClient === '0' ? (
                  milestoneNames.length === 0 ? (
                    // "Add" button for client = '0' and no milestones
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={openMilestoneModal}>
                      <Text style={styles.uploadButtonText}>Add</Text>
                    </TouchableOpacity>
                  ) : (
                    // Milestone list with "Complete" or "Finish" button for client = '0'
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
                      </View>
                    ))
                  )
                ) : milestoneNames.length === 0 ? (
                  // Message for client = '1' and no milestones
                  <>
                    <View
                      style={styles.dot}
                    />
                    <Text style={styles.waitingText}>
                      waiting for freelancer
                    </Text>
                  </>
                ) : (
                  // Milestone list with "View" button for client = '1'
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
                      <TouchableOpacity
                        style={styles.viewButton}
                        onPress={() => openMilestoneDetailsModal(index)}>
                        <Text style={styles.viewButtonText}>View</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>
            )}
          </View>
        ))}
        <MilestoneDetailsModal
          isVisible={isMilestoneDetailsModalVisible}
          onClose={closeMilestoneDetailsModal}
          selectedMilestoneDetails={selectedMilestoneDetails}
          setActiveStep={setActiveStep}
        />
        <MilestoneModal
          isVisible={isMilestoneModalVisible}
          onClose={closeMilestoneModal}
          milestoneNumber="1st" // Pass dynamic milestone number if needed
          id={id}
          milestoneNames={milestoneNames}
          setmilestoneNames={setMilestoneNames}
          setActiveStep={setActiveStep}
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
              <ButtonNew
                imgSource={undefined}
                btntext={
                  loading || uploading ? (
                    <ActivityIndicator color={Colors.white} />
                  ) : (
                    'Upload File'
                  )
                }
                bgColor={Colors.sooprsblue}
                textColor={Colors.white}
                onPress={selectFile}
                isDisabled={loading || uploading} // Disable button while loading or uploading
                isBorder={true}
              />
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
            isBorder={true}
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
    marginBottom: hp(1),
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

  cancelIcon:{
    width:wp(5),
    height:hp(3)
  },

  waitingText: {
    fontSize: FSize.fs14,
    fontWeight: '500',
    color: Colors.sooprsblue,
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
    marginBottom: hp(1),
    width: width / 1.5,
    justifyContent: 'space-between',
  },

  payRow:{
    flexDirection: 'row',
    marginBottom: hp(1),
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

  modalMilestoneContainer: {
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalPaymentTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.sooprsblue,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: Colors.sooprsblue,
    marginBottom: hp(2),
  },
  payButton: {
    backgroundColor: Colors.sooprsblue,
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  payButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
