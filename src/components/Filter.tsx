import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  PanResponder, // Added import
} from 'react-native';
import RangeSlider from './RangeSlider';
import { wp, hp } from '../assets/commonCSS/GlobalCSS';
import Colors from '../assets/commonCSS/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Images from '../assets/image';
import Modal from 'react-native-modal';
import ButtonNew from './ButtonNew';
import FSize from '../assets/commonCSS/FSize';
// import Slider from '@react-native-community/slider';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Filter = ({setFilteredProjects }: { setFilteredProjects: any }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCat, setSelectedSubCat] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const timeMapping = {
    'Last 24 hours': 'last_24_hours',
    'Last Week': 'last_7_days',
    'Last Month': 'last_30_days',
  };
  const [minValue, setMinValue] = useState(0); // Default minimum value
  const [maxValueState, setMaxValueState] = useState(10000); 
  const [projectCategories, setprojectCategories] = useState([]);
  const [projectChildCategories, setprojectChildCategories] = useState([]);
  const [loading, isLoading] = useState(false);
  // const [selectedSkills, setSelectedSkills] = useState([]);
  // const [selectedLocations, setSelectedLocations] = useState([]);
  // const [selectedVerification, setSelectedVerification] = useState([]);

  const categories = ['UI/UX', 'Web Design', 'AppDev'];
  const skills = ['Python', 'Bootstrap', 'jQuery'];
  const locations = ['Delhi', 'Pune', 'Mumbai'];
  const verification = ['All', 'Verified'];
  const timePosted = ['Last 24 hours', 'Last Week', 'Last Month']

  const fetchProjectCategories = async () => {
    try {
      const response = await fetch('https://sooprs.com/api2/public/index.php/sr_services_new_cat', {
        method: 'POST'
      });
      const data = await response.json();

      if (data?.msg) {
        // Extract main categories
        setprojectCategories(data.msg);

        // Extract child categories from each main category
        const childCategories = data.msg.flatMap((item) => item.child_services || []);
        setprojectChildCategories(childCategories);
      }
    } catch (error) {
      console.error('Error fetching project categories:', error);
    }
  };

  const handleFilterProjects = async()=>{

    isLoading(true);

    const payload = {
      category: selectedCategories, // Directly use the selected category ID
      timeline: selectedTime ,
      min_budget: minValue,
      max_budget: maxValueState
    };

    console.log('filter payload::::::', payload);

    try {
      const response = await fetch('https://sooprs.com/api2/public/index.php/filter-leads-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set content type to application/json
        },
        body: JSON.stringify(payload), // Convert payload to JSON string
      });
      const data = await response.json();

      if (data) {

      console.log('filtered projects by timeline data:::::', data)
       setFilteredProjects(data);
      }
    } catch (error) {
      console.error('Error fetching project categories:', error);
    } finally{
     isLoading(false);
     setIsVisible(false);
    }

  }
  
  const toggleModal = () => {
    setIsVisible(!isVisible);
    if (!isVisible) fetchProjectCategories(); // Fetch categories when opening the modal
  };

  const handleSelect = (serviceId, type) => {
    if (type === 'category') {
      // Check if the selected category is already active
      if (selectedCategories.includes(serviceId)) {
        // Deselect the category
        setSelectedCategories([]);
        setSelectedSubCat([]);
      } else {
        // Select new category
        const selectedCategory = projectCategories.find(cat => cat.cat_id === serviceId)
        
console.log('selected category::::::',{ id: selectedCategory.id, service_name: selectedCategory.service_name });

// Set selectedCategories with an object containing both id and service_name
setSelectedCategories([{ id: selectedCategory.id, service_name: selectedCategory.service_name }]);

  
        const filteredChildCategories = selectedCategory.child_services
        .filter((child) => child.cat_id === selectedCategory.id)
        .map((child) => ({ id: child.id, service_name: child.service_name })); // Extract id and service_name
      
      console.log('filtered child categories with id and service_name:', filteredChildCategories);
      
      setSelectedSubCat(filteredChildCategories); // Set the filtered array in selectedSubCat
      
      }
    } else if (type === 'subcategory') {
     setSelectedSubCat(serviceId)
    } else if (type === 'timePosted') {
      setSelectedTime(timeMapping[serviceId]);
    }
  };

  const renderItem = ({ item, type }) => {
    const isSelected = type === 'timePosted'
      ? selectedTime.includes(timeMapping[item])
      : type === 'category'
      ? selectedCategories.includes(item.id)
      : selectedSubCat.includes(item.id);
  
    return (
      <TouchableOpacity
        style={[
          styles.item,
          {
            backgroundColor: isSelected ? Colors.sooprsblue : Colors.white,
          },
        ]}
        onPress={() => handleSelect(
          type === 'timePosted' 
            ? item // Directly pass the item for timePosted
            : type === 'category' 
            ? item.cat_id // Pass cat_id for categories
            : item.id, // Pass id for subcategories
          type // Pass the type as well
        )}
      >
        <Text
          style={[
            styles.itemText,
            {
              color: isSelected ? Colors.white : Colors.black,
            },
          ]}
        >
          {type === 'timePosted' ? item : item.service_name}
        </Text>
      </TouchableOpacity>
    );
  };
  
  
  const SwipeableProgressBar = ({ minValue, maxValue, setMinValue, setMaxValueState }) => {
    const [lowValue, setLowValue] = useState(minValue);
    const [highValue, setHighValue] = useState(maxValue);
    const sliderWidth = wp(80); // width of the slider track
    
    // Handling thumb dragging
    const panResponderLow = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        const newLowValue = Math.min(
          Math.max(0, lowValue + gesture.dx / sliderWidth * (maxValue - minValue)),
          highValue - 1
        );
        setLowValue(newLowValue);
        setMinValue(newLowValue);
      },
    });
  
    const panResponderHigh = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        const newHighValue = Math.max(
          Math.min(maxValue, highValue + gesture.dx / sliderWidth * (maxValue - minValue)),
          lowValue + 1
        );
        setHighValue(newHighValue);
        setMaxValueState(newHighValue);
      },
    });
  
    return (
      <View style={styles.container}>
        <View style={styles.sliderTrack}>
          <View style={[styles.rail, { width: `${(lowValue - minValue) / (maxValue - minValue) * 100}%` }]} />
          <View style={[styles.selectedRail, { width: `${(highValue - lowValue) / (maxValue - minValue) * 100}%` }]} />
          <View style={[styles.rail, { width: `${(maxValue - highValue) / (maxValue - minValue) * 100}%` }]} />
          
          {/* Low Thumb */}
          <View style={[styles.thumb, { left: `${(lowValue - minValue) / (maxValue - minValue) * 100}%` }]} {...panResponderLow.panHandlers} />
  
          {/* High Thumb */}
          <View style={[styles.thumb, { left: `${(highValue - minValue) / (maxValue - minValue) * 100}%` }]} {...panResponderHigh.panHandlers} />
        </View>
  
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>{Math.round(lowValue)}</Text>
          <Text style={styles.labelText}>{Math.round(highValue)}</Text>
        </View>
      </View>
    );
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
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.section}>
              <View style={styles.categorySection}>
              <Text style={styles.sectionTitle}>Category</Text>
              <TouchableOpacity onPress={()=>{}}>
                <Text style={styles.viewalltext}>View All ></Text>
              </TouchableOpacity>
              </View>
              <FlatList
                data={projectCategories}
                renderItem={item => renderItem({ ...item, type: 'category' })}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
            {selectedSubCat.length > 0 && ( // Only show Sub Category section if there are child categories
      <View style={styles.section}>
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Sub Category</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.viewalltext}>View All ></Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={selectedSubCat}
          renderItem={(item) => renderItem({ ...item, type: 'subcategory' })}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    )}
           <View style={styles.section}>
            <View style={styles.categorySection}>
              <Text style={styles.sectionTitle}>Price</Text>
              </View>
              <RangeSlider/>
            </View> 
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Time Posted</Text>
              <FlatList
                data={timePosted}
                renderItem={item => renderItem({ ...item, type: 'timePosted' })}
                keyExtractor={item => item}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
            {/* <View style={styles.section}>
            <View style={styles.categorySection}>
              <Text style={styles.sectionTitle}>Category</Text>
              <TouchableOpacity onPress={()=>{}}>
                <Text style={styles.viewalltext}>View All ></Text>
              </TouchableOpacity>
              </View>
              <FlatList
                data={locations}
                renderItem={item => renderItem({ ...item, type: 'location' })}
                keyExtractor={item => item}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>  */}
            </ScrollView>
            <ButtonNew
                imgSource={undefined}
                btntext={
                  loading ? (
                    <ActivityIndicator color={Colors.white} />
                  ) : (
                    'Show Results'
                  )
                }
                bgColor={Colors.sooprsblue}
                textColor={Colors.white}
                onPress={handleFilterProjects}
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
    height: screenHeight * 0.6,
    width: screenWidth * 0.9, 
  },

  categorySection:{

    flexDirection:'row',
    justifyContent:'space-between'

  },
  sectionTitle: {
    fontSize: wp(5),
    color: Colors.black,
    fontWeight: 'bold',
  },
  viewalltext: {
    fontSize: wp(4),
    color: Colors.sooprsblue,
  },

  viewalltext:{
    color:Colors.sooprsblue,
    fontWeight:'bold',
    fontSize:FSize.fs13
  },

  
  container: {
    width: '90%',
    marginHorizontal:wp(2),
    paddingVertical: wp(2),
    // paddingHorizontal:wp(7)
  },
  sliderTrack: {
    width: '100%',
    height: wp(2),
    backgroundColor: Colors.gray,
    borderRadius: wp(1),
    flexDirection: 'row',
    position: 'relative',
  },
  rail: {
    height: '100%',
    backgroundColor: Colors.gray,
  },
  selectedRail: {
    height: '100%',
    backgroundColor: Colors.sooprsblue,
  },
  thumb: {
    width: wp(4),
    height: wp(4),
    borderRadius: wp(2),
    backgroundColor: Colors.sooprsblue,
    position: 'absolute',
    top: -wp(1),
  },

  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(0.3),
    marginTop:hp(1)
  },
  labelText: {
    fontSize: 14,
    color:Colors.black
  },

  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  headerText: {
    fontSize: FSize.fs18,
    fontWeight: 'bold',
    color: Colors.black,
  },
  resetButton: {
    color: Colors.gray,
    fontWeight:'bold',
    fontSize: FSize.fs14,
  },
  section: {
    marginBottom: hp(3),
  },
  sectionTitle: {
    fontSize: FSize.fs17,
    fontWeight: 'bold',
    marginBottom: hp(3),
    color: Colors.black,
  },
  item: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
    marginRight: wp(4),
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: Colors.gray,
    alignItems: 'center',
  },
  itemText: {
    fontSize: FSize.fs13,
  },
  backButton: {
    width: wp(5),
    height: hp(5),
  },
});

export default Filter;
