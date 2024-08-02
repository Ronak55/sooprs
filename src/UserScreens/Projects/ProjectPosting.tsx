import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import React, {useState} from 'react';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FSize from '../../assets/commonCSS/FSize';
import Colors from '../../assets/commonCSS/Colors';
import {wp, hp} from '../../assets/commonCSS/GlobalCSS';
import Images from '../../assets/image';
import DropDownPicker from 'react-native-dropdown-picker';
import ButtonNew from '../../components/ButtonNew';
import CInput from '../../components/CInput';

const ProjectPosting = ({navigation}: {navigation: any}) => {
  const [activeCategory, setActiveCategory] = useState(1);
  const [isCategory, setIsCategory] = useState(true);
  const [isBudget, setIsBudget] = useState(false);
  const [isProject, setIsProject] = useState(false);
  const [category, setCategory] = useState('');
  const [open, setOpen] = useState(false);
  const [serviceName, setserviceName] = useState('');
  const [requirements, setRequirements] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [minBudget, setminBudget] = useState('');
  const [maxBudget, setmaxBudget] = useState('');
  const [projectTitle, setprojectTitle] = useState('');
  const [projectDescription, setprojectDescription] = useState('');


  const [completedSections, setCompletedSections] = useState({
    category: false,
    budget: false,
    project: false,
  });

  const [items, setItems] = useState([
    {label: 'Website Development', value: 'Website Development'},
    {label: 'App Development', value: 'App Development'},
    {label: 'Hybrid App Development', value: 'Hybrid App Development'},
    {label: 'Digital Marketing', value: 'Digital Marketing'},
  ]);

  const postProgress = [
    {
      id: '1',
      name: 'Category',
    },

    {
      id: '2',
      name: 'Budget',
    },

    {
      id: '3',
      name: 'Submit',
    },
  ];

  const budgetRange = ['0-500', '500-1000', '1000-2000', '2000-3000', 'Other'];
  
  const handlebackButton = () => {
    if (activeCategory > 1) {
      setActiveCategory(prevCategory => prevCategory - 1);
      
      if (activeCategory === 2) {
        setIsCategory(true);
        setIsBudget(false);
        setCompletedSections(prev => ({...prev, budget: false}));
      }
      
      if (activeCategory === 3) {
        setIsBudget(true);
        setIsProject(false);
      }
    } else {
      navigation.goBack(); // Navigate back to previous screen if on the first step
    }
  };
  

  const handleNextPress = async () => {
    // Check if category section is completed
    if (isCategory && (!category || !serviceName || !requirements)) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Please complete the category details.',
      });
      return;
    }

    // Check if budget section is completed
    if (isBudget) {
      if (
        !selectedBudget ||
        (selectedBudget === 'Other' && (!minBudget || !maxBudget))
      ) {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Please mention your budget.',
        });
        return;
      }
    }

    if (isProject && (!projectTitle || !projectDescription)) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Please complete the project details.',
      });
      return;
    }

    const data = {
      serviceName,
      requirements,
      selectedBudget,
      minBudget,
      maxBudget,
      projectTitle,
      projectDescription,
    };
    try {
      await AsyncStorage.setItem('projectData', JSON.stringify(data));
      console.log('Data saved successfully');
    } catch (error) {
      console.log('Error saving data:', error);
    }

    if (activeCategory === 1) {
      setIsCategory(!isCategory);
      setIsBudget(!isBudget);
      setCompletedSections(prev => ({...prev, category: true}));
    }

    if (activeCategory === 2) {
      setIsBudget(!isBudget);
      setIsProject(!isProject);
      setCompletedSections(prev => ({...prev, budget: true}));
    }

    if (activeCategory === 3) {
      setIsProject(!isProject);
      navigation.navigate('Success', {
        successMessage: 'Your project has been posted successfully.',
        btnText: 'Back to home screen',
        navigateTo: 'ClientLoggedIn',
      });
      setCompletedSections(prev => ({...prev, project: true}));
    }

    setActiveCategory(prevCategory =>
      prevCategory < postProgress.length ? prevCategory + 1 : prevCategory,
    );
  };

  const handleBudgetSelect = (budget: string) => {
    setSelectedBudget(budget);
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.projectPosting}>
        <View style={styles.totalheading}>
          <TouchableOpacity
            onPress={handlebackButton}>
            <Image
              source={Images.backArrow}
              style={styles.backArrow}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={styles.heading}>
            <View style={styles.headingTitles}>
              <Text style={styles.headingTitle}>Let us know what</Text>
              <Text style={[styles.headingTitle, styles.headingtitleTwo]}>
                {' '}
                you need
              </Text>
            </View>
            <View style={styles.headingDesc}>
              <Text style={styles.descText}>
                {' '}
                Let's create the perfect brief together. The more details you
                include the better
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.postProgress}>
          {postProgress.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <View>
                  <View
                    style={[
                      styles.horizontalLine,
                      activeCategory > parseInt(item.id) - 1 &&
                        styles.activeLine,
                    ]}
                  />
                </View>
              )}
              <View style={styles.progressItem}>
                <View
                  style={[
                    styles.circleOne,
                    completedSections[item.name.toLowerCase()] &&
                      styles.completedCircle,
                    activeCategory === parseInt(item.id) &&
                      !completedSections[item.name.toLowerCase()] &&
                      styles.activeCircle,
                  ]}>
                  {completedSections[item.name.toLowerCase()] ? (
                    <Image source={Images.checkblue} style={styles.checkIcon} />
                  ) : (
                    <Text
                      style={[
                        styles.oneText,
                        activeCategory === parseInt(item.id) &&
                          !completedSections[item.name.toLowerCase()] &&
                          styles.activeText,
                      ]}>
                      {item.id}
                    </Text>
                  )}
                </View>
                <View style={styles.nameOne}>
                  <Text
                    style={[
                      styles.nameText,
                      completedSections[item.name.toLowerCase()] &&
                        styles.completedText,
                      activeCategory === parseInt(item.id) &&
                        !completedSections[item.name.toLowerCase()] &&
                        styles.activeText,
                    ]}>
                    {item.name}
                  </Text>
                </View>
              </View>
            </React.Fragment>
          ))}
        </View>

        {isCategory && (
          <View style={styles.categories}>
            <View style={styles.categoryPickerContainer}>
              <DropDownPicker
                open={open}
                value={category}
                items={items}
                setOpen={setOpen}
                setValue={setCategory}
                setItems={setItems}
                style={styles.categoryPickerStyle}
                dropDownContainerStyle={styles.dropDownContainerStyle}
                placeholder="Select Category"
                labelStyle={styles.labelStyle}
                containerStyle={styles.categoryPicker}
                textStyle={styles.categoryTextStyle}
              />
            </View>
            <View style={styles.serviceSection}>
              <CInput
                title="Service Name"
                name="Enter Service Name"
                isPassword={false}
                newlabel={false}
                style={styles.serviceName}
                value={serviceName}
                setValue={setserviceName}
                keyboardType="default"
              />

              <CInput
                title="Requirements"
                name="Write your requirements here..."
                isPassword={false}
                newlabel={false}
                style={undefined}
                value={requirements}
                setValue={setRequirements}
                keyboardType="default"
                multiline={true} // Enable multiline for requirements
                numberOfLines={8} // Set number of lines
              />
            </View>
          </View>
        )}
        {isBudget && (
          <View style={styles.budgetSection}>
            <Text style={styles.budget}>
              What is your approximate budget (in US Dollars) ?
            </Text>
            <View style={styles.budgetGrid}>
              {budgetRange.map(budget => (
                <View style={styles.budgetArea} key={budget}>
                  <TouchableOpacity
                    style={styles.budgetOption}
                    onPress={() => handleBudgetSelect(budget)}>
                    <View
                      style={[
                        styles.radioButton,
                        selectedBudget === budget && styles.radioButtonSelected,
                      ]}
                    />
                    <Text style={styles.budgetOptionText}>{budget}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            {selectedBudget === 'Other' && (
              <View style={styles.budgetNew}>
                <CInput
                  title="Min. Budget"
                  name="Enter Min. Budget"
                  newlabel={false}
                  style={undefined}
                  setValue={(val: any) => setminBudget(val)}
                  value={minBudget}
                  isPassword={false}
                  keyboardType={'numeric'}
                />

                <CInput
                  title="Max. Budget"
                  name="Enter Max. Budget"
                  newlabel={false}
                  style={undefined}
                  setValue={(val: any) => setmaxBudget(val)}
                  value={maxBudget}
                  isPassword={false}
                  keyboardType={'numeric'}
                />
              </View>
            )}
          </View>
        )}
        {isProject && (
          <View style={styles.projectSection}>
            <Text style={styles.projectDesc}>Project Description</Text>
            <CInput
              title="Project Title"
              name="Enter your project title"
              newlabel={false}
              style={undefined}
              setValue={setprojectTitle}
              value={projectTitle}
              isPassword={false}
              keyboardType={'default'}
            />
            <CInput
              title="Project Description"
              name="Enter your project description"
              newlabel={false}
              style={undefined}
              setValue={setprojectDescription}
              value={projectDescription}
              isPassword={false}
              keyboardType={'default'}
              multiline={true}
              numberOfLines={10}
            />
          </View>
        )}
        <View style={styles.nextbtn}>
          <ButtonNew
            imgSource={undefined}
            btntext="Next"
            bgColor={Colors.sooprsblue}
            textColor={Colors.white}
            onPress={handleNextPress}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ProjectPosting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  projectPosting: {
    marginHorizontal: wp(3),
    marginVertical: hp(5),
    gap: wp(3),
  },

  totalheading: {
    flexDirection: 'row',
    gap: wp(5),
  },

  backArrow: {
    width: wp(8),
    height: hp(8),
  },

  heading: {
    flexDirection: 'column',
    marginTop: hp(2.1),
    gap: 5,
  },

  headingTitles: {
    flexDirection: 'row',
  },

  headingTitle: {
    color: Colors.black,
    fontSize: FSize.fs20,
    fontWeight: '600',
  },

  headingtitleTwo: {
    color: Colors.sooprsblue,
  },

  headingDesc: {
    // flexWrap:'wrap',
    width: wp(68),
  },

  descText: {
    fontSize: FSize.fs12,
    color: Colors.black,
  },

  postProgress: {
    flexDirection: 'row',
    marginTop: hp(5),
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  progressItem: {
    flexDirection: 'column',
    gap: wp(2),
    alignItems: 'center',
  },

  circleOne: {
    width: wp(12),
    height: hp(6),
    borderRadius: wp(15),
    borderColor: Colors.gray,
    borderWidth: wp(0.3),
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  oneText: {
    color: Colors.black,
  },

  nameOne: {
    justifyContent: 'space-around',
  },

  nameText: {
    color: '#49454F',
    fontSize: FSize.fs13,
  },

  activeCircle: {
    borderColor: Colors.sooprsblue,
    borderWidth: wp(0.5),
  },

  activeText: {
    color: Colors.sooprsblue,
  },

  horizontalLine: {
    width: wp(18),
    height: wp(0.5),
    marginBottom: wp(5),
    backgroundColor: Colors.gray,
    // marginHorizontal: wp(1),
  },

  activeLine: {
    backgroundColor: Colors.sooprsblue,
  },

  categories: {
    marginHorizontal: wp(3),
    marginTop: hp(2),
  },

  categoryPickerContainer: {
    width: '55%',
  },

  categoryPicker: {
    height: hp(5),
  },

  categoryPickerStyle: {
    borderWidth: 1,
    borderColor: '#2874F0',
    borderRadius: 8,
    // color:Colors.white,
    backgroundColor: Colors.sooprsblue,
    height: hp(4),
  },

  categoryTextStyle: {
    fontSize: FSize.fs14,
    textAlign: 'center',
    color: Colors.black,
  },

  dropDownContainerStyle: {
    borderWidth: 1,
    flexDirection: 'row',
    borderColor: 'gray',
  },

  labelStyle: {
    fontSize: FSize.fs13,
    textAlign: 'center',
    color: Colors.white,
  },

  serviceSection: {
    marginTop: hp(5),
    flexDirection: 'column',
    gap: wp(1),
  },

  serviceName: {
    marginBottom: hp(2),
  },

  requirements: {
    marginBottom: hp(1),
  },

  nextbtn: {
    alignItems: 'center',
  },

  budgetSection: {
    marginHorizontal: wp(3),
    marginTop: hp(2),
  },

  budget: {
    color: Colors.black,
    fontSize: FSize.fs14,
    fontWeight: '600',
  },

  budgetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(1),
  },

  radioButton: {
    width: wp(4),
    height: wp(4),
    borderRadius: wp(2),
    borderWidth: wp(0.3),
    borderColor: Colors.gray,
    marginRight: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioButtonSelected: {
    backgroundColor: Colors.sooprsblue,
  },

  budgetOptionText: {
    fontSize: FSize.fs14,
    color: Colors.black,
  },

  budgetArea: {
    marginVertical: hp(2),
    width: wp(40),
    height: hp(6),
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: wp(2),
    paddingLeft: wp(3),
  },

  budgetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  budgetNew: {
    flexDirection: 'column',
  },

  projectSection: {
    marginHorizontal: wp(3),
    marginTop: hp(2),
  },

  projectDesc: {
    color: Colors.black,
    marginBottom: wp(7),
    fontWeight: '600',
  },

  completedCircle: {
    borderColor: Colors.sooprsblue,
    borderWidth: wp(0.5),
    backgroundColor: Colors.sooprsblue,
  },

  completedText: {
    color: Colors.sooprsblue,
  },

  checkIcon: {
    width: wp(5),
    height: hp(5),
    objectFit:'contain',
    tintColor:Colors.white
  },
});
