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
} from 'react-native';
import Colors from '../assets/commonCSS/Colors';
import FSize from '../assets/commonCSS/FSize';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import Images from '../assets/image';
import {useIsFocused} from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const steps = [
  'Project Placed',
  'Requirements',
  'Milestones',
  'Project Accepted',
];

const ProjectStatus = ({navigation, route}: {navigation: any; route: any}) => {
  const {id} = route.params;
  const [activeStep, setActiveStep] = useState(0); // Track active step
  const [loading, setLoading] = useState(true); // Loader state
  const [description, setDescription] = useState(''); // Store description
  const [file, setFile] = useState(null); // Store selected file
  const isFocused = useIsFocused();

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

  // Function to request permission
  const requestStoragePermission = async () => {
    try {
      const result = await request(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, // Modify for iOS if needed
      );
      if (result === RESULTS.GRANTED) {
        console.log('Storage permission granted');
        selectFile(); // Call file picker once permission is granted
      } else {
        Alert.alert('Permission Denied', 'Storage permission is required.');
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
          </View>
        ))}
      </View>

      {/* Description and File Upload - Only for Requirements Step */}
      {activeStep === 1 && (
        <View style={styles.inputContainer}>
          <Text style={styles.addReq}>Add Requirements</Text>
          <TextInput
            placeholder="Enter Description"
            placeholderTextColor={Colors.gray}
            value={description}
            onChangeText={setDescription}
            style={styles.textInput}
            multiline
            numberOfLines={4} // Suggests 4 lines initially
            textAlignVertical="top" // Ensures text aligns at the top
          />

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={requestStoragePermission}>
            <Text style={styles.uploadButtonText}>Upload File</Text>
          </TouchableOpacity>
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
    height: hp(8), // Adjust height to space between steps
    backgroundColor: Colors.gray,
  },
  activeLine: {
    backgroundColor: Colors.sooprsblue, // Active line color
  },
  stepText: {
    fontSize: FSize.fs14,
    color: Colors.gray,
    marginLeft: wp(4), // Spacing between circle and text
  },
  activeText: {
    color: Colors.sooprsblue,
  },
  inputContainer: {paddingHorizontal: wp(10), marginTop: hp(5)},
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
});
