import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Images from '../assets/image';
import Colors from '../assets/commonCSS/Colors';
import FSize from '../assets/commonCSS/FSize';
import CountriesDropdown from './CountriesDropdown';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import {launchImageLibrary} from 'react-native-image-picker';
import ButtonNew from './ButtonNew';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { mobile_siteConfig } from '../services/mobile-siteConfig';

const ManageDetails = ({navigation, route}: {navigation: any, route:any}) => {

  const {name, profileImage} = route.params;

  const [newName, setNewName] = useState(name);
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('');
  const [shortBio, setShortBio] = useState('');
  const [about, setAbout] = useState('');
  const [address, setAddress] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [newprofileImage, setNewProfileImage] = useState(profileImage);

  const isFocused = useIsFocused();

  useEffect(() => {
    const loadProfileDetails = async () => {
      try {
        const storedDetails = await AsyncStorage.getItem('profileDetails');
        if (storedDetails !== null) {
          const updatedData = JSON.parse(storedDetails);

          // Set all profile details from the updatedData object
          setNewName(updatedData.name);
          setEmail(updatedData.email);
          setCity(updatedData.city);
          setMobile(updatedData.mobile);
          setOrganisation(updatedData.organisation); // Add this if 'organisation' is included in stored details
          setShortBio(updatedData.bio);
          setAbout(updatedData.listing_about);
        }
      } catch (e) {
        console.log('Error retrieving profile details:', e);
      }
    };

    loadProfileDetails();
  }, [isFocused]);

  const handleCountrySelect = (selectedCountry, selectedCountryCode) => {
    setCountry(selectedCountry);
    setCountryCode(selectedCountryCode);
  };

  const saveProfileDetails = async () => {
    try {
      const id = await AsyncStorage.getItem('uid');

      // Remove leading and trailing quotes if present
      const cleanedId = id ? id.replace(/^"|"$/g, '') : null;

      // Create FormData object
      const formData = new FormData();
      formData.append('id', cleanedId);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('city', city);
      formData.append('address', address);
      formData.append('area_code', pincode);
      formData.append('country', countryCode); // Assuming you're using country code
      formData.append('mobile', mobile);
      formData.append('organisation', organisation);
      formData.append('bio', shortBio);
      formData.append('about', about);

    //   await AsyncStorage.setItem('profileDetails', profileImage);
      // Make the POST request
      const response = await fetch(
        'https://sooprs.com/api2/public/index.php/update_profile_professional',
        {
          method: 'POST',
          body: formData,
        },
      );

      const jsonResponse = await response.json();

      // Check for successful response
      if (jsonResponse.status === 200) {
        // Update state with new data
        console.log('updated profile::::::::::', jsonResponse.msg);
        const updatedData = jsonResponse.msg;
        setNewName(updatedData.name);
        setEmail(updatedData.email);
        setCity(updatedData.city);
        setMobile(updatedData.mobile);
        setOrganisation(updatedData.organisation);
        setShortBio(updatedData.bio);
        setAbout(updatedData.listing_about); // Update with the correct field name if necessary

        // Save the updated profile details in AsyncStorage
        await AsyncStorage.setItem(
          'profileDetails',
          JSON.stringify(updatedData),
        );

        // Show success toast
        Toast.show({
          text1: 'Profile Updated',
          text2: 'Your profile details have been successfully updated.',
          type: 'success',
        });

        // Navigate back to Account screen
        navigation.navigate('Account');
      } else {
        // Show error toast
        Toast.show({
          text1: 'Update Failed',
          text2: 'Failed to update profile. Please try again.',
          type: 'error',
        });
      }
    } catch (e) {
      console.log('Error saving profile details:', e);
      // Show error toast
      Toast.show({
        text1: 'Error',
        text2: 'An error occurred while saving profile details.',
        type: 'error',
      });
    }
  };

  // Validation checks
  const isValidEmail = (email: string) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const isValidMobile = (mobile: string) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  
  // const requestPermission = async () => {
  //   if (Platform.OS === 'android') {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  //         {
  //           title: 'Storage Permission Required',
  //           message: 'This app needs access to your storage to select images.',
  //           buttonNeutral: 'Ask Me Later',
  //           buttonNegative: 'Cancel',
  //           buttonPositive: 'OK',
  //         },
  //       );
  
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         selectImage(); // Call selectImage if permission is granted
  //       } else {
  //         Alert.alert(
  //           'Permission Denied',
  //           'Storage permission is required to select images',
  //         );
  //       }
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   } else {
  //     selectImage(); // For iOS, no permission needed
  //   }
  // };
  // Function to launch image picker and handle image selection
  const selectImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      includeBase64: true,
    });

    if (result?.assets?.length) {
        const imageUri = result.assets[0].uri;
        const imageName = result.assets[0].fileName; // Get the image name
        const imageType = result.assets[0].type; // Get the image MIME type (e.g., image/jpeg, image/png)
        
        setNewProfileImage(imageUri); // Set the image locally for preview
    
        // Get the user ID from AsyncStorage
        const id = await AsyncStorage.getItem('uid');
        const cleanedId = id ? id.replace(/^"|"$/g, '') : null; // Remove quotes if any
    
        if (!cleanedId) {
          console.error('User ID not found.');
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'User ID not found.',
          });
          return;
        }
    
        // Prepare the image for upload using FormData
        const formData = new FormData();
        formData.append('image', {
          uri: imageUri,
          name: imageName || 'profile_picture', // Use actual file name if available
          type: imageType || 'image/jpeg', // Use actual MIME type, default to JPEG if not available
        });
        formData.append('id', cleanedId); // Append the user ID
        formData.append('table', 'join_professionals'); // Append the table name
    
        try {
          const response = await fetch('https://sooprs.com/api2/public/index.php/upload_picture', {
            method: 'POST',
            body: formData,
          });
    
          const responseData = await response.json();
          console.log('Image upload response:', responseData);
    
          // Check for success status and store the image URL
          if (responseData.status === 200 && responseData.msg?.image) {
            const imageUrl = responseData.msg.image;
    
            // Store the image URL in AsyncStorage
            await AsyncStorage.setItem(mobile_siteConfig.PROFILE_PIC, imageUrl);
    
            Toast.show({
              type: 'success',
              text1: 'Success',
              text2: 'Image uploaded successfully!',
            });
    
            console.log('Image URL saved to AsyncStorage:', imageUrl);
          } else {
            console.error('Image upload failed:', responseData);
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Image upload failed.',
            });
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'An error occurred while uploading the image.',
          });
        }
      } else {
        console.error('No image selected.');
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No image selected.',
        });
      }

  };

  return (
    <ScrollView style={styles.section}>
      <View style={styles.headerSection}>
        <TouchableOpacity onPress={() => navigation.navigate('Account')}>
          <Image
            source={Images.backArrow}
            resizeMode="contain"
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Details</Text>
      </View>

      <View style={styles.profileHeading}>
        <TouchableOpacity onPress={selectImage}>
          <View style={styles.profileIcon}>
            <Image
              style={styles.Icon}
              resizeMode="cover"
              source={newprofileImage ? {uri:newprofileImage} : Images.defaultPicIcon}
            />
          </View>
        </TouchableOpacity>
        <Text style={styles.profileName}>{name ? name : 'User'}</Text>
      </View>
      {/* Form Fields */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor={Colors.gray}
          value={name}
          onChangeText={setNewName}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor={Colors.gray}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        {!isValidEmail(email) && email.length > 0 && (
          <Text style={styles.errorText}>Invalid email format</Text>
        )}

        <Text style={styles.label}>Mobile</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your mobile number"
          placeholderTextColor={Colors.gray}
          keyboardType="number-pad"
          value={mobile}
          onChangeText={setMobile}
        />
        {!isValidMobile(mobile) && mobile.length > 0 && (
          <Text style={styles.errorText}>Invalid mobile number</Text>
        )}

        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your city"
          placeholderTextColor={Colors.gray}
          value={city}
          onChangeText={setCity}
        />
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={[styles.input, styles.addressTextInput]}
          placeholder="Enter your address..."
          placeholderTextColor={Colors.gray}
          multiline={true}
          textAlignVertical="top"
          value={address}
          onChangeText={setAddress}
        />
        <Text style={styles.label}>Pincode</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your pincode"
          placeholderTextColor={Colors.gray}
          keyboardType="number-pad"
          value={pincode}
          onChangeText={setPincode}
        />
        <Text style={styles.label}>Country</Text>
        {/* Custom Dropdown for country selection */}
        <CountriesDropdown
          selectedCountry={country}
          selectedCountryCode={countryCode}
          onSelect={handleCountrySelect}
        />

        <Text style={styles.label}>Organisation</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your organisation"
          placeholderTextColor={Colors.gray}
          value={organisation}
          onChangeText={setOrganisation}
        />
        <Text style={styles.label}>Short Bio</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Enter a short bio..."
          placeholderTextColor={Colors.gray}
          multiline={true}
          textAlignVertical="top"
          value={shortBio}
          onChangeText={setShortBio}
        />

        <Text style={styles.label}>About</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Tell us more about yourself..."
          placeholderTextColor={Colors.gray}
          multiline={true}
          textAlignVertical="top"
          value={about}
          onChangeText={setAbout}
        />
      </View>
      <View style={styles.saveButton}>
        <ButtonNew
          imgSource={undefined}
          btntext={'Update Profile'}
          bgColor={Colors.sooprsblue}
          textColor={Colors.white}
          onPress={saveProfileDetails}
        />
      </View>
    </ScrollView>
  );
};

