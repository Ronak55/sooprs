import React, { useState } from 'react';
import { Modal, Text, View, TextInput, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import Colors from '../assets/commonCSS/Colors';
import { hp, wp } from '../assets/commonCSS/GlobalCSS';
import Images from '../assets/image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import FSize from '../assets/commonCSS/FSize';
import { mobile_siteConfig } from '../services/mobile-siteConfig';

const BidModal = ({ id, budget, visible, onClose, setbidDone }: { id:any, budget:any, visible: boolean; onClose: () => void, setbidDone:any }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
  
    const handleSubmit = async () => {
      try {
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
    
        // Remove extra quotes from `lead_id` if present
        if (lead_id) {
          lead_id = lead_id.replace(/^"|"$/g, '');
        }
        console.log('Lead ID:', lead_id);
    
        // Prepare FormData
        const formData = new FormData();
        formData.append('id', lead_id);
        formData.append('amount', amount);
        formData.append('description', description);
        formData.append('lead_id', id);
    
        console.log('FormData payload:::', formData);
    
        // Make the API request
        const response = await fetch('https://sooprs.com/api2/public/index.php/add_bid',
          {
            method: 'POST',
            body: formData,
          }
        );
    
        // Handle the response
        const result = await response.json();
        console.log('API Response:::', result);
    
        if (result.status == 200) {
          Toast.show({
            type: 'success',
            position: 'top',
            text1: result.msg,
          });
          setbidDone(true);
          onClose();
        } else {
          throw new Error('No response data');
        }
      } catch (error) {
        console.error('Error submitting bid:', error);
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Failed to submit bid',
        });
      }
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
  