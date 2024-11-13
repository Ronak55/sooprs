import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../assets/commonCSS/Colors';
import {hp, wp} from '../assets/commonCSS/GlobalCSS';
import FSize from '../assets/commonCSS/FSize';
import Images from '../assets/image';
import ButtonNew from './ButtonNew';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useIsFocused } from '@react-navigation/native';

const AddSkills = ({navigation, route}: {navigation: any, route:any}) => {

  const {skillsList} = route.params; 
  const [visible, setVisible] = useState(false);
  const [skills, setSkills] = useState([]); // Skills from API
  const [selectedSkill, setSelectedSkill] = useState(null); // Selected skill
  const [skillId, setSkillId] = useState(null); // Selected skill ID
  const [addedSkills, setAddedSkills] = useState([]); // Submitted skills list
  const [userId, setUserId] = useState(null);
  const isFocused = useIsFocused();

  // Fetch skills from the API when modal opens
  const fetchSkills = async () => {
    try {
      const response = await fetch(
        'https://sooprs.com/api2/public/index.php/sp_skills_all',
        {
          method: 'POST',
        },
      );
      const result = await response.json();
      if (result.status == 200) {
        // console.log('skills info:::::::::::::::', result.msg);
        const formattedData = result.msg.map(skill => ({
          id: skill.skill_id,
          skill_name: skill.skill_name,
        }));
        console.log('skills formatted:::::::::', formattedData)
        setSkills(formattedData);
      } else {
        console.log('skills not fetched...');
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to fetch skills',
        text2: 'Please try again later.',
      });
    }
  };

  useEffect(()=>{

    fetchSkills();
     
  }, [isFocused])

  const getSkillsList = ()=>{
    console.log('skills list:::::;', skillsList)
    const newSkillsNames = skillsList.map((skillsId:any) => {
      const skillsMap = skills.find((skill:any) => skill.id === skillsId); 

      return skillsMap;
    });
    console.log('added skills names:::::::;;', newSkillsNames);
    setAddedSkills(newSkillsNames.filter(Boolean)); // Filter out any null values
  }

  useEffect(() => {
    getSkillsList();
  }, [skills]);

  // Get the user ID from AsyncStorage
  const getUserId = async () => {
    const id = await AsyncStorage.getItem('uid');
    const cleanedId = id ? id.replace(/^"|"$/g, '') : null;
    setUserId(cleanedId);
  };
  // Handle adding skill
  const handleSubmit = async () => {
    if (skillId) {
      try {
        // Prepare FormData payload
        const formData = new FormData();
        formData.append('skill', skillId);
        formData.append('profid', userId);

        const response = await fetch(
          'https://sooprs.com/api2/public/index.php/addSkillForm',
          {
            method: 'POST',
            body: formData,
          },
        );

        const result = await response.json();

        if (result.status == 200) {

            console.log('skill added :::::::::', result.msg);
          // Update addedSkills with the new skill
          const newSkill = skills.find(skill => skill.skill_id === skillId);
          setAddedSkills(prevSkills => [...prevSkills, newSkill]);
          Toast.show({
            type: 'success',
            text1: 'Skill Added',
            text2: 'Your skill was successfully added.',
          });
          setVisible(false); // Close modal on success
        } else {

            console.log('response while error:::::', response)

          Toast.show({
            type: 'error',
            text1: 'Error Adding Skill',
            text2: result.message || 'Something went wrong.',
          });
        }
      } catch (error) {
        console.error('Error adding skill:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to add skill. Please try again.',
        });
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'No Skill Selected',
        text2: 'Please select a skill to proceed.',
      });
    }
  };

  const removeSkill = async skillId => {
    const formData = new FormData();
    formData.append('dataSkillValue', skillId);
    formData.append('dataPrfValue', userId);

    try {
      const response = await fetch(
        'https://sooprs.com/api2/public/index.php/remove_professional_skill',
        {
          method: 'POST',
          body: formData,
        },
      );

      const res = await response.json();

      if (response.status === 200) {
        // Remove skill from local state
        setAddedSkills(prevSkills =>
          prevSkills.filter(skill => skill.skill_id !== skillId),
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

  // Open the modal
  const openModal = () => {
    setVisible(true);
    fetchSkills();
    getUserId();
  };

  // Close the modal
  const closeModal = () => {
    setVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerSection}>
        <TouchableOpacity onPress={() => navigation.navigate('Account')}>
          <Image
            source={Images.backArrow}
            resizeMode="contain"
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Skills</Text>
      </View>

      {/* Skills Section */}
      <View style={styles.skills}>
        <Text style={styles.skillText}>Skills</Text>
        {addedSkills.length > 0 ? (
          <FlatList
            data={addedSkills}
            keyExtractor={item => item.skill_id}
            numColumns={2} // Two columns
            renderItem={({item}) => (
              <View style={styles.skillCard}>
                <Text style={styles.skillCardText}>{item.skill_name}</Text>
                {/* Cross Icon for Deleting */}
                <TouchableOpacity
                  onPress={() => removeSkill(item.skill_id)}
                  style={styles.crossIconContainer}>
                  <Image
                    source={Images.crossIcon}
                    style={styles.crossIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            )}
            nestedScrollEnabled
            columnWrapperStyle={styles.row}
          />
        ) : (
          <Text style={styles.noSkillsText}>No skills added yet!</Text>
        )}
      </View>

      {/* Add Skill Button */}
      <View style={styles.addSkill}>
        <ButtonNew
          imgSource={null}
          btntext="Add Skills"
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
        onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {/* Close Icon */}
                <View style={styles.modalsec}>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.closeIconContainer}>
                    <Image
                      source={Images.crossIcon}
                      style={styles.crossIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>

                  {/* Modal Title */}
                  <Text style={styles.modalTitle}>Add Skill</Text>
                </View>

                {/* Custom Scrollable Dropdown */}
                <Text style={styles.labelText}>Select Skill</Text>
                <FlatList
                  data={skills}
                  keyExtractor={item => item.skill_id}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedSkill(item.skill_name);
                        setSkillId(item.skill_id);
                      }}
                      style={[
                        styles.skillItem,
                        selectedSkill === item.skill_name &&
                          styles.selectedSkill,
                      ]}>
                      <Text
                        style={[
                          styles.skillNewText,
                          selectedSkill === item.skill_name &&
                            styles.selectedSkillText,
                        ]}>
                        {item.skill_name}
                      </Text>
                    </TouchableOpacity>
                  )}
                  style={styles.skillsList}
                />

                {/* Submit Button */}
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={styles.submitBtn}>
                  <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

export default AddSkills;

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

  skillText: {
    color: Colors.sooprsblue,
    fontWeight: '500',
    fontSize: FSize.fs22,
  },

  skills: {
    marginVertical: hp(2),
    marginHorizontal: wp(7),
  },

  row: {
    justifyContent: 'space-between', // Space between cards
  },

  skillCard: {
    marginTop:hp(2),
    backgroundColor: Colors.sooprsblue,
    padding: wp(3),
    borderRadius: wp(2),
    marginBottom: hp(1),
    width: wp(40), // Adjust width to fit two cards per row
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensure text and icon are spaced
  },

  crossIconContainer: {
    marginLeft: wp(2),
  },

  crossIcon: {
    width: wp(5),
    height: hp(5),
    // tintColor:Colors.white
  },

  skillCardText: {
    fontSize: FSize.fs14,
    color: Colors.white,
  },

  noSkillsText: {
    fontSize: FSize.fs14,
    color: Colors.gray,
    textAlign: 'center',
  },

  addSkill: {
    marginTop: hp(0),
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
  crossIcon: {
    width: wp(3),
    height: hp(3),
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
  skillsList: {
    maxHeight: hp(25),
  },
  skillItem: {
    padding: hp(2),
    borderBottomWidth: 1,
    borderColor: Colors.lightGrey,
  },
  selectedSkill: {
    backgroundColor: Colors.sooprsblue,
  },

  selectedSkillText: {
    color: Colors.white,
  },

  skillNewText: {
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
});
