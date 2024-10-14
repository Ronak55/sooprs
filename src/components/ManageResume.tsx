import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Linking,
} from 'react-native';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import Colors from '../assets/commonCSS/Colors';
import FSize from '../assets/commonCSS/FSize';
import Images from '../assets/image';
import DocumentPicker from 'react-native-document-picker'; // Document picker for file uploads
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message'; // Toast for notifications
import ButtonNew from './ButtonNew';

const ManageResume = ({navigation}: {navigation: any}) => {
  const [fileUri, setFileUri] = useState<string | null>(null); // State to hold file URI
  const [uploading, setUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null); // State to hold download URL

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images], // Allow PDF and image files
      });

      // If the user selects a file
      if (result && result[0]) {
        setFileUri(result[0].uri); // Set the file URI
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('File selection canceled.');
      } else {
        console.error('Error picking file:', err);
      }
    }
  };

  const handleUpload = async () => {
    if (!fileUri) {
      Toast.show({
        type: 'error',
        text1: 'Upload Error',
        text2: 'Please upload a file before uploading.',
      });
      return;
    }

    setUploading(true);
    const lead_id = await AsyncStorage.getItem('uid');
    const formData = new FormData();

    // Append id and the selected file to formData
    formData.append('id', lead_id ? lead_id.replace(/^"|"$/g, '') : '');
    formData.append('resume', {
      uri: fileUri,
      name: 'resume',
      type: 'application/pdf', // Modify this type based on the file type
    });

    try {
      // Call the upload API
      const response = await fetch(
        'https://sooprs.com/api2/public/index.php/upload_resume',
        {
          method: 'POST',
          body: formData,
        },
      );
      const result = await response.json();

      if (result.msg) {
        setDownloadUrl(result.msg); // Set the download URL
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'File uploaded successfully!',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Upload Error',
          text2: 'File upload failed. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      Toast.show({
        type: 'error',
        text1: 'Upload Error',
        text2: 'Error uploading resume. Please try again.',
      });
    } finally {
      setUploading(false);
    }
  };

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
        <Text style={styles.headerTitle}>Upload your resume</Text>
      </View>

      <View style={styles.uploadCard}>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleFileUpload}>
          <Image source={Images.imageIcon} style={styles.imageIcon} />
          <Text style={styles.uploadText}>Upload File</Text>
        </TouchableOpacity>

        </View>
        <View style={styles.resumebtn}>
        <ButtonNew
        imgSource={undefined}
        btntext={'Upload Resume'}
        bgColor={Colors.sooprsblue}
        textColor={Colors.white}
        onPress={handleUpload}
      />
      </View>

      {downloadUrl && (
        <TouchableOpacity onPress={() => Linking.openURL(downloadUrl)}>
          <Text style={styles.downloadText}>
            To download your file Click here
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ManageResume;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: wp(5),
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  backArrow: {
    width: wp(8),
    height: hp(8),
    marginRight: wp(2),
  },
  headerTitle: {
    color: Colors.black,
    fontWeight: '500',
    fontSize: FSize.fs16,
  },
  uploadCard: {
    backgroundColor: Colors.white,
    borderColor:Colors.gray,
    borderWidth:2,
    borderRadius: wp(2),
    paddingHorizontal: wp(5),
    paddingVertical:hp(10),
    alignItems: 'center',
    marginBottom: hp(2),
    borderStyle:'dotted'
  },
  uploadButton: {
    alignItems: 'center',
  },
  imageIcon: {
    width: wp(8),
    height: hp(3),
    marginBottom: hp(1),
  },
  uploadText: {
    color: Colors.black,
    fontWeight: '500',
    fontSize: FSize.fs14,
  },

  downloadText: {
    color: Colors.sooprsblue,
    fontWeight: '500',
    fontSize: FSize.fs14,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },

  resumebtn:{
    marginVertical:hp(3),
    marginHorizontal:wp(5)
  }
});
