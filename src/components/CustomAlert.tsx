import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal as RNModal } from 'react-native';
import Images from '../assets/image';
import Colors from '../assets/commonCSS/Colors';
import { hp, wp } from '../assets/commonCSS/GlobalCSS';
import FSize from '../assets/commonCSS/FSize';

const CustomAlert = ({ isVisible, onClose, title, message } : { isVisible:any, onClose:any, title:any, message:any }) => {
  return (
    <RNModal
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose} // Handles hardware back button on Android
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose}>
            <Image
              source={Images.crossIcon}
              resizeMode='contain'
              style={styles.iconContainer}
            />
          </TouchableOpacity>
          <View style={styles.textStyle}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </RNModal>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: wp(80), // Adjust width as needed
    maxHeight: hp(40), // Adjust height as needed
  },
  iconContainer: {
    marginBottom: 10,
    width: wp(6),
    height: hp(6),
    alignSelf: 'flex-end',
  },
  textStyle: {
    alignItems: 'center',
  },
  title: {
    fontSize: FSize.fs18,
    fontWeight: 'bold',
    color: Colors.sooprsblue,
    marginBottom: 10,
  },
  message: {
    fontSize: FSize.fs16,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.sooprsblue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: FSize.fs16,
    fontWeight: 'bold',
  },
});
