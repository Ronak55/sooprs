import {StyleSheet, Text, View, FlatList} from 'react-native';
import React, {useEffect} from 'react';
import ServicesCard from '../../components/ServicesCard';
import {hp, wp} from '../../assets/commonCSS/GlobalCSS';

const Skills = ({route}: {route: any}) => {
  // const skills = ['PHP', 'Java', 'HTML & CSS', 'Bootstrap', 'jQuery', 'Photoshop', 'Figma', 'Adobe Illustrator', 'Canva', 'InDesign'];

  const skills = route.params?.skills || [];

  const renderItem = ({item}: {item: any}) => <ServicesCard item={item} />;

  useEffect(() => {
    console.log('skills from route:::::::::', route.params.skills);
  }, []);

  return (
    <View style={styles.skillsContainer}>
      {skills.length > 0 ? ( // Check if there are skills to render
        <FlatList
          data={skills}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text>No Skills Found</Text> // Display this if no skills are passed
      )}
    </View>
  );
};

export default Skills;

const styles = StyleSheet.create({
  skillsContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: wp(1),
  },
  list: {
    justifyContent: 'space-between',
  },
});
