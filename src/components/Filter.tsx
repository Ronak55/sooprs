import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  AsyncStorage,
} from 'react-native';
import {wp, hp} from '../assets/commonCSS/GlobalCSS';
import Colors from '../assets/commonCSS/Colors';
import Images from '../assets/image';
import Modal from 'react-native-modal';
import ButtonNew from './ButtonNew';
import FSize from '../assets/commonCSS/FSize';

const Filter = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedVerification, setSelectedVerification] = useState([]);

  const categories = ['UI/UX', 'Web Design', 'AppDev'];
  const skills = ['Python', 'Bootstrap', 'jQuery'];
  const locations = ['Delhi', 'Pune', 'Mumbai'];
  const verification = ['All', 'Verified'];

  const toggleModal = () => setIsVisible(!isVisible);

  const handleSelect = (item, type) => {
    const setSelected =
      type === 'category'
        ? setSelectedCategories
        : type === 'skill'
        ? setSelectedSkills
        : type === 'location'
        ? setSelectedLocations
        : setSelectedVerification;
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item],
    );
  };

  const renderItem = ({item, type}) => (
    <TouchableOpacity
      style={[
        styles.item,
        {
          backgroundColor: (type === 'category'
            ? selectedCategories
            : type === 'skill'
            ? selectedSkills
            : type === 'location'
            ? selectedLocations
            : selectedVerification
          ).includes(item)
            ? Colors.sooprsblue
            : Colors.white,
        },
      ]}
      onPress={() => handleSelect(item, type)}>
      <Text
        style={[
          styles.itemText,
          {
            color: (type === 'category'
              ? selectedCategories
              : type === 'skill'
              ? selectedSkills
              : type === 'location'
              ? selectedLocations
              : selectedVerification
            ).includes(item)
              ? Colors.white
              : Colors.black,
          },
        ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const saveToAsyncStorage = async () => {
    try {
      await AsyncStorage.setItem(
        'selectedCategories',
        JSON.stringify(selectedCategories),
      );
      await AsyncStorage.setItem(
        'selectedSkills',
        JSON.stringify(selectedSkills),
      );
      await AsyncStorage.setItem(
        'selectedLocations',
        JSON.stringify(selectedLocations),
      );
      await AsyncStorage.setItem(
        'selectedVerification',
        JSON.stringify(selectedVerification),
      );
    } catch (error) {
      console.error('Error saving data', error);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.filterButton} onPress={toggleModal}>
        <Image
          source={Images.filterIcon}
          resizeMode="contain"
          style={styles.filtericon}
        />
      </TouchableOpacity>
      <Modal
        isVisible={isVisible}
        onBackdropPress={toggleModal}
        style={styles.modal}
        backdropOpacity={0.3}
        avoidKeyboard={true}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        animationInTiming={300}
        animationOutTiming={300}
        useNativeDriver={true}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={toggleModal}>
              <Image
                source={Images.chevronRight}
                style={styles.backButton}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>Filter</Text>
            <TouchableOpacity onPress={toggleModal}>
              <Text style={styles.resetButton}>Reset</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <FlatList
              data={categories}
              renderItem={item => renderItem({...item, type: 'category'})}
              keyExtractor={item => item}
              horizontal
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <FlatList
              data={skills}
              renderItem={item => renderItem({...item, type: 'skill'})}
              keyExtractor={item => item}
              horizontal
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Verification</Text>
            <FlatList
              data={verification}
              renderItem={item => renderItem({...item, type: 'verification'})}
              keyExtractor={item => item}
              horizontal
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <FlatList
              data={locations}
              renderItem={item => renderItem({...item, type: 'location'})}
              keyExtractor={item => item}
              horizontal
            />
          </View>
          <ButtonNew
            imgSource={undefined}
            btntext="Show 250 Results"
            bgColor={Colors.sooprsblue}
            textColor={Colors.white}
            onPress={() => {
              saveToAsyncStorage();
              toggleModal(); // Optionally close the modal after saving
            }}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    backgroundColor: '#0476FC',
    width: wp(12),
    height: hp(5),
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtericon: {
    tintColor: '#FFFFFF',
    height: hp(3.5),
    width: wp(3.5),
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp(5),
    borderBottomLeftRadius: wp(5),
    padding: wp(5),
    height: hp(70),
    width: wp(75),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  headerText: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: Colors.black,
  },
  resetButton: {
    color: Colors.sooprsblue,
    fontSize: wp(4),
  },
  section: {
    marginBottom: hp(6),
  },
  sectionTitle: {
    fontSize: FSize.fs17,
    fontWeight: 'bold',
    marginBottom: hp(3),
    color: Colors.black,
  },
  item: {
    padding: wp(3),
    marginRight: wp(10),
    borderRadius: wp(10),
    borderWidth: 1,
    borderColor: Colors.gray,
    alignItems: 'center',
  },
  itemText: {
    fontSize: FSize.fs15,
  },
  showButton: {
    backgroundColor: Colors.sooprsblue,
    paddingVertical: hp(1.5),
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  showButtonText: {
    color: Colors.white,
    fontSize: wp(4),
  },
  backButton: {
    width: wp(5),
    height: hp(5),
  },
});

export default Filter;
