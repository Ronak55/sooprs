import { StyleSheet, Text, TouchableOpacity, View, Image, Modal, TouchableWithoutFeedback, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Images from '../assets/image'
import { hp, wp } from '../assets/commonCSS/GlobalCSS'
import Colors from '../assets/commonCSS/Colors'
import FSize from '../assets/commonCSS/FSize'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ButtonNew from './ButtonNew'
import Toast from 'react-native-toast-message'

const AddServices = ({navigation} : {navigation:any}) => {

const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [addedServices, setaddedServices] = useState([]);

  const [serviceId, setServiceId] = useState(null);
  const [visible, setVisible] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchServices();
    fetchUserId();
  }, []);

  const fetchUserId = async () => {
    const id = await AsyncStorage.getItem('uid');
    const cleanedId = id ? id.replace(/^"|"$/g, '') : null;
    setUserId(cleanedId);
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('https://sooprs.com/api2/public/index.php/sr_services_all', {
        method: 'POST',
      });
      const data = await response.json();

      if(data.status == 200){
        const formattedData = data.msg.map(service => ({
            id: service.id,
            service_name: service.service_name,
          }));

          setServices(formattedData);
          
      } else{

        console.log('error fetching services::::::::', data.msg);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to fetch services',
        text2: 'Please try again later.',
      });
    }
  };
  

  const addService = async () => {
    if (!serviceId || !userId) return; // Validate before proceeding

    const formData = new FormData();
    formData.append('service', serviceId);
    formData.append('profid', userId);

    try {
      const response = await fetch('https://sooprs.com/api2/public/index.php/addServForm', {
        method: 'POST',
        body: formData,
      });

      const res = await response.json();
      if (res.status === 200) {
        // Show success toast with res.msg
        console.log('Success:::::::::', res.msg);
        const newService = services.find(service => service.id === serviceId);
        setaddedServices(prevServices => [...prevServices, newService]);
        
        Toast.show({
          type: 'success',
          text1: 'Service Added',
          text2: 'Your service was successfully added.',
        });
        setVisible(false);
      } else {
        // Show error toast
        console.error('Error:', res.msg);
        Toast.show({
            type: 'error',
            text1: 'Error Adding Service',
            text2: res.message || 'Something went wrong.',
          });
      }
    } catch (error) {
      console.error('Error adding service:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add service. Please try again.',
      });
    }
  };

  const removeService = async serviceId => {
    const formData = new FormData();
    formData.append('dataSerValue', serviceId);
    formData.append('dataPrfValue', userId);

    try {
      const response = await fetch(
        'https://sooprs.com/api2/public/index.php/remove_professional_service',
        {
          method: 'POST',
          body: formData,
        },
      );

      const res = await response.json();

      if (res.status === 200) {
        // Remove skill from local state
        console.log('service removed:::::::::', res.msg);

        setaddedServices(prevServ =>
          prevServ.filter(service => service.id !== serviceId),

        );
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res.msg,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.msg || 'Failed to remove skill.',
        });
      }
    } catch (error) {
      console.error('Error removing skill:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred. Please try again.',
      });
    }
  };

  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);

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
        <Text style={styles.headerTitle}>Add Services</Text>
      </View>
      <View style={styles.services}>
      <Text style={styles.serviceText}>Services</Text>
      {addedServices.length > 0 ? (
        <FlatList
          data={addedServices}
          keyExtractor={item => item.id}
          numColumns={2} // Two columns
          renderItem={({ item }) => (
            <View style={styles.serviceCard}>
              <Text style={styles.serviceCardText}>{item.service_name}</Text>
              <TouchableOpacity
                onPress={() => removeService(item.id)}
                style={styles.crossIconContainer}
              >
                <Image
                  source={Images.crossIcon}
                  style={styles.crossIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          )}
          columnWrapperStyle={styles.row}
        />
      ) : (
        <Text style={styles.noServicesText}>No services available!</Text>
      )}

      {/* Add Service Button */}
      <View style={styles.addService}>
        <ButtonNew
          imgSource={null}
          btntext="Add Services"
          bgColor="#0077FF"
          textColor="#FFFFFF"
          onPress={openModal}
        />
      </View>

      {/* Modal */}
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {/* Close Icon */}
                <View style={styles.modalsec}>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.closeIconContainer}
                  >
                    <Image
                      source={Images.crossIcon}
                      style={styles.crossIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  {/* Modal Title */}
                  <Text style={styles.modalTitle}>Add Service</Text>
                </View>

                {/* Custom Scrollable Dropdown */}
                <Text style={styles.labelText}>Select Service</Text>
                <FlatList
                  data={services}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedService(item.service_name);
                        setServiceId(item.id);
                      }}
                      style={[
                        styles.serviceItem,
                        selectedService === item.service_name && styles.selectedService,
                      ]}
                    >
                      <Text
                        style={[
                          styles.serviceNewText,
                          selectedService === item.service_name && styles.selectedServiceText,
                        ]}
                      >
                        {item.service_name}
                      </Text>
                    </TouchableOpacity>
                  )}
                  style={styles.servicesList}
                />

                {/* Submit Button */}
                <TouchableOpacity
                  onPress={addService}
                  style={styles.submitBtn}
                >
                  <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
    </View>
  )
}

export default AddServices

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

      services: {
        marginVertical: hp(2),
        marginHorizontal: wp(7),
      },
      serviceText: {
        color: Colors.sooprsblue,
        fontWeight: '500',
        fontSize: FSize.fs22,
      },
      row: {
        justifyContent: 'space-between',
      },
      serviceCard: {
        marginTop: hp(3),
        backgroundColor: Colors.sooprsblue,
        padding: wp(3),
        borderRadius: wp(2),
        marginBottom: hp(1),
        width: wp(40), // Adjust width to fit two cards per row
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      crossIconContainer: {
        marginLeft: wp(2),
      },
      crossIcon: {
        width: wp(3),
        height: hp(3),
      },
      serviceCardText: {
        fontSize: FSize.fs14,
        color: Colors.white,
      },
      noServicesText: {
        fontSize: FSize.fs14,
        color: Colors.gray,
        textAlign: 'center',
        marginTop:hp(5)
      },
      addService: {
        marginTop: hp(5),
        alignItems: 'center',
      },
      modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContent: {
        width: wp(80),
        backgroundColor: '#FFF',
        padding: wp(5),
        borderRadius: wp(2),
      },
      closeIconContainer: {
        alignSelf: 'flex-end',
      },
      modalTitle: {
        fontSize: FSize.fs18,
        fontWeight: 'bold',
        marginBottom: hp(2),
        color: Colors.black,
      },
      modalsec: {
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      labelText: {
        fontSize: FSize.fs14,
        marginVertical: hp(1),
        color: Colors.sooprsblue,
      },
      servicesList: {
        maxHeight: hp(25),
      },
      serviceItem: {
        padding: hp(2),
        borderBottomWidth: 1,
        borderColor: Colors.lightGrey,
      },
      selectedService: {
        backgroundColor: Colors.sooprsblue,
      },
      selectedServiceText: {
        color: Colors.white,
      },
      serviceNewText: {
        fontSize: FSize.fs14,
        color: Colors.black,
      },
      submitBtn: {
        marginTop: hp(3),
        backgroundColor: '#0077FF',
        padding: wp(3),
        alignItems: 'center',
        borderRadius: wp(2),
      },
      submitText: {
        color: '#FFFFFF',
        fontSize: FSize.fs16,
        fontWeight: 'bold',
      },
})