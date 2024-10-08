import React, { useState } from 'react';
import { Modal, Text, View, TextInput, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import Colors from '../assets/commonCSS/Colors';
import { hp, wp } from '../assets/commonCSS/GlobalCSS';
import Images from '../assets/image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import FSize from '../assets/commonCSS/FSize';
import { mobile_siteConfig } from '../services/mobile-siteConfig';

const BidModal = ({ id, budget, visible, onClose }: { id:any, budget:any, visible: boolean; onClose: () => void }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
  
    const handleSubmit = async () => {
        // Check if amount is within the budget range
        const [minBudget, maxBudget] = budget.split('-').map(Number); // Assuming budget is in format '0-500'
      
        const enteredAmount = parseFloat(amount);
        
        if (enteredAmount < minBudget || enteredAmount > maxBudget) {
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Please enter a valid amount',
          });
          onClose();
          return; // Exit the function if the amount is invalid
        }
      
        let lead_id = await AsyncStorage.getItem('uid');
  
        // If lead_id has extra quotes, remove them
        if (lead_id) {
          lead_id = lead_id.replace(/^"|"$/g, ''); // Removes leading and trailing quotes if present
        }

        console.log('Lead ID:::::', lead_id);

      
        const formdata = new FormData();
        formdata.append('id', id);
        formdata.append('amount', amount);
        formdata.append('description', description);
        formdata.append('lead_id', lead_id);
      
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata,
        };
      
        fetch(mobile_siteConfig.BASE_URL + mobile_siteConfig.INDEX + mobile_siteConfig.ADD_BID, requestOptions)
          .then(response => response.json())
          .then(res => {
            if (res) {
              console.log('payload response:::::::::', formdata);
              console.log('response amount::::::::::', res);
              Toast.show({
                type: 'success',
                position: 'top',
                text1: res.msg,
              });
              onClose();
            }
          })
          .catch(error => {
            Toast.show({
              type: 'error',
              position: 'top',
              text1: "Failed to submit bid",
            });
            console.error('Error fetching bids:', error);
          });
      };
      
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {/* Close Icon */}
                <TouchableOpacity onPress={onClose} style={styles.closeIconContainer}>
                  <Image source={Images.crossIcon} style={styles.crossIcon} resizeMode="contain" />
                </TouchableOpacity>
  
                {/* Modal Title */}
                <Text style={styles.modalTitle}>Place Bid</Text>
  
                {/* Amount Label */}
                <Text style={styles.labelText}>Amount</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter amount"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  placeholderTextColor={Colors.gray}
                />
  
                {/* Description Label */}
                <Text style={styles.labelText}>Description</Text>
                <TextInput
                  style={styles.textarea}
                  placeholder="Enter bid description"
                  multiline={true}
                  numberOfLines={8}
                  value={description}
                  onChangeText={setDescription}
                  placeholderTextColor={Colors.gray}
                  textAlignVertical='top'
                />
  
                {/* Submit Button */}
                <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
                  <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };
  
  export default BidModal;
  

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)', // transparent dark background
    },
    modalContent: {
      width: wp(85),
      backgroundColor: Colors.white,
      borderRadius: wp(4),
      padding: wp(5),
    },
    closeIconContainer: {
      position: 'absolute',
      right: wp(4),
      top: wp(4),
    },
    crossIcon: {
      width: wp(5),
      height: wp(5),
    },
    modalTitle: {
      fontSize: FSize.fs18,
      fontWeight: '600',
      color: Colors.black,
      marginBottom: hp(2),
      textAlign: 'center',
    },
    labelText: {
      fontSize: FSize.fs14,
      color: Colors.black,
      marginBottom: hp(0.5),
    },
    input: {
      borderColor: Colors.gray,
      borderWidth: 1,
      borderRadius: wp(2),
      padding: wp(2),
      marginBottom: hp(2),
      color: Colors.black,
    },
    textarea: {
      borderColor: Colors.gray,
      borderWidth: 1,
      borderRadius: wp(2),
      padding: wp(2),
      marginBottom: hp(2),
      color: Colors.black,
   // Set height for multiline input
    },
    submitBtn: {
      backgroundColor: Colors.sooprsblue,
      borderRadius: wp(2),
      paddingVertical: hp(1.5),
      alignItems: 'center',
    },
    submitText: {
      color: Colors.white,
      fontSize: FSize.fs14,
      fontWeight: '500',
    },
  });
  