export default ManageDetails;

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
    gap: wp(2),
  },
  backArrow: {
    width: wp(8),
    height: hp(8),
  },
  headerTitle: {
    color: Colors.black,
    fontWeight: '500',
    fontSize: FSize.fs16,
  },
  profileHeading: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp(2),
  },
  profileIcon: {
    width: wp(32),
    height: hp(14),
    borderWidth: 2,
    borderColor: Colors.sooprsblue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(30),
    marginBottom: wp(2),
  },

  Icon: {
    width: wp(32),
    height: hp(14),
    borderRadius: wp(30),
  },
  profileName: {
    fontSize: FSize.fs24,
    fontWeight: '600',
    color: Colors.black,
  },
  formContainer: {
    paddingHorizontal: wp(5),
  },
  label: {
    color: Colors.black,
    fontSize: FSize.fs15,
    fontWeight: '600',
    marginBottom: hp(1),
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: wp(2),
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    fontSize: FSize.fs14,
    color: Colors.black,
    marginBottom: hp(2),
  },
  multilineInput: {
    height: hp(20),
    textAlignVertical: 'top',
  },

  addressTextInput: {
    height: hp(10),
    textAlignVertical: 'top',
  },

  errorText: {
    color: 'red',
    fontSize: FSize.fs12,
    marginBottom: hp(1),
  },

  saveButton: {
    marginHorizontal: wp(5),
  },
});
