import {
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Colors from '../assets/commonCSS/Colors';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import FSize from '../assets/commonCSS/FSize';
import Images from '../assets/image';
import CInput from './CInput';
import {launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import ButtonNew from './ButtonNew';

const ManagePortfolio = ({navigation}: {navigation: any}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [portfolio, setPortfolio] = useState('');

  const [filePath, setFilePath] = useState('No file chosen');

  // Request storage permission for Android
  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to your storage to select images.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Function to handle file selection
  const chooseFile = async () => {
    if (Platform.OS === 'android') {
      const permissionGranted = await requestStoragePermission();
      if (!permissionGranted) {
        Toast.show({
          type: 'error',
          text1: 'Permission Denied',
          text2: 'Storage permission is required to select images.',
        });
        return;
      }
    }

    // Launch the image library to choose an image
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
    });

    if (result.assets && result.assets.length > 0) {
      // Set the selected image's file path
      setFilePath(result.assets[0].fileName);
    }
  };

  const handleSave = ()=>{


  }

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <TouchableOpacity onPress={() => navigation.navigate('Account')}>
          <Image
            source={Images.backArrow}
            resizeMode="contain"
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Portfolio</Text>
      </View>
      <View style={styles.title}>
        <View style={styles.inputContainer}>
          <CInput
            title="Title"
            name="Enter your title"
            newlabel={false}
            style={undefined}
            setValue={(val: any) => setTitle(val)}
            value={title}
            isPassword={false}
            keyboardType={'default'}
          />
          <CInput
            title="Description"
            name="Write your description..."
            isPassword={false}
            newlabel={false}
            style={undefined}
            value={description}
            setValue={setDescription}
            keyboardType="default"
            multiline={true}
            numberOfLines={8} // Set number of lines
          />
          <Text style={styles.imageText}>Images</Text>
          <View style={styles.imageSection}>
            <TouchableOpacity
              style={styles.chooseFileButton}
              onPress={chooseFile}>
              <Text style={styles.chooseFileText}>Choose Files</Text>
            </TouchableOpacity>
            {/* Display selected file path */}
            <Text style={styles.filePath}>{filePath}</Text>
          </View>
          <CInput
            title="Portfolio Link"
            name="Enter your portfolio link"
            newlabel={false}
            style={undefined}
            setValue={(val: any) => setPortfolio(val)}
            value={portfolio}
            isPassword={false}
            keyboardType={'default'}
          />

          <ButtonNew
            imgSource={null}
            btntext="Update Portfolio"
            bgColor="#0077FF"
            textColor="#FFFFFF"
            onPress={handleSave}
          />
        </View>
      </View>
    </View>
  );
};

export default ManagePortfolio;

const styles = StyleSheet.create({
  container: {
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
  title: {
    marginHorizontal: wp(5),
  },
  titleText: {
    fontFamily: 'poppins',
    fontSize: wp(7),
    fontWeight: '600',
    color: Colors.sooprsblue,
  },
  inputContainer: {
    marginTop: hp(1),
    gap: hp(1.5),
  },

  imageText: {
    color: Colors.black,
  },
  imageSection: {
    flexDirection: 'row',
    gap: wp(2),
    alignItems: 'center',
    marginBottom: hp(1),
  },

  chooseFileButton: {
    backgroundColor: '#0077FF',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderRadius: wp(3), // Border radius of 8 for rounded corners
    alignItems: 'center',
  },
  chooseFileText: {
    color: '#FFFFFF',
    fontSize: FSize.fs13, // Text size of 16
  },
  filePath: {
    marginTop: hp(1), // Margin of 10 for top spacing
    fontSize: FSize.fs14, // Font size of 14 for file path text,
    color: '#555555',
  },
});